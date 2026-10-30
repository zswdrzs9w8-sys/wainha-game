import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import {
  CHALLENGES,
  challengeDifficulty,
  distanceKm,
  type ChallengeMode,
  type GameDifficulty,
  type GameMode,
  type PlayType,
} from "../../../lib/game";
import world from "world-atlas/countries-110m.json";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = "force-dynamic";

type Player = {
  id: string;
  token: string;
  name: string;
  color: string;
  score: number;
  joinedAt: number;
};
type Submission = {
  playerId: string;
  lat: number;
  lng: number;
  at: number;
  distance?: number;
  points?: number;
  rank?: number;
  rankPoints?: number;
  precisionPoints?: number;
  speedPoints?: number;
  multiplier?: number;
  countryHit?: boolean;
};
type Room = {
  code: string;
  hostToken: string;
  playType: PlayType;
  mode: GameMode;
  difficulty: GameDifficulty;
  rounds: number;
  timerSeconds: number;
  phase: "lobby" | "round" | "results" | "finished";
  round: number;
  players: Player[];
  challengeId: string | null;
  used: string[];
  deadline: number | null;
  roundStartedAt: number | null;
  hintCount: number;
  submissions: Submission[];
  history: {
    round: number;
    challengeId: string;
    winner: string | null;
    bestDistance: number | null;
  }[];
  createdAt: number;
};
const COLORS = [
  "#ffcc4d",
  "#55d6be",
  "#ff6b6b",
  "#6c9cff",
  "#c47aff",
  "#ff934f",
  "#67df75",
  "#ef70ba",
];
const countryFeatures = (
  feature(world as any, (world as any).objects.countries) as any
).features as any[];
const countryById = new Map(
  countryFeatures.map((country) => [
    String(country.id).padStart(3, "0"),
    country,
  ]),
);
const makeCode = () =>
  Array.from(
    crypto.getRandomValues(new Uint8Array(5)),
    (n) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[n % 32],
  ).join("");
