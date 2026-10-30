"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { QRCodeSVG } from "qrcode.react";
import {
  DIFFICULTY_LABELS,
  MODE_LABELS,
  type ChallengeMode,
  type GameDifficulty,
  type GameMode,
  type PlayType,
} from "../lib/game";
type Player = {
  id: string;
  name: string;
  color: string;
  score: number;
  locked: boolean;
};
type Submission = {
  playerId: string;
  name: string;
  color: string;
  lat: number;
  lng: number;
  distance: number;
  points: number;
  rank: number;
  rankPoints?: number;
  precisionPoints?: number;
  speedPoints?: number;
  countryHit?: boolean;
  multiplier: number;
  at: number;
};
type State = {
  code: string;
  host: boolean;
  me: null | { id: string; name: string; color: string; score: number };
  playType: PlayType;
  mode: GameMode;
  currentMode: ChallengeMode | null;
  difficulty: GameDifficulty;
  rounds: number;
  timerSeconds: number;
  hintCount: number;
  phase: "lobby" | "round" | "results" | "finished";
  round: number;
  deadline: number | null;
  players: Player[];
  challenge: any;
  submissions: Submission[];
  history: any[];
};
type Session = { code: string; token: string };
type ResultStage = "locating" | "travelling" | "score" | "free";

const MODES: { id: GameMode; icon: string; title: string; desc: string }[] = [
  {
    id: "place",
    icon: "⌖",
    title: "أين هذا المكان؟",
    desc: "صورة معلم أو شارع مشهور",
  },
  {
    id: "city",
    icon: "◈",
    title: "اكتشف المدينة",
    desc: "أربعة تلميحات تظهر تدريجيًا",
  },
  {
    id: "aerial",
    icon: "◎",
    title: "صورة جوية",
    desc: "شاهد المكان من الأعلى",
  },
  {
    id: "border",
    icon: "◇",
    title: "حدود الدولة",
    desc: "تعرف على الدولة من شكلها",
  },
  {
    id: "saudi",
    icon: "◉",
    title: "تحديات السعودية",
    desc: "مدن ومعالم من المملكة",
  },
  {
    id: "mixed",
    icon: "✦",
    title: "جولة العالم",
    desc: "يجمع الأنماط الخمسة بالتناوب",
  },
];
const MODE_GUIDES: Record<
  GameMode,
  { lead: string; steps: string[]; tip: string }
> = {
  place: {
    lead: "تظهر صورة معلم أو شارع مشهور، والمطلوب تحديد مكانه على الكرة الأرضية.",
    steps: [
      "راقب تفاصيل الصورة جيدًا.",
      "دوّر الأرض وقرّب نحو الدولة أو المدينة.",
      "ثبّت الدبوس قبل انتهاء الوقت أو إنهاء الحكم.",
    ],
    tip: "لا يكفي معرفة الدولة؛ الاقتراب من المدينة يرفع نقاط الدقة.",
  },
  city: {
    lead: "يبدأ التحدي بتلميح واحد، ويكشف الحكم التلميحات التالية عند الحاجة.",
    steps: [
      "ابدأ بالقارة ثم الجهة.",
      "حاول وضع الدبوس داخل الدولة الصحيحة أولًا.",
      "إذا لم يصب أحد الدولة يفوز الأقرب إلى المدينة.",
    ],
    tip: "إصابة الدولة شرط التقدم على من وضع دبوسه خارجها.",
  },
  aerial: {
    lead: "تظهر لقطة جوية لمكان طبيعي أو عمراني معروف.",
    steps: [
      "لاحظ شكل الساحل أو الجبال أو المباني.",
      "قارن اتجاهات التضاريس.",
      "ضع الدبوس في أقرب موقع تتوقعه.",
    ],
    tip: "التفاصيل الصغيرة في الصورة الجوية قد تكشف القارة قبل الدولة.",
  },
  border: {
    lead: "يظهر شكل حدود دولة دون اسمها، وعليك وضع الدبوس داخلها.",
    steps: [
      "تعرّف على شكل الحدود.",
      "حدد القارة أولًا.",
      "ضع الدبوس قرب وسط الدولة لتحسين المسافة.",
    ],
    tip: "الخريطة السياسية تعرض حدود الدول بوضوح لتسهيل الاختيار.",
  },
  saudi: {
    lead: "تحديات خاصة بمدن ومعالم المملكة العربية السعودية.",
    steps: [
      "تعرّف على المعلم أو طبيعة المنطقة.",
      "قرّب الكرة نحو المملكة.",
      "حدد المدينة أو الموقع بأكبر دقة.",
    ],
    tip: "المسافات داخل المملكة متقاربة؛ الدقة هنا أهم من مجرد معرفة المنطقة.",
  },
  mixed: {
    lead: "رحلة شاملة تنتقل بين جميع أنواع التحديات دون تكرار النمط نفسه داخل الدورة.",
    steps: [
      "تبدأ بصورة معلم ثم تنتقل إلى المدينة والصورة الجوية.",
      "تتبعها حدود دولة ثم تحدٍ سعودي.",
      "بعد اكتمال الأنماط الخمسة تبدأ دورة جديدة بأسئلة مختلفة.",
    ],
    tip: "استعد لكل شيء؛ نوع التحدي الفعلي يظهر بوضوح مع بداية كل جولة.",
  },
};