const token = () => crypto.randomUUID();
const db = () => {
  if (!env.DB) throw new Error("Database unavailable");
  return env.DB;
};
async function getRoom(roomCode: string) {
  const row = await db()
    .prepare("SELECT state FROM rooms WHERE code = ?")
    .bind(roomCode)
    .first<{ state: string }>();
  return row ? (JSON.parse(row.state) as Room) : null;
}
async function save(room: Room) {
  await db()
    .prepare(
      "INSERT INTO rooms (code,state,updated_at) VALUES (?,?,?) ON CONFLICT(code) DO UPDATE SET state=excluded.state, updated_at=excluded.updated_at",
    )
    .bind(room.code, JSON.stringify(room), Date.now())
    .run();
}
function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
function current(room: Room) {
  return CHALLENGES.find((q) => q.id === room.challengeId)!;
}
function publicView(room: Room, auth: string) {
  const host = auth === room.hostToken,
    me = room.players.find((p) => p.token === auth) || null,
    q = room.challengeId ? current(room) : null,
    reveal = room.phase === "results" || room.phase === "finished";
  return {
    code: room.code,
    host,
    me: me && { id: me.id, name: me.name, color: me.color, score: me.score },
    playType: room.playType,
    mode: room.mode,
    currentMode: q?.mode || null,
    difficulty: room.difficulty || "medium",
    rounds: room.rounds,
    timerSeconds: room.timerSeconds ?? 30,
    hintCount: room.hintCount || 1,
    phase: room.phase,
    round: room.round,
    deadline: room.deadline,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      score: p.score,
      locked: room.submissions.some((s) => s.playerId === p.id),
    })),
    challenge: q && {
      id: q.id,
      title: q.title,
      image: q.image,
      hints: (q.hints || []).slice(0, room.hintCount || 1),
      story: reveal ? q.story : undefined,
      place: reveal ? q.place : undefined,
      country: reveal ? q.country : undefined,
      lat: reveal ? q.lat : undefined,
      lng: reveal ? q.lng : undefined,
    },
    submissions: reveal
      ? room.submissions.map((s) => ({
          ...s,
          name: room.players.find((p) => p.id === s.playerId)?.name,
          color: room.players.find((p) => p.id === s.playerId)?.color,
        }))
      : [],
    history: room.history,
  };
}
function choose(room: Room) {
  const mixedModes: ChallengeMode[] = [
      "place",
      "city",
      "aerial",
      "border",
      "saudi",
    ],
    selectedMode =
      room.mode === "mixed"
        ? mixedModes[(Math.max(1, room.round) - 1) % mixedModes.length]
        : room.mode,
    byMode = CHALLENGES.filter((q) => q.mode === selectedMode),
    byLevel = byMode.filter(
      (q) => challengeDifficulty(q) === (room.difficulty || "medium"),
    ),
    all = byLevel.length ? byLevel : byMode,
    pool = all.filter((q) => !room.used.includes(q.id)),
    source = pool.length ? pool : all;
  const q = source[Math.floor(Math.random() * source.length)],
    now = Date.now();
  room.challengeId = q.id;
  room.used.push(q.id);
  room.submissions = [];
  room.roundStartedAt = now;
  room.deadline =
    (room.timerSeconds ?? 30) > 0
      ? now + (room.timerSeconds ?? 30) * 1000
      : null;
  room.hintCount = 1;
  room.phase = "round";
}
function finishRound(room: Room) {
  if (room.phase !== "round") return;
  const q = current(room),
    countryShape =
      q.mode === "city" && q.countryId
        ? countryById.get(String(q.countryId).padStart(3, "0"))
        : null;
  const measured = room.submissions.map((s) => {
    const distance = distanceKm(s.lat, s.lng, q.lat, q.lng);
    return {
      ...s,
      distance,
      countryHit: countryShape
        ? geoContains(countryShape, [s.lng, s.lat]) || distance <= 60
        : undefined,
    };
  });
  const requireCountry =
    q.mode === "city" && measured.some((s) => s.countryHit === true);
  const sorted = measured.sort(
    (a, b) =>
      (requireCountry
        ? Number(Boolean(b.countryHit)) - Number(Boolean(a.countryHit))
        : 0) ||
      a.distance! - b.distance! ||
      a.at - b.at,
  );
  sorted.forEach((s, i) => {
    const eligible = !requireCountry || s.countryHit === true;
    const distancePoints = !eligible
      ? 0
      : s.distance! < 500
        ? 3
        : s.distance! < 1000
          ? 2
          : s.distance! <= 5000 || i === 0
            ? 1
            : 0;
    s.rank = i + 1;
    s.rankPoints = distancePoints;
    s.precisionPoints = 0;
    s.speedPoints = 0;
    s.multiplier = 1;
    s.points = distancePoints;
    const p = room.players.find((p) => p.id === s.playerId);
    if (p) p.score += s.points;
  });
  room.submissions = sorted;
  room.history.push({
    round: room.round,
    challengeId: q.id,
    winner: sorted[0]?.playerId || null,
    bestDistance: sorted[0]?.distance ?? null,
  });
  room.phase = room.round >= room.rounds ? "finished" : "results";
  room.deadline = null;
}
function maybeFinish(room: Room) {
  if (
    room.phase === "round" &&
    ((room.deadline !== null && Date.now() >= room.deadline) ||
      (room.players.length > 0 &&
        room.submissions.length === room.players.length))
  )
    finishRound(room);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(),
      action = String(body.action || "");
    if (action === "create") {
      const playType: PlayType =
          body.playType === "teams" ? "teams" : "individual",
        mode = body.mode as GameMode,
        difficulty = body.difficulty as GameDifficulty;
      if (
        !["place", "city", "aerial", "border", "saudi", "mixed"].includes(
          mode,
        )
      )
        return fail("اختر نوع تحدٍ صحيحًا");
      if (!["easy", "medium", "hard"].includes(difficulty))
        return fail("اختر مستوى اللعبة");
      let roomCode = makeCode();
      while (await getRoom(roomCode)) roomCode = makeCode();
      const hostToken = token(),
        hostName = String(body.hostName || "")
          .trim()
          .slice(0, 24),
        teamNames =
          playType === "teams" && Array.isArray(body.teamNames)
            ? body.teamNames
                .slice(0, 4)
                .map((n: unknown, i: number) =>
                  String(n || `المجموعة ${i + 1}`)
                    .trim()
                    .slice(0, 24),
                )
                .filter((n: string) => n.length >= 2)
            : [];
      if (playType === "teams" && teamNames.length < 2)
        return fail("اختر مجموعتين على الأقل");
      if (playType === "individual" && hostName.length < 2)
        return fail("اكتب اسم منشئ الغرفة");
      const players: Player[] =
        playType === "individual"
          ? [
              {
                id: token(),
                token: hostToken,
                name: hostName,
                color: COLORS[0],
                score: 0,
                joinedAt: Date.now(),
              },
            ]
          : teamNames.map((name: string, i: number) => ({
              id: token(),
              token: token(),
              name,
              color: COLORS[i],
              score: 0,
              joinedAt: Date.now(),
            }));
      const room: Room = {
        code: roomCode,
        hostToken,
        playType,
        mode,
        difficulty,
        rounds: Math.min(15, Math.max(3, Number(body.rounds) || 5)),
        timerSeconds: Number(body.timerSeconds) === 0 ? 0 : 30,
        phase: "lobby",
        round: 0,
        players,
        challengeId: null,
        used: Array.isArray(body.avoid) ? body.avoid.slice(-80) : [],
        deadline: null,
        roundStartedAt: null,
        hintCount: 1,
        submissions: [],
        history: [],
        createdAt: Date.now(),
      };
      await save(room);
      return NextResponse.json(
        { token: room.hostToken, state: publicView(room, room.hostToken) },
        { status: 201 },
      );
    }
    const roomCode = String(body.code || "")
        .toUpperCase()
        .trim(),
      room = await getRoom(roomCode);
    if (!room) return fail("الغرفة غير موجودة", 404);
    const phaseBeforeCheck = room.phase;
    maybeFinish(room);
    if (action === "join") {
      if (room.phase !== "lobby") return fail("بدأت اللعبة بالفعل", 409);
      if (room.playType === "teams")
        return fail("وضع المجموعات يعمل من جهاز العرض ولا يحتاج جوالات", 409);
      const name = String(body.name || "")
        .trim()
        .slice(0, 24);
      if (name.length < 2)
        return fail(
          room.playType === "teams" ? "اكتب اسم المجموعة" : "اكتب اسم اللاعب",
        );
      if (room.players.some((p) => p.name === name))
        return fail("الاسم مستخدم في الغرفة");
      if (room.players.length >= 8) return fail("اكتمل عدد المشاركين");
      const player: Player = {
        id: token(),
        token: token(),
        name,
        color: COLORS[room.players.length % COLORS.length],
        score: 0,
        joinedAt: Date.now(),
      };
      room.players.push(player);
      await save(room);
      return NextResponse.json(
        { token: player.token, state: publicView(room, player.token) },
        { status: 201 },
      );
    }
    const auth = String(body.token || ""),
      host = auth === room.hostToken,
      player = room.players.find((p) => p.token === auth);
    if (!host && !player) return fail("رمز الدخول غير صحيح", 403);
    if (action === "state") {
      if (phaseBeforeCheck !== room.phase) await save(room);
      return NextResponse.json(publicView(room, auth));
    }
    if (action === "start") {
      if (!host) return fail("منشئ الغرفة فقط يبدأ اللعبة", 403);
      if (room.phase !== "lobby") return fail("اللعبة بدأت");
      if (room.players.length < 2) return fail("يلزم مشاركان على الأقل");
      room.round = 1;
      choose(room);
    } else if (action === "submit") {
      if (!player || room.phase !== "round")
        return fail("لا يمكن تثبيت الدبوس الآن", 409);
      if (room.submissions.some((s) => s.playerId === player.id))
        return fail("تم تثبيت دبوسك بالفعل", 409);
      const lat = Number(body.lat),
        lng = Number(body.lng);
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      )
        return fail("حدد موقعًا صحيحًا على الخريطة");
      room.submissions.push({ playerId: player.id, lat, lng, at: Date.now() });
      maybeFinish(room);
    } else if (action === "hostSubmit") {
      if (!host || room.playType !== "teams" || room.phase !== "round")
        return fail("لا يمكن تثبيت دبوس المجموعة الآن", 409);
      const selected = room.players.find(
        (p) => p.id === String(body.playerId || ""),
      );
      if (!selected) return fail("اختر مجموعة صحيحة");
      if (room.submissions.some((s) => s.playerId === selected.id))
        return fail("تم تثبيت دبوس هذه المجموعة بالفعل", 409);
      const lat = Number(body.lat),
        lng = Number(body.lng);
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      )
        return fail("حدد موقعًا صحيحًا على الخريطة");
      room.submissions.push({
        playerId: selected.id,
        lat,
        lng,
        at: Date.now(),
      });
      maybeFinish(room);
    } else if (action === "nextHint") {
      if (!host || room.phase !== "round" || current(room).mode !== "city")
        return fail("لا يمكن إظهار التلميح الآن", 409);
      room.hintCount = Math.min(
        current(room).hints?.length || 1,
        (room.hintCount || 1) + 1,
      );
    } else if (action === "reveal") {
      if (!host || room.phase !== "round")
        return fail("لا يمكن إنهاء الجولة", 409);
      finishRound(room);
    } else if (action === "next") {
      if (!host || room.phase !== "results")
        return fail("لا يمكن بدء الجولة التالية", 409);
      room.round += 1;
      choose(room);
    } else return fail("إجراء غير معروف", 404);
    await save(room);
    return NextResponse.json(publicView(room, auth));
  } catch (error) {
    console.error(error);
    return fail("حدث خطأ في اللعبة، حاول مرة أخرى", 500);
  }
}