async function request(action: string, data: any = {}) {
  const r = await fetch("/api/game", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "تعذر الاتصال");
  return j;
}
function globePoint(lat: number, lng: number, radius = 1) {
  const phi = ((90 - lat) * Math.PI) / 180,
    theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const CONTINENTS = [
  { name: "آسيا", lat: 38, lng: 88 },
  { name: "أفريقيا", lat: 7, lng: 20 },
  { name: "أوروبا", lat: 52, lng: 17 },
  { name: "أمريكا الشمالية", lat: 42, lng: -105 },
  { name: "أمريكا الجنوبية", lat: -18, lng: -60 },
  { name: "أوقيانوسيا", lat: -27, lng: 135 },
  { name: "القارة القطبية", lat: -76, lng: 15 },
];

function FlatFallback({
  pick,
  onPick,
  pins,
  correct,
  cinematic,
}: {
  pick?: { lat: number; lng: number } | null;
  onPick?: (v: { lat: number; lng: number }) => void;
  pins: Submission[];
  correct?: { lat: number; lng: number; place: string } | null;
  cinematic?: { stage: ResultStage; from?: { lat: number; lng: number } };
}) {
  const pos = (lat: number, lng: number) => ({
    left: `${((lng + 180) / 360) * 100}%`,
    top: `${((90 - lat) / 180) * 100}%`,
  });
  const click = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onPick) return;
    const r = e.currentTarget.getBoundingClientRect();
    onPick({
      lng: ((e.clientX - r.left) / r.width) * 360 - 180,
      lat: 90 - ((e.clientY - r.top) / r.height) * 180,
    });
  };
  return (
    <div className="fallback-map" onClick={click}>
      <img
        src="/assets/political-world.png?v=2"
        alt="خريطة سياسية واضحة للعالم"
      />
      <div className="flat-continent-labels" aria-hidden="true">
        {CONTINENTS.map((continent) => (
          <span key={continent.name} style={pos(continent.lat, continent.lng)}>
            {continent.name}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 1000 500" preserveAspectRatio="none">
        {correct &&
          pins.map((p) => (
            <line
              key={p.playerId}
              x1={((p.lng + 180) / 360) * 1000}
              y1={((90 - p.lat) / 180) * 500}
              x2={((correct.lng + 180) / 360) * 1000}
              y2={((90 - correct.lat) / 180) * 500}
              stroke={p.color}
              strokeWidth="2.5"
              strokeDasharray="7 7"
            />
          ))}
        {cinematic?.from && correct && cinematic.stage === "travelling" && (
          <circle r="10" fill="#ffbe63" className="route-traveler">
            <animate
              attributeName="cx"
              from={((cinematic.from.lng + 180) / 360) * 1000}
              to={((correct.lng + 180) / 360) * 1000}
              dur="2.2s"
              fill="freeze"
            />
            <animate
              attributeName="cy"
              from={((90 - cinematic.from.lat) / 180) * 500}
              to={((90 - correct.lat) / 180) * 500}
              dur="2.2s"
              fill="freeze"
            />
          </circle>
        )}
      </svg>
      {pick && (
        <i className="fallback-pin mine" style={pos(pick.lat, pick.lng)} />
      )}{" "}
      {pins.map((p) => (
        <i
          key={p.playerId}
          className="fallback-pin"
          style={{ ...pos(p.lat, p.lng), background: p.color }}
        />
      ))}{" "}
      {correct && (
        <i
          className="fallback-pin correct"
          style={pos(correct.lat, correct.lng)}
        />
      )}
    </div>
  );
}

function GeoMap({
  pick,
  onPick,
  pins = [],
  correct,
  cinematic,
}: {
  pick?: { lat: number; lng: number } | null;
  onPick?: (v: { lat: number; lng: number }) => void;
  pins?: Submission[];
  correct?: { lat: number; lng: number; place: string } | null;
  cinematic?: { stage: ResultStage; from?: { lat: number; lng: number } };
}) {
  const cinematicStage = cinematic?.stage,
    cinematicFromLat = cinematic?.from?.lat,
    cinematicFromLng = cinematic?.from?.lng,
    correctLat = correct?.lat,
    correctLng = correct?.lng;
  const el = useRef<HTMLDivElement>(null),
    globe = useRef<any>(null),
    centeredFor = useRef(""),
    [ready, setReady] = useState(false),
    [fallback, setFallback] = useState(false),
    pickHandler = useRef(onPick);
  useEffect(() => {
    pickHandler.current = onPick;
  }, [onPick]);
  useEffect(() => {
    if (!el.current || globe.current) return;
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2") && !probe.getContext("webgl")) {
      setFallback(true);
      setReady(true);
      return;
    }
    const host = el.current,
      scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(
        38,
        host.clientWidth / host.clientHeight,
        0.1,
        100,
      ),
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x02070d, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "globe-canvas";
    host.appendChild(renderer.domElement);
    camera.position.set(0, 0, 2.75);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.6;
    controls.maxDistance = 4;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.8;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const texture = new THREE.TextureLoader().load(
      "/assets/political-world.png?v=2",
      () => setReady(true),
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 80),
      new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff }),
    );
    scene.add(earth);
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 96, 64),
      new THREE.MeshBasicMaterial({
        color: 0x51c9f2,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(atmosphere);
    const continentGroup = new THREE.Group();
    const addContinentLabel = (name: string, lat: number, lng: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "rgba(2, 12, 20, .78)";
      ctx.strokeStyle = "rgba(130, 224, 255, .72)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(8, 14, 496, 100, 28);
      ctx.fill();
      ctx.stroke();
      ctx.direction = "rtl";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 42px Arial";
      ctx.fillStyle = "#e5f8ff";
      ctx.shadowColor = "#25bdeb";
      ctx.shadowBlur = 14;
      ctx.fillText(name, 256, 65);
      const labelTexture = new THREE.CanvasTexture(canvas);
      labelTexture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(globePoint(lat, lng, 1.045));
      sprite.scale.set(name.length > 8 ? 0.44 : 0.32, 0.1, 1);
      continentGroup.add(sprite);
    };
    CONTINENTS.forEach((continent) =>
      addContinentLabel(continent.name, continent.lat, continent.lng),
    );
    scene.add(continentGroup);
    const starPositions = [];
    for (let i = 0; i < 900; i++) {
      const v = new THREE.Vector3()
        .randomDirection()
        .multiplyScalar(5 + Math.random() * 7);
      starPositions.push(v.x, v.y, v.z);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3),
    );
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xb8e7ff,
        size: 0.012,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      }),
    );
    scene.add(stars);
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    let cameraTween: {
      from: THREE.Vector3;
      to: THREE.Vector3;
      startedAt: number;
      duration: number;
    } | null = null;
    const moveCamera = (lat: number, lng: number, duration = 1400) => {
      cameraTween = {
        from: camera.position.clone(),
        to: globePoint(lat, lng).multiplyScalar(2.55),
        startedAt: performance.now(),
        duration,
      };
      controls.enabled = false;
    };
    let startX = 0,
      startY = 0;
    const raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2();
    const down = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (
        !pickHandler.current ||
        Math.hypot(e.clientX - startX, e.clientY - startY) > 8
      )
        return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(earth)[0];
      if (!hit) return;
      const p = hit.point.clone().normalize(),
        lat = (Math.asin(p.y) * 180) / Math.PI,
        theta = Math.atan2(p.z, -p.x);
      let lng = (theta * 180) / Math.PI - 180;
      while (lng < -180) lng += 360;
      while (lng > 180) lng -= 360;
      pickHandler.current({ lat, lng });
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);
    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (cameraTween) {
        const raw = Math.min(
            1,
            (performance.now() - cameraTween.startedAt) / cameraTween.duration,
          ),
          eased = raw * raw * (3 - 2 * raw);
        camera.position.lerpVectors(cameraTween.from, cameraTween.to, eased);
        camera.lookAt(0, 0, 0);
        if (raw >= 1) cameraTween = null;
      }
      controls.update();
      stars.rotation.y += 0.00008;
      renderer.render(scene, camera);
    };
    animate();
    globe.current = {
      scene,
      camera,
      renderer,
      controls,
      earth,
      markerGroup,
      moveCamera,
    };
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      controls.dispose();
      texture.dispose();
      earth.geometry.dispose();
      (earth.material as THREE.Material).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      continentGroup.traverse((item: any) => {
        item.material?.map?.dispose?.();
        item.material?.dispose?.();
      });
      starGeo.dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
      globe.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ready || !globe.current) return;
    if (!correct) centeredFor.current = "";
    const { markerGroup, camera, controls } = globe.current as {
      markerGroup: THREE.Group;
      camera: THREE.PerspectiveCamera;
      controls: OrbitControls;
    };
    while (markerGroup.children.length) {
      const item = markerGroup.children.pop()!;
      item.traverse((obj: any) => {
        obj.geometry?.dispose?.();
        if (Array.isArray(obj.material))
          obj.material.forEach((m: any) => {
            m.map?.dispose?.();
            m.dispose?.();
          });
        else {
          obj.material?.map?.dispose?.();
          obj.material?.dispose?.();
        }
      });
    }
    const addMarker = (
      lat: number,
      lng: number,
      color: string,
      size = 0.032,
    ) => {
      const p = globePoint(lat, lng, 1.027),
        canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 160;
      const ctx = canvas.getContext("2d")!;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = color;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(64, 154);
      ctx.bezierCurveTo(54, 129, 23, 96, 23, 62);
      ctx.bezierCurveTo(23, 16, 105, 16, 105, 62);
      ctx.bezierCurveTo(105, 96, 74, 129, 64, 154);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#07131d";
      ctx.beginPath();
      ctx.arc(64, 61, 16, 0, Math.PI * 2);
      ctx.fill();
      const markerTexture = new THREE.CanvasTexture(canvas),
        sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: markerTexture,
            transparent: true,
            depthTest: true,
            depthWrite: false,
          }),
        ),
        groundDot = new THREE.Mesh(
          new THREE.SphereGeometry(Math.max(0.006, size * 0.22), 18, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff }),
        );
      sprite.center.set(0.5, 0);
      sprite.position.copy(p);
      sprite.scale.set(size * 3.8, size * 4.8, 1);
      groundDot.position.copy(p);
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(size * 0.38, size * 0.68, 32),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        }),
      );
      halo.position.copy(p.clone().multiplyScalar(1.002));
      halo.lookAt(p.clone().multiplyScalar(2));
      markerGroup.add(groundDot, halo, sprite);
    };
    if (pick) addMarker(pick.lat, pick.lng, "#ffbe63", 0.038);
    if (correct) {
      const target = globePoint(correct.lat, correct.lng);
      addMarker(correct.lat, correct.lng, "#ffffff", 0.05);
      pins.forEach((p) => {
        addMarker(p.lat, p.lng, p.color, 0.035);
        const from = globePoint(p.lat, p.lng, 1.018),
          to = globePoint(correct.lat, correct.lng, 1.018),
          points = [];
        for (let i = 0; i <= 48; i++) {
          const t = i / 48;
          points.push(
            new THREE.Vector3()
              .lerpVectors(from, to, t)
              .normalize()
              .multiplyScalar(1.018 + Math.sin(Math.PI * t) * 0.08),
          );
        }
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: new THREE.Color(p.color),
            transparent: true,
            opacity: 0.85,
          }),
        );
        markerGroup.add(line);
      });
      const key = `${correct.place}:${correct.lat}:${correct.lng}`;
      if (!cinematicStage && centeredFor.current !== key) {
        camera.position.copy(target.clone().multiplyScalar(2.65));
        camera.lookAt(0, 0, 0);
        controls.update();
        centeredFor.current = key;
      }
    }
  }, [ready, pick, pins, correct, cinematicStage]);
  useEffect(() => {
    if (
      !ready ||
      !globe.current ||
      !cinematicStage ||
      correctLat === undefined ||
      correctLng === undefined
    )
      return;
    const { controls, moveCamera } = globe.current as {
      controls: OrbitControls;
      moveCamera: (lat: number, lng: number, duration?: number) => void;
    };
    if (
      cinematicStage === "locating" &&
      cinematicFromLat !== undefined &&
      cinematicFromLng !== undefined
    )
      moveCamera(cinematicFromLat, cinematicFromLng, 900);
    if (cinematicStage === "travelling")
      moveCamera(correctLat, correctLng, 2200);
    if (cinematicStage === "free") controls.enabled = true;
  }, [
    ready,
    cinematicStage,
    cinematicFromLat,
    cinematicFromLng,
    correctLat,
    correctLng,
  ]);
  return (
    <div className="geo-map globe-map" ref={el}>
      {fallback && (
        <FlatFallback
          pick={pick}
          onPick={onPick}
          pins={pins}
          correct={correct}
          cinematic={cinematic}
        />
      )}
      <div className="globe-help">
        <i />{" "}
        {correct
          ? "حرّك الكرة وشاهد مواقع الجميع · قرّب بإصبعين"
          : fallback
            ? "اضغط على الخريطة لتحديد موقعك"
            : "اسحب لتدوير الأرض · قرّب بإصبعين · اضغط لتحديد موقعك"}
      </div>
      <div className={`map-loading ${ready ? "hidden" : ""}`}>
        جارٍ رسم حدود الدول…
      </div>
    </div>
  );
}

function Timer({ deadline }: { deadline: number | null }) {
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (deadline === null) return;
    const run = () =>
      setLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    run();
    const id = setInterval(run, 250);
    return () => clearInterval(id);
  }, [deadline]);
  if (deadline === null)
    return (
      <div className="timer open">
        <b>∞</b>
        <small>بدون وقت</small>
      </div>
    );
  return (
    <div className={`timer ${left <= 5 ? "danger" : ""}`}>
      <b>{left}</b>
      <small>ثانية</small>
    </div>
  );
}
function Logo() {
  return (
    <div className="logo">
      <i>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="5" />
          <circle cx="24" cy="24" r="14" />
          <path d="M5 24c7-7 31-7 38 0M24 5c7 7 7 31 0 38" />
          <path className="signal" d="M32 13l7-7" />
        </svg>
      </i>
      <span>
        وينـ<b>ها؟</b>
      </span>
      <small>GEO COMMAND</small>
    </div>
  );
}
function ImageCard({ challenge }: { challenge: any }) {
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    setFailed(false);
    setOpen(false);
    setScale(1);
  }, [challenge.id]);
  return (
    <>
      <div className="challenge-image">
        {!failed && (
          <img
            src={challenge.image}
            alt={challenge.title}
            onError={() => setFailed(true)}
          />
        )}
        <div className={`image-fallback ${failed ? "visible" : ""}`}>
          <span>⌖</span>
          <b>تعذر تحميل الصورة، اضغط للمحاولة مجددًا</b>
          {failed && (
            <button onClick={() => setFailed(false)}>إعادة التحميل</button>
          )}
        </div>
        {!failed && (
          <button
            className="open-image"
            onClick={() => setOpen(true)}
            aria-label="فتح الصورة بحجم كامل"
          >
            ⛶ <span>تكبير الصورة</span>
          </button>
        )}
        <div className="image-shade" />
        <h2>{challenge.title}</h2>
      </div>
      {open &&
        createPortal(
          <div className="image-viewer" onClick={() => setOpen(false)}>
            <button className="viewer-close" aria-label="إغلاق الصورة">
              ×
            </button>
            <div
              className="viewer-toolbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setScale((v) => Math.min(3, v + 0.25))}>
                +
              </button>
              <b>{Math.round(scale * 100)}٪</b>
              <button onClick={() => setScale((v) => Math.max(0.75, v - 0.25))}>
                −
              </button>
              <button onClick={() => setScale(1)}>إعادة</button>
            </div>
            <div className="viewer-stage" onClick={(e) => e.stopPropagation()}>
              <img
                src={challenge.image}
                alt={challenge.title}
                style={{ transform: `scale(${scale})` }}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
function ModeGuide({
  mode,
  compact = false,
}: {
  mode: GameMode;
  compact?: boolean;
}) {
  const g = MODE_GUIDES[mode];
  return (
    <section className={`mode-guide ${compact ? "compact" : ""}`}>
      <div className="guide-head">
        <span>{MODES.find((m) => m.id === mode)?.icon}</span>
        <div>
          <small>طريقة لعب</small>
          <h3>{MODE_LABELS[mode]}</h3>
        </div>
      </div>
      <p>{g.lead}</p>
      <ol>
        {g.steps.map((s, i) => (
          <li key={s}>
            <i>{i + 1}</i>
            {s}
          </li>
        ))}
      </ol>
      <footer>نصيحة المهمة: {g.tip}</footer>
    </section>
  );
}
function HintsStage({
  state,
  api,
}: {
  state: State;
  api: (a: string, d?: any) => Promise<any>;
}) {
  return (
    <div className="hints-stage">
      <span className="eyebrow">اكتشف المدينة</span>
      <h1>أين تقع هذه المدينة؟</h1>
      <div className="country-rule">
        يجب أن يكون الدبوس داخل الدولة الصحيحة على الأقل
      </div>
      {state.challenge.hints.map((h: string, i: number) => (
        <article key={i} className="hint">
          <i>{i + 1}</i>
          <p>{h}</p>
        </article>
      ))}
      {state.host && (
        <button
          className="primary next-hint"
          disabled={state.hintCount >= 4}
          onClick={() => api("nextHint")}
        >
          {state.hintCount >= 4
            ? "ظهرت جميع التلميحات"
            : `إظهار التلميح التالي · ${state.hintCount}/4`}
        </button>
      )}
    </div>
  );
}

export default function GameClient() {
  const [screen, setScreen] = useState<
      "home" | "create" | "join" | "how" | "game"
    >("home"),
    [state, setState] = useState<State | null>(null),
    [session, setSession] = useState<Session | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [playType, setPlayType] = useState<PlayType>("individual"),
    [mode, setMode] = useState<GameMode>("place"),
    [difficulty, setDifficulty] = useState<GameDifficulty>("medium"),
    [rounds, setRounds] = useState(5),
    [joinCode, setJoinCode] = useState(""),
    [name, setName] = useState(""),
    [hostName, setHostName] = useState("");
  const [timerSeconds, setTimerSeconds] = useState<0 | 30>(30);
  const [teamCount, setTeamCount] = useState(2),
    [teamNames, setTeamNames] = useState([
      "المجموعة الأولى",
      "المجموعة الثانية",
      "المجموعة الثالثة",
      "المجموعة الرابعة",
    ]);
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null),
    [toast, setToast] = useState("");
  const stablePick = useCallback(
    (v: { lat: number; lng: number } | null) => setPin(v),
    [],
  );
  const api = useCallback(
    async (action: string, data: any = {}) => {
      if (!session) throw new Error("لا توجد جلسة");
      const s = await request(action, { ...session, ...data });
      setState(s);
      return s;
    },
    [session],
  );
  useEffect(() => {
    const roomParam = new URLSearchParams(location.search).get("room");
    if (roomParam) {
      setJoinCode(roomParam.toUpperCase().slice(0, 5));
      setScreen("join");
      return;
    }
    const raw = localStorage.getItem("wainha-session");
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      setSession(saved);
      request("state", saved)
        .then((s) => {
          setState(s);
          setScreen("game");
        })
        .catch(() => localStorage.removeItem("wainha-session"));
    } catch {}
  }, []);
  useEffect(() => {
    if (screen !== "game" || !session) return;
    const id = setInterval(
      () =>
        request("state", session)
          .then(setState)
          .catch(() => {}),
      1000,
    );
    return () => clearInterval(id);
  }, [screen, session]);
  useEffect(() => {
    setPin(null);
  }, [state?.round]);
  useEffect(() => {
    if (
      (state?.phase === "results" || state?.phase === "finished") &&
      state.challenge?.id
    ) {
      const seen = JSON.parse(localStorage.getItem("wainha-seen") || "[]");
      localStorage.setItem(
        "wainha-seen",
        JSON.stringify([...new Set([...seen, state.challenge.id])].slice(-80)),
      );
    }
  }, [state?.phase, state?.challenge?.id]);
  const act = async (fn: () => Promise<any>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const create = () =>
    act(async () => {
      const avoid = JSON.parse(localStorage.getItem("wainha-seen") || "[]");
      const r = await request("create", {
        playType,
        mode,
        difficulty,
        rounds,
        timerSeconds,
        hostName: playType === "individual" ? hostName : undefined,
        avoid,
        teamNames:
          playType === "teams" ? teamNames.slice(0, teamCount) : undefined,
      });
      const ss = { code: r.state.code, token: r.token };
      setSession(ss);
      localStorage.setItem("wainha-session", JSON.stringify(ss));
      setState(r.state);
      setScreen("game");
    });
  const join = () =>
    act(async () => {
      const r = await request("join", { code: joinCode, name });
      const ss = { code: r.state.code, token: r.token };
      setSession(ss);
      localStorage.setItem("wainha-session", JSON.stringify(ss));
      setState(r.state);
      setScreen("game");
    });
  const leave = () => {
    localStorage.removeItem("wainha-session");
    setSession(null);
    setState(null);
    setScreen("home");
  };
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };
  const submit = () =>
    act(async () => {
      if (!pin) throw new Error("ضع الدبوس على الخريطة أولًا");
      await api("submit", pin);
      notify("تم تثبيت موقعك 🔒");
    });
  if (screen === "game" && state)
    return (
      <Game
        state={state}
        api={api}
        pin={pin}
        onPick={stablePick}
        submit={submit}
        busy={busy}
        error={error}
        leave={leave}
      />
    );
  return (
    <main className="site-shell">
      <div className="space-grain" />
      <div className="launch-intro">
        <div className="intro-reticle" />
        <b>تحديد المدار</b>
        <span>GEO SYSTEM ONLINE</span>
      </div>
      <header className="home-nav">
        <Logo />
        <button className="text-btn" onClick={() => setScreen("how")}>
          <span>◌</span> كيف تلعب؟
        </button>
      </header>
      {screen === "home" && (
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <i /> تحدي الدبوس الجغرافي
            </span>
            <h1>
              <span>اكتشف العالم</span>
              <em>وينها؟</em>
            </h1>
            <p>
              راقب المكان من المدار، حدّد إحداثياته، وثبّت دبوسك قبل الآخرين.
              الأقرب يصل إلى القمة.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setScreen("create")}>
                <span>بدء مهمة جديدة</span>
                <b>←</b>
              </button>
              <button className="secondary" onClick={() => setScreen("join")}>
                <i>⌁</i> دخول برمز
              </button>
            </div>
            <div className="mini-features">
              <span>
                <b>30</b> ثانية للرصد
              </span>
              <span>
                <b>02–08</b> متنافسين
              </span>
              <span>
                <b>06</b> أنماط لعب
              </span>
            </div>
          </div>
          <div className="hero-hud" aria-hidden="true">
            <div className="scan-ring r1" />
            <div className="scan-ring r2" />
            <div className="crosshair">
              <i />
              <b />
            </div>
            <span className="coord c1">
              24.7136°N
              <br />
              46.6753°E
            </span>
            <span className="coord c2">SYSTEM // 01</span>
            <div className="target-dot t1" />
            <div className="target-dot t2" />
            <div className="target-dot t3" />
          </div>
          <div className="mission-status">
            <span>LIVE PLANET FEED</span>
            <i />
            <b>ONLINE</b>
          </div>
        </section>
      )}
      {screen === "create" && (
        <section className="panel setup">
          <button className="back" onClick={() => setScreen("home")}>
            → رجوع
          </button>
          <span className="eyebrow">إعداد المباراة</span>
          <h1>أنشئ غرفة جديدة</h1>
          <label>طريقة اللعب</label>
          <div className="choice-row">
            <button
              className={playType === "individual" ? "selected" : ""}
              onClick={() => setPlayType("individual")}
            >
              <i>👤</i>
              <b>لاعبون</b>
              <small>كل لاعب يدخل بجواله عبر الباركود</small>
            </button>
            <button
              className={playType === "teams" ? "selected" : ""}
              onClick={() => setPlayType("teams")}
            >
              <i>👥</i>
              <b>مجموعات</b>
              <small>كل اللعب من جهاز العرض بلا جوالات</small>
            </button>
          </div>
          {playType === "individual" && (
            <label className="host-name-field">
              اسم منشئ الغرفة
              <input
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="اكتب اسمك لتدخل لاعبًا مع البقية"
                maxLength={24}
              />
              <small>
                ستشارك في اللعب من هذا الجهاز وتبقى معك صلاحية إدارة الجولات.
              </small>
            </label>
          )}
          {playType === "teams" && (
            <div className="team-config">
              <label>عدد المجموعات</label>
              <div className="round-pills">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    className={teamCount === n ? "selected" : ""}
                    onClick={() => setTeamCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="team-name-grid">
                {teamNames.slice(0, teamCount).map((t, i) => (
                  <label key={i}>
                    <span>اسم المجموعة {i + 1}</span>
                    <input
                      value={t}
                      onChange={(e) =>
                        setTeamNames((v) =>
                          v.map((x, j) => (j === i ? e.target.value : x)),
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
          <label>نوع التحدي</label>
          <div className="mode-grid">
            {MODES.map((m) => (
              <button
                key={m.id}
                className={mode === m.id ? "selected" : ""}
                onClick={() => setMode(m.id)}
              >
                <i>{m.icon}</i>
                <span>
                  <b>{m.title}</b>
                  <small>{m.desc}</small>
                </span>
              </button>
            ))}
          </div>
          <ModeGuide mode={mode} />
          <label>مستوى اللعبة</label>
          <div className="difficulty-choice">
            {(
              [
                ["easy", "سهل", "أماكن أوضح وأشهر"],
                ["medium", "متوسط", "تحديات متوازنة"],
                ["hard", "صعب", "أماكن أدق وأقل شهرة"],
              ] as const
            ).map(([id, title, desc]) => (
              <button
                key={id}
                className={difficulty === id ? "selected" : ""}
                onClick={() => setDifficulty(id)}
              >
                <b>{title}</b>
                <small>{desc}</small>
              </button>
            ))}
          </div>
          <label>عدد الجولات</label>
          <div className="round-pills">
            {[5, 8, 10, 12, 15].map((n) => (
              <button
                key={n}
                className={rounds === n ? "selected" : ""}
                onClick={() => setRounds(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <label>وقت الجولة</label>
          <div className="timer-choice">
            <button
              className={timerSeconds === 30 ? "selected" : ""}
              onClick={() => setTimerSeconds(30)}
            >
              <b>30 ثانية</b>
              <small>تنتهي الجولة تلقائيًا</small>
            </button>
            <button
              className={timerSeconds === 0 ? "selected" : ""}
              onClick={() => setTimerSeconds(0)}
            >
              <b>بدون مؤقت</b>
              <small>الحكم ينهي الجولة يدويًا</small>
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          <button
            disabled={
              busy ||
              (playType === "individual" && hostName.trim().length < 2) ||
              (playType === "teams" &&
                teamNames.slice(0, teamCount).some((n) => n.trim().length < 2))
            }
            className="primary wide"
            onClick={create}
          >
            {busy
              ? "جارٍ الإنشاء…"
              : playType === "teams"
                ? "فتح لوحة المجموعات"
                : "إنشاء غرفة اللاعبين"}
          </button>
        </section>
      )}
      {screen === "join" && (
        <section className="panel join-panel">
          <button className="back" onClick={() => setScreen("home")}>
            → رجوع
          </button>
          <div className="join-icon">📍</div>
          <span className="eyebrow">دخول سريع</span>
          <h1>انضم إلى الغرفة</h1>
          <label>رمز الغرفة</label>
          <input
            className="code-input"
            maxLength={5}
            value={joinCode}
            onChange={(e) =>
              setJoinCode(
                e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
              )
            }
            placeholder="ABCDE"
          />
          <label>اسمك أو اسم مجموعتك</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب الاسم هنا"
          />
          {error && <p className="error">{error}</p>}
          <button
            disabled={busy || joinCode.length < 5 || name.length < 2}
            className="primary wide"
            onClick={join}
          >
            {busy ? "جارٍ الدخول…" : "دخول الغرفة"}
          </button>
        </section>
      )}
      {screen === "how" && (
        <section className="panel how">
          <button className="back" onClick={() => setScreen("home")}>
            → رجوع
          </button>
          <span className="eyebrow">الدليل الكامل</span>
          <h1>اختر طريقة اللعب</h1>
          <div className="play-guides">
            <article>
              <b>وضع اللاعبين</b>
              <p>
                ينشئ المضيف الغرفة، ويمسح كل لاعب الباركود بجواله ويكتب اسمه، ثم
                يضع كل لاعب دبوسه سرًا من جهازه.
              </p>
            </article>
            <article>
              <b>وضع المجموعات</b>
              <p>
                لا تحتاج أي جوالات. يختار الحكم المجموعة من جهاز العرض، ثم يدير
                الكرة ويثبت دبوسها، ويكرر ذلك لبقية المجموعات.
              </p>
            </article>
          </div>
          <div className="steps">
            <article>
              <i>01</i>
              <div>
                <b>شاهد التحدي</b>
                <p>ستظهر صورة معلم أو تلميح مدينة بحسب الوضع المختار.</p>
              </div>
            </article>
            <article>
              <i>02</i>
              <div>
                <b>دوّر الكرة الأرضية</b>
                <p>
                  اسحبها مثل الخرائط، قرّب بإصبعين، ثم اضغط لتحديد الموقع. يمكن
                  اختيار 30 ثانية أو اللعب دون مؤقت.
                </p>
              </div>
            </article>
            <article>
              <i>03</i>
              <div>
                <b>راجع النتيجة</b>
                <p>
                  تستطيع تحريك الكرة بعد الكشف لرؤية كل الدبابيس وخطوط المسافة.
                </p>
              </div>
            </article>
          </div>
          <div className="guide-gallery">
            {MODES.map((m) => (
              <ModeGuide key={m.id} mode={m.id} compact />
            ))}
          </div>
          <div className="score-help">
            <b>طريقة النقاط</b>
            <span>أقل من 500 كم: 3 نقاط</span>
            <span>أقل من 1000 كم: نقطتان</span>
            <span>من 1000 إلى 5000 كم: نقطة واحدة</span>
            <span>فوق 5000 كم: صفر، والأقرب يأخذ نقطة</span>
          </div>
          <button className="primary wide" onClick={() => setScreen("home")}>
            فهمت، لنبدأ
          </button>
        </section>
      )}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function Game({
  state,
  api,
  pin,
  onPick,
  submit,
  busy,
  error,
  leave,
}: {
  state: State;
  api: (a: string, d?: any) => Promise<any>;
  pin: any;
  onPick: (v: any) => void;
  submit: () => void;
  busy: boolean;
  error: string;
  leave: () => void;
}) {
  const [activeTeam, setActiveTeam] = useState<string>(""),
    [teamError, setTeamError] = useState(""),
    [teamBusy, setTeamBusy] = useState(false),
    [roundRevealStage, setRoundRevealStage] =
      useState<ResultStage>("free");
  useEffect(() => {
    if (
      (state.phase !== "results" && state.phase !== "finished") ||
      !state.submissions.length
    ) {
      setRoundRevealStage("free");
      return;
    }
    setRoundRevealStage("locating");
    const travel = setTimeout(() => setRoundRevealStage("travelling"), 1100);
    const score = setTimeout(() => setRoundRevealStage("score"), 3500);
    const free = setTimeout(() => setRoundRevealStage("free"), 5800);
    return () => {
      clearTimeout(travel);
      clearTimeout(score);
      clearTimeout(free);
    };
  }, [state.phase, state.round, state.challenge?.id, state.submissions.length]);
  const firstTeamId = state.players[0]?.id || "",
    firstUnlockedTeamId =
      state.players.find((p) => !p.locked)?.id || firstTeamId;
  useEffect(() => {
    if (state.playType === "teams") setActiveTeam(firstUnlockedTeamId);
    onPick(null);
    setTeamError("");
  }, [state.round, state.playType, firstUnlockedTeamId, onPick]);
  const locked = state.me
    ? state.players.find((p) => p.id === state.me!.id)?.locked
    : false;
  const sorted = useMemo(
    () => [...state.players].sort((a, b) => b.score - a.score),
    [state.players],
  );
  const joinUrl =
    typeof location !== "undefined"
      ? `${location.origin}/?room=${state.code}`
      : "";
  const pickTeam = (id: string) => {
    setActiveTeam(id);
    onPick(null);
    setTeamError("");
  };
  const hostTeamSubmit = async () => {
    if (!pin || !activeTeam) return;
    setTeamBusy(true);
    setTeamError("");
    try {
      const updated = await api("hostSubmit", { playerId: activeTeam, ...pin });
      onPick(null);
      setActiveTeam(
        updated.players.find((p: Player) => !p.locked)?.id || activeTeam,
      );
    } catch (e: any) {
      setTeamError(e.message);
    } finally {
      setTeamBusy(false);
    }
  };
  if (state.phase === "lobby")
    return (
      <main className="game-shell lobby">
        <header>
          <Logo />
          <button className="text-btn" onClick={leave}>
            خروج
          </button>
        </header>
        {state.playType === "individual" ? (
          <section className="lobby-grid">
            <div className="room-code qr-room">
              <span>امسح للدخول مباشرة</span>
              <div className="qr-frame">
                <QRCodeSVG
                  value={joinUrl}
                  size={190}
                  bgColor="transparent"
                  fgColor="#d9f5ff"
                  level="M"
                />
              </div>
              <strong>{state.code}</strong>
              <p>وجّه كاميرا الجوال إلى الباركود، ثم اكتب اسمك فقط</p>
              <button
                className="secondary share-room"
                onClick={() => navigator.clipboard.writeText(joinUrl)}
              >
                نسخ رابط الدخول
              </button>
              <div className="room-meta">
                <b>👤 لاعبون</b>
                <b>{MODE_LABELS[state.mode]}</b>
                <b>المستوى: {DIFFICULTY_LABELS[state.difficulty]}</b>
                <b>{state.rounds} جولات</b>
                <b>{state.timerSeconds ? "⏱ 30 ثانية" : "∞ بدون مؤقت"}</b>
              </div>
            </div>
            <div className="players-card">
              <div className="card-title">
                <h2>اللاعبون</h2>
                <span>{state.players.length}/8</span>
              </div>
              <div className="player-list">
                {state.players.length ? (
                  state.players.map((p, i) => (
                    <div key={p.id}>
                      <i style={{ background: p.color }}>{i + 1}</i>
                      <b>{p.name}</b>
                      <span>جاهز ✓</span>
                    </div>
                  ))
                ) : (
                  <p className="empty">بانتظار مسح الباركود…</p>
                )}
              </div>
              {state.host ? (
                <button
                  className="primary wide"
                  disabled={state.players.length < 2}
                  onClick={() => api("start")}
                >
                  ابدأ المباراة
                </button>
              ) : (
                <div className="waiting">
                  <i />
                  <span>بانتظار منشئ الغرفة</span>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="team-lobby">
            <div className="team-lobby-title">
              <span className="eyebrow">وضع جهاز واحد</span>
              <h1>لوحة المجموعات جاهزة</h1>
              <p>
                لا يحتاج أي لاعب إلى جوال. ستختار المجموعة من هذه الشاشة وتضع
                دبوسها بنفسك في كل جولة.
              </p>
            </div>
            <div className="team-roster">
              {state.players.map((p, i) => (
                <article
                  key={p.id}
                  style={{ "--team": p.color } as React.CSSProperties}
                >
                  <i>{i + 1}</i>
                  <b>{p.name}</b>
                  <span>جاهزة</span>
                </article>
              ))}
            </div>
            <ModeGuide mode={state.mode} />
            <div className="room-meta">
              <b>👥 {state.players.length} مجموعات</b>
              <b>{MODE_LABELS[state.mode]}</b>
              <b>المستوى: {DIFFICULTY_LABELS[state.difficulty]}</b>
              <b>{state.rounds} جولات</b>
              <b>{state.timerSeconds ? "⏱ 30 ثانية" : "∞ بدون مؤقت"}</b>
            </div>
            <button className="primary team-start" onClick={() => api("start")}>
              ابدأ المباراة
            </button>
          </section>
        )}
      </main>
    );
  if (state.phase === "round") {
    if (state.playType === "teams") {
      const active = state.players.find((p) => p.id === activeTeam),
        activeLocked = active?.locked;
      return (
        <main className="game-shell round-screen team-control">
          <header>
            <Logo />
            <div className="round-meta">
              <span>
                الجولة <b>{state.round}</b> من {state.rounds}
              </span>
              <span>{MODE_LABELS[state.currentMode || state.mode]}</span>
            </div>
            <Timer deadline={state.deadline} />
          </header>
          <section className="team-round">
            <div className="team-challenge">
              {state.currentMode !== "city" ? (
                <ImageCard challenge={state.challenge} />
              ) : (
                <HintsStage state={state} api={api} />
              )}
            </div>
            <div className="team-map-panel">
              <div className="team-turn-head">
                <div>
                  <span className="eyebrow">اختر المجموعة</span>
                  <h2>
                    {activeLocked
                      ? "دبوس هذه المجموعة مثبت"
                      : "ضع دبوس المجموعة المختارة"}
                  </h2>
                </div>
                <b>
                  {state.players.filter((p) => p.locked).length}/
                  {state.players.length}
                </b>
              </div>
              <div className="team-switcher">
                {state.players.map((p, i) => (
                  <button
                    key={p.id}
                    disabled={p.locked}
                    className={`${p.id === activeTeam ? "active" : ""} ${p.locked ? "locked" : ""}`}
                    style={{ "--team": p.color } as React.CSSProperties}
                    onClick={() => pickTeam(p.id)}
                  >
                    <i>{i + 1}</i>
                    <span>{p.name}</span>
                    <small>{p.locked ? "مثبت ✓" : "اختر"}</small>
                  </button>
                ))}
              </div>
              <GeoMap pick={pin} onPick={activeLocked ? undefined : onPick} />
              {teamError && <p className="error">{teamError}</p>}
              <button
                className="primary team-pin-submit"
                disabled={!pin || !activeTeam || activeLocked || teamBusy}
                onClick={hostTeamSubmit}
              >
                {teamBusy
                  ? "جارٍ التثبيت…"
                  : active
                    ? `تثبيت دبوس ${active.name}`
                    : "اختر مجموعة"}
              </button>
              <button
                className="secondary finish-team-round"
                onClick={() => api("reveal")}
              >
                إنهاء الجولة الآن
              </button>
            </div>
          </section>
        </main>
      );
    }
    const display = state.host && !state.me;
    return (
      <main className="game-shell round-screen">
        <header>
          <Logo />
          <div className="round-meta">
            <span>
              الجولة <b>{state.round}</b> من {state.rounds}
            </span>
            <span>{MODE_LABELS[state.currentMode || state.mode]}</span>
          </div>
          <Timer deadline={state.deadline} />
        </header>
        {display ? (
          <section className="display-round">
            <div className="display-content">
              {state.currentMode !== "city" && (
                <ImageCard challenge={state.challenge} />
              )}{" "}
              {state.currentMode === "city" && (
                <HintsStage state={state} api={api} />
              )}
            </div>
            <aside className="live-board">
              <span className="eyebrow">تثبيت مباشر</span>
              <h2>
                {state.players.filter((p) => p.locked).length}
                <small> / {state.players.length}</small>
              </h2>
              <div>
                {state.players.map((p) => (
                  <p key={p.id} className={p.locked ? "done" : ""}>
                    <i style={{ background: p.color }} />
                    {p.name}
                    <b>{p.locked ? "ثبّت ✓" : "يفكر…"}</b>
                  </p>
                ))}
              </div>
              <button className="secondary wide" onClick={() => api("reveal")}>
                إنهاء الجولة الآن
              </button>
            </aside>
          </section>
        ) : (
          <section className="player-round">
            {state.currentMode !== "city" && (
              <ImageCard challenge={state.challenge} />
            )}
            {state.currentMode === "city" && (
              <HintsStage state={state} api={api} />
            )}
            <div className="pick-head">
              <div>
                <span className="eyebrow">حدد توقعك</span>
                <h2>
                  {locked ? "تم تثبيت دبوسك" : "اضغط على الخريطة لوضع الدبوس"}
                </h2>
              </div>
              <Timer deadline={state.deadline} />
            </div>
            <GeoMap pick={pin} onPick={locked ? undefined : onPick} />
            {error && <p className="error">{error}</p>}
            <button
              className="primary pin-submit"
              disabled={!pin || locked || busy}
              onClick={submit}
            >
              {locked ? "تم التثبيت 🔒" : "تثبيت الموقع"}
            </button>
            {state.host && (
              <button
                className="secondary player-host-finish"
                onClick={() => api("reveal")}
              >
                إنهاء الجولة الآن
              </button>
            )}
          </section>
        )}
      </main>
    );
  }
  const best = state.submissions[0],
    fastest = [...state.submissions].sort((a, b) => a.at - b.at)[0],
    farthest = [...state.submissions].sort(
      (a, b) => b.distance - a.distance,
    )[0],
    countryHits = state.submissions.filter((s) => s.countryHit === true).length;
  if (state.phase === "finished")
    return (
      <main className="game-shell final-screen">
        <div className="confetti" />
        <Logo />
        <span className="eyebrow">انتهت الرحلة حول العالم</span>
        <div className="trophy">🏆</div>
        <h1>
          الفائز: <b>{sorted[0]?.name}</b>
        </h1>
        <p>
          جمع {sorted[0]?.score || 0} نقطة خلال {state.rounds} جولات
        </p>
        <div className="podium">
          {sorted.slice(0, 3).map((p, i) => (
            <article key={p.id} className={`place-${i + 1}`}>
              <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
              <b>{p.name}</b>
              <strong>{p.score}</strong>
              <small>نقطة</small>
            </article>
          ))}
        </div>
        <div className="final-stats">
          <span>
            🎯 أفضل إصابة
            <b>
              {best?.name || "—"} ·{" "}
              {best?.distance?.toLocaleString("ar-SA") || 0} كم
            </b>
          </span>
          <span>
            ⚡ أسرع تثبيت<b>{fastest?.name || "—"}</b>
          </span>
          <span>
            🧭 أبعد تخمين
            <b>
              {farthest?.name || "—"} ·{" "}
              {farthest?.distance?.toLocaleString("ar-SA") || 0} كم
            </b>
          </span>
        </div>
        <button className="secondary" onClick={leave}>
          العودة للرئيسية
        </button>
      </main>
    );
  return (
    <main className="game-shell results-screen">
      <header>
        <Logo />
        <div className="round-meta">
          <span>
            تقرير الجولة <b>{state.round}</b>
          </span>
          <span>
            {state.challenge.place} — {state.challenge.country}
          </span>
        </div>
      </header>
      <section className="result-hero">
        <div className="correct-location">
          <span className="eyebrow">الإجابة الصحيحة</span>
          <h1>{state.challenge.place}</h1>
          <b>{state.challenge.country}</b>
          <p>{state.challenge.story}</p>
          {state.currentMode === "city" && (
            <div
              className={`country-summary ${countryHits ? "success" : "fallback"}`}
            >
              {countryHits
                ? `${countryHits} أصابوا الدولة الصحيحة؛ رُتّبوا حسب الأقرب للمدينة`
                : "لم يصب أحد الدولة؛ لذلك فاز أقرب دبوس للمدينة"}
            </div>
          )}
        </div>
        {best && (
          <div className="winner-orbit">
            <i>01</i>
            <span>
              {state.currentMode === "city" && countryHits
                ? "أفضل دبوس داخل الدولة"
                : "أقرب دبوس"}
            </span>
            <h2>{best.name}</h2>
            <strong>
              {best.distance.toLocaleString("ar-SA")} <small>كم</small>
            </strong>
          </div>
        )}
      </section>
      <section className="result-layout result-layout-new">
        <div className="result-globe">
          <GeoMap
            pins={state.submissions}
            cinematic={
              best
                ? {
                    stage: roundRevealStage,
                    from: { lat: best.lat, lng: best.lng },
                  }
                : undefined
            }
            correct={{
              lat: state.challenge.lat,
              lng: state.challenge.lng,
              place: state.challenge.place,
            }}
          />
          {best && roundRevealStage !== "free" && (
            <div className={`result-cinematic ${roundRevealStage}`}>
              {roundRevealStage === "locating" && (
                <>
                  <span>أقرب دبوس</span>
                  <h2>{best.name}</h2>
                  <small>جارٍ تحديد مساره إلى الموقع الصحيح…</small>
                </>
              )}
              {roundRevealStage === "travelling" && (
                <>
                  <span className="moving-pin">⌖</span>
                  <h2>إلى الموقع الصحيح</h2>
                  <small>{state.challenge.place}</small>
                </>
              )}
              {roundRevealStage === "score" && (
                <>
                  <span>المسافة</span>
                  <h2>{best.distance.toLocaleString("ar-SA")} كم</h2>
                  <strong>
                    +{best.points} {best.points === 1 ? "نقطة" : "نقاط"}
                  </strong>
                </>
              )}
            </div>
          )}
          <p className={roundRevealStage === "free" ? "ready" : ""}>
            {roundRevealStage === "free"
              ? "الآن يمكنك تحريك الكرة الأرضية وتفقد جميع الدبابيس"
              : "عرض مسار أقرب دبوس…"}
          </p>
        </div>
        <div className="ranking ranking-new">
          <div className="ranking-title">
            <div>
              <span className="eyebrow">الترتيب</span>
              <h2>نتائج الجولة</h2>
            </div>
            <small>
              أقل من 500 = 3 · أقل من 1000 = 2 · حتى 5000 = 1 · بعدها = 0
            </small>
          </div>
          {state.submissions.map((s, i) => (
            <article key={s.playerId} className={i === 0 ? "winner-row" : ""}>
              <span className="rank">{String(i + 1).padStart(2, "0")}</span>
              <i style={{ background: s.color }} />
              <div className="result-person">
                <b>{s.name}</b>
                <small>{s.distance.toLocaleString("ar-SA")} كم عن الموقع</small>
                {state.currentMode === "city" && (
                  <span
                    className={`country-check ${s.countryHit ? "hit" : "miss"}`}
                  >
                    {s.countryHit ? "داخل الدولة ✓" : "خارج الدولة ✕"}
                  </span>
                )}
                <div className="point-breakdown">
                  <em>
                    {s.points === 3
                      ? "أقل من 500 كم"
                      : s.points === 2
                        ? "أقل من 1000 كم"
                      : s.points === 1 && s.distance <= 5000
                        ? "من 1000 إلى 5000 كم"
                        : s.points === 1
                          ? "نقطة الأقرب رغم بُعده"
                          : s.distance > 5000
                            ? "أكثر من 5000 كم"
                            : "خارج الدولة"}
                  </em>
                </div>
              </div>
              <strong>+{s.points}</strong>
            </article>
          ))}
          {state.players
            .filter((p) => !state.submissions.some((s) => s.playerId === p.id))
            .map((p) => (
              <article key={p.id} className="missed">
                <span className="rank">—</span>
                <i style={{ background: p.color }} />
                <div className="result-person">
                  <b>{p.name}</b>
                  <small>لم يثبت موقعًا</small>
                </div>
                <strong>+0</strong>
              </article>
            ))}
        </div>
      </section>
      <div className="score-strip score-strip-new">
        {sorted.map((p, i) => (
          <span key={p.id}>
            <i>{i + 1}</i>
            <small>الترتيب العام</small>
            {p.name}
            <b>{p.score} نقطة</b>
          </span>
        ))}
      </div>
      {state.host ? (
        <button className="primary next-round" onClick={() => api("next")}>
          {state.round >= state.rounds ? "عرض الفائز" : "الجولة التالية ←"}
        </button>
      ) : (
        <div className="waiting bottom">
          <i />
          <span>بانتظار الجولة التالية</span>
        </div>
      )}
    </main>
  );
}
