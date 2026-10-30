export type ChallengeMode = "place" | "city" | "aerial" | "border" | "saudi";
export type GameMode = ChallengeMode | "mixed";
export type GameDifficulty = "easy" | "medium" | "hard";
export type PlayType = "individual" | "teams";

export type Challenge = {
  id: string;
  mode: ChallengeMode;
  title: string;
  place: string;
  country: string;
  countryId?: string;
  lat: number;
  lng: number;
  image: string;
  hints?: string[];
  story: string;
};

const commons = (search: string) => `/api/media?q=${encodeURIComponent(search)}`;

export const CHALLENGES: Challenge[] = [
  { id:"p-eiffel",mode:"place",title:"أين يقع هذا المعلم؟",place:"برج إيفل",country:"فرنسا",lat:48.8584,lng:2.2945,image:commons("Tour Eiffel Wikimedia Commons.jpg"),story:"أحد أشهر معالم باريس، افتتح عام 1889." },
  { id:"p-petra",mode:"place",title:"أين يقع هذا المعلم؟",place:"البتراء",country:"الأردن",lat:30.3285,lng:35.4444,image:commons("The Treasury, Petra, Jordan.jpg"),story:"مدينة نبطية منحوتة في الصخر الوردي." },
  { id:"p-pyramids",mode:"place",title:"حدد موقع هذا المكان",place:"أهرامات الجيزة",country:"مصر",lat:29.9792,lng:31.1342,image:commons("All Gizah Pyramids.jpg"),story:"من أشهر آثار العالم القديم قرب القاهرة." },
  { id:"p-taj",mode:"place",title:"حدد موقع هذا المعلم",place:"تاج محل",country:"الهند",lat:27.1751,lng:78.0421,image:commons("Taj Mahal, Agra, India edit3.jpg"),story:"ضريح رخامي شهير في مدينة أغرا." },
  { id:"p-opera",mode:"place",title:"في أي مدينة يوجد هذا المبنى؟",place:"دار أوبرا سيدني",country:"أستراليا",lat:-33.8568,lng:151.2153,image:commons("Sydney Opera House - Dec 2008.jpg"),story:"تحفة معمارية تطل على ميناء سيدني." },
  { id:"p-liberty",mode:"place",title:"ضع الدبوس قرب هذا التمثال",place:"تمثال الحرية",country:"الولايات المتحدة",lat:40.6892,lng:-74.0445,image:commons("Statue of Liberty 7.jpg"),story:"يقف على جزيرة الحرية في ميناء نيويورك." },
  { id:"p-colosseum",mode:"place",title:"أين يقع هذا المدرج؟",place:"الكولوسيوم",country:"إيطاليا",lat:41.8902,lng:12.4922,image:commons("Colosseo 2020.jpg"),story:"مدرج روماني ضخم في قلب روما." },
  { id:"p-china",mode:"place",title:"حدد موقع هذا المعلم",place:"سور الصين العظيم – بادالينغ",country:"الصين",lat:40.3543,lng:116.0065,image:commons("The Great Wall of China at Jinshanling-edit.jpg"),story:"أشهر أجزاء السور تقع شمال بكين." },
  { id:"p-burj",mode:"place",title:"أين تقع هذه الناطحة؟",place:"برج خليفة",country:"الإمارات",lat:25.1972,lng:55.2744,image:commons("Burj Khalifa.jpg"),story:"أعلى مبنى في العالم ويقع في دبي." },
  { id:"p-bigben",mode:"place",title:"في أي مدينة توجد هذه الساعة؟",place:"برج إليزابيث – بيغ بن",country:"المملكة المتحدة",lat:51.5007,lng:-0.1246,image:commons("Big Ben 2012.jpg"),story:"برج الساعة الشهير بجوار قصر وستمنستر في لندن." },
  { id:"p-machu",mode:"place",title:"حدد موقع هذه المدينة الأثرية",place:"ماتشو بيتشو",country:"بيرو",lat:-13.1631,lng:-72.545,image:commons("Machu Picchu, Peru.jpg"),story:"مدينة إنكا أثرية مرتفعة بين جبال الأنديز." },
  { id:"p-pisa",mode:"place",title:"أين يقع هذا البرج المائل؟",place:"برج بيزا المائل",country:"إيطاليا",lat:43.723,lng:10.3966,image:commons("Leaning Tower of Pisa 2.jpg"),story:"برج شهير بميله الواضح في مدينة بيزا الإيطالية." },
  { id:"p-golden",mode:"place",title:"حدد موقع هذا الجسر",place:"جسر البوابة الذهبية",country:"الولايات المتحدة",lat:37.8199,lng:-122.4783,image:commons("Golden Gate Bridge, SF (cropped).jpg"),story:"يربط سان فرانسيسكو بمقاطعة مارين فوق المضيق." },
  { id:"p-stonehenge",mode:"place",title:"أين توجد هذه الدائرة الحجرية؟",place:"ستونهنج",country:"المملكة المتحدة",lat:51.1789,lng:-1.8262,image:commons("Stonehenge2007 07 30.jpg"),story:"نصب حجري غامض يعود إلى عصور ما قبل التاريخ." },
  { id:"p-moai",mode:"place",title:"أين توجد هذه التماثيل؟",place:"تماثيل مواي – جزيرة القيامة",country:"تشيلي",lat:-27.125,lng:-109.277,image:commons("Moai Rano raraku.jpg"),story:"تماثيل حجرية ضخمة على جزيرة نائية في المحيط الهادئ." },
  { id:"p-angkor",mode:"place",title:"حدد موقع هذا المعبد",place:"أنغكور وات",country:"كمبوديا",lat:13.4125,lng:103.867,image:commons("Angkor Wat.jpg"),story:"مجمع معابد تاريخي واسع قرب سيام ريب." },
  { id:"p-chichen",mode:"place",title:"أين يقع هذا الهرم؟",place:"تشيتشن إيتزا",country:"المكسيك",lat:20.6843,lng:-88.5678,image:commons("Chichen Itza 3.jpg"),story:"مدينة أثرية لحضارة المايا في شبه جزيرة يوكاتان." },
  { id:"p-alhambra",mode:"place",title:"حدد موقع هذا القصر",place:"قصر الحمراء",country:"إسبانيا",lat:37.1761,lng:-3.5881,image:commons("Alhambra evening panorama Mirador San Nicolas sRGB-1.jpg"),story:"قصر أندلسي شهير يطل على مدينة غرناطة." },
  { id:"p-cn",mode:"place",title:"حدد موقع هذا البرج",place:"برج سي إن",country:"كندا",lat:43.6426,lng:-79.3871,image:commons("CN Tower seen from its base.jpg"),story:"برج اتصالات ومراقبة شهير في مدينة تورونتو." },
  { id:"p-marina",mode:"place",title:"أين يقع هذا المبنى؟",place:"مارينا باي ساندز",country:"سنغافورة",lat:1.2834,lng:103.8607,image:commons("Marina Bay Sands in the evening - 20101120.jpg"),story:"مجمع شهير تعلوه منصة تشبه السفينة في سنغافورة." },
  { id:"p-brandenburg",mode:"place",title:"حدد موقع هذه البوابة",place:"بوابة براندنبورغ",country:"ألمانيا",lat:52.5163,lng:13.3777,image:commons("Brandenburger Tor abends.jpg"),story:"بوابة تاريخية ورمز بارز للعاصمة برلين." },
  { id:"p-neusch",mode:"place",title:"أين تقع هذه القلعة؟",place:"قلعة نويشفانشتاين",country:"ألمانيا",lat:47.5576,lng:10.7498,image:commons("Schloss Neuschwanstein 2013.jpg"),story:"قلعة جبلية شهيرة في بافاريا جنوب ألمانيا." },
  { id:"p-abu",mode:"place",title:"حدد موقع هذا المسجد",place:"جامع الشيخ زايد الكبير",country:"الإمارات",lat:24.4128,lng:54.4749,image:commons("Sheikh Zayed Grand Mosque, Abu Dhabi, UAE.jpg"),story:"معلم إسلامي معماري بارز في أبوظبي." },
  { id:"p-tokyo-tower",mode:"place",title:"أين يقع هذا البرج؟",place:"برج طوكيو",country:"اليابان",lat:35.6586,lng:139.7454,image:commons("Tokyo Tower Japan night"),story:"برج اتصالات ومشاهدة أحمر وأبيض في قلب طوكيو." },
  { id:"p-india-gate",mode:"place",title:"حدد موقع هذه البوابة",place:"بوابة الهند",country:"الهند",lat:28.6129,lng:77.2295,image:commons("India Gate New Delhi monument"),story:"نصب تذكاري شهير في العاصمة نيودلهي." },
  { id:"p-burj-arab",mode:"place",title:"في أي مدينة يوجد هذا الفندق؟",place:"برج العرب",country:"الإمارات",lat:25.1412,lng:55.1853,image:commons("Burj Al Arab Dubai"),story:"فندق شهير على جزيرة صناعية قبالة ساحل دبي." },
  { id:"p-shanghai",mode:"place",title:"أين تقع هذه الناطحة؟",place:"برج شنغهاي",country:"الصين",lat:31.2355,lng:121.5010,image:commons("Shanghai Tower skyline"),story:"ناطحة سحاب ملتفة في حي بودونغ بمدينة شنغهاي." },
  { id:"p-arc",mode:"place",title:"حدد موقع هذا القوس",place:"قوس النصر",country:"فرنسا",lat:48.8738,lng:2.2950,image:commons("Arc de Triomphe Paris"),story:"نصب تاريخي يتوسط ساحة شارل ديغول في باريس." },
  { id:"p-petronas",mode:"place",title:"أين يقع هذان البرجان؟",place:"برجا بتروناس",country:"ماليزيا",lat:3.1579,lng:101.7116,image:commons("Petronas Twin Towers Kuala Lumpur"),story:"برجان توأمان شهيران في كوالالمبور." },
  { id:"p-hollywood",mode:"place",title:"حدد موقع هذه العلامة",place:"علامة هوليوود",country:"الولايات المتحدة",lat:34.1341,lng:-118.3215,image:commons("Hollywood Sign Los Angeles"),story:"علامة ضخمة على تلال لوس أنجلوس." },
  { id:"p-lotus",mode:"place",title:"أين يقع هذا المبنى؟",place:"متحف فن العلوم",country:"سنغافورة",lat:1.2863,lng:103.8593,image:commons("ArtScience Museum Singapore"),story:"مبنى على هيئة زهرة لوتس عند خليج مارينا." },
  { id:"c-istanbul",mode:"city",title:"اكتشف المدينة",place:"إسطنبول",country:"تركيا",countryId:"792",lat:41.0082,lng:28.9784,image:commons("Istanbul skyline from Galata tower.jpg"),hints:["تقع في قارتي آسيا وأوروبا.","يفصل بين جانبيها مضيق شهير.","اشتهرت بآيا صوفيا والمسجد الأزرق.","هذه صورة لخريطتها المطلة على مضيق البوسفور."],story:"مدينة تاريخية على ضفتي البوسفور." },
  { id:"c-marrakesh",mode:"city",title:"اكتشف المدينة",place:"مراكش",country:"المغرب",countryId:"504",lat:31.6295,lng:-7.9811,image:commons("Marrakech Medina.jpg"),hints:["تقع في قارة أفريقيا.","تقع شمال غرب القارة وقرب جبال الأطلس.","تشتهر بساحة جامع الفنا ولون مبانيها الأحمر.","هذه صورة للمدينة القديمة وأسواقها."],story:"إحدى أشهر المدن التاريخية في المغرب." },
  { id:"c-kyoto",mode:"city",title:"اكتشف المدينة",place:"كيوتو",country:"اليابان",countryId:"392",lat:35.0116,lng:135.7681,image:commons("Kiyomizu-dera in Kyoto-r.jpg"),hints:["تقع في قارة آسيا.","تقع في شرق القارة ضمن دولة جزرية.","تشتهر بمعابدها وأزهار الكرز.","كانت عاصمة إمبراطورية لقرون طويلة."],story:"العاصمة الثقافية القديمة لليابان." },
  { id:"c-rio",mode:"city",title:"اكتشف المدينة",place:"ريو دي جانيرو",country:"البرازيل",countryId:"076",lat:-22.9068,lng:-43.1729,image:commons("Rio de Janeiro aerial coast"),hints:["تقع في أمريكا الجنوبية.","تقع على الساحل الشرقي للقارة.","تشتهر بجبل السكر وشاطئ كوباكابانا.","تحيط بها خلجان وجبال وشواطئ شهيرة."],story:"مدينة برازيلية بين الجبال والمحيط." },
  { id:"c-cape",mode:"city",title:"اكتشف المدينة",place:"كيب تاون",country:"جنوب أفريقيا",countryId:"710",lat:-33.9249,lng:18.4241,image:commons("Cape Town and Table Mountain from Bloubergstrand.jpg"),hints:["تقع في قارة أفريقيا.","تقع قرب الطرف الجنوبي الغربي للقارة.","تشتهر بجبل الطاولة.","تطل على ملتقى طرق بحرية تاريخية."],story:"مدينة ساحلية تحت جبل الطاولة." },
  { id:"c-venice",mode:"city",title:"اكتشف المدينة",place:"البندقية",country:"إيطاليا",countryId:"380",lat:45.4408,lng:12.3155,image:commons("Venice Grand Canal gondolas"),hints:["تقع في قارة أوروبا.","تقع في جنوب القارة على البحر الأدرياتيكي.","تشتهر بالقنوات والقوارب بدل الشوارع.","بني مركزها التاريخي فوق جزر صغيرة كثيرة."],story:"مدينة القنوات الشهيرة في شمال إيطاليا." },
  { id:"a-palm",mode:"aerial",title:"صورة من الأعلى… أين هذا المكان؟",place:"نخلة جميرا",country:"الإمارات",lat:25.1124,lng:55.1390,image:commons("Palm Jumeirah's Palm Leaf on 1 May 2007 Pict 1.jpg"),story:"جزيرة صناعية على شكل نخلة قبالة دبي." },
  { id:"a-niagara",mode:"aerial",title:"حدد موقع هذه الظاهرة الطبيعية",place:"شلالات نياجرا",country:"كندا والولايات المتحدة",lat:43.0828,lng:-79.0742,image:commons("Niagara Falls NASA.jpg"),story:"تقع على الحدود بين كندا والولايات المتحدة." },
  { id:"a-everest",mode:"aerial",title:"أين تقع هذه القمة؟",place:"جبل إيفرست",country:"نيبال والصين",lat:27.9881,lng:86.9250,image:commons("Mount Everest as seen from Drukair2 PLW edit.jpg"),story:"أعلى قمة جبلية فوق مستوى سطح البحر." },
  { id:"a-victoria",mode:"aerial",title:"ضع الدبوس عند هذه الشلالات",place:"شلالات فيكتوريا",country:"زامبيا وزيمبابوي",lat:-17.9243,lng:25.8572,image:commons("Victoria Falls 2012 05 24 1628 (7422466716).jpg"),story:"ستار مائي هائل على نهر الزمبيزي." },
  { id:"a-grand",mode:"aerial",title:"أين يقع هذا الأخدود؟",place:"غراند كانيون",country:"الولايات المتحدة",lat:36.1069,lng:-112.1129,image:commons("Grand Canyon view from Pima Point 2010.jpg"),story:"أخدود عظيم نحته نهر كولورادو." },
  { id:"a-maldives",mode:"aerial",title:"حدد موقع هذه الجزر",place:"جزر المالديف",country:"المالديف",lat:3.2028,lng:73.2207,image:commons("Maldives 1997.jpg"),story:"سلسلة جزر مرجانية في المحيط الهندي." },
  { id:"b-italy",mode:"border",title:"شكل أي دولة؟",place:"إيطاليا",country:"إيطاليا",lat:42.8,lng:12.8,image:commons("Italy map-blank.svg"),story:"دولة أوروبية يشبه شكلها الحذاء." },
  { id:"b-japan",mode:"border",title:"شكل أي دولة؟",place:"اليابان",country:"اليابان",lat:36.2,lng:138.3,image:commons("Japan map blank.png"),story:"أرخبيل طويل في شرق آسيا." },
  { id:"b-chile",mode:"border",title:"شكل أي دولة؟",place:"تشيلي",country:"تشيلي",lat:-33.4,lng:-70.7,image:commons("Chile location map.svg"),story:"دولة طويلة وضيقة على ساحل أمريكا الجنوبية." },
  { id:"b-madagascar",mode:"border",title:"شكل أي دولة؟",place:"مدغشقر",country:"مدغشقر",lat:-18.7669,lng:46.8691,image:commons("Madagascar location map.svg"),story:"جزيرة كبيرة شرق قارة أفريقيا." },
  { id:"b-india",mode:"border",title:"شكل أي دولة؟",place:"الهند",country:"الهند",lat:22.8,lng:79.0,image:commons("India location map.svg"),story:"دولة كبيرة في جنوب قارة آسيا." },
  { id:"b-brazil",mode:"border",title:"شكل أي دولة؟",place:"البرازيل",country:"البرازيل",lat:-14.2,lng:-51.9,image:commons("Brazil location map.svg"),story:"أكبر دول أمريكا الجنوبية مساحة." },
  { id:"s-kaaba",mode:"saudi",title:"حدد موقع هذا المعلم السعودي",place:"المسجد الحرام",country:"السعودية",lat:21.4225,lng:39.8262,image:commons("Kaaba Masjid Haram Makkah.jpg"),story:"قبلة المسلمين في مكة المكرمة." },
  { id:"s-masmak",mode:"saudi",title:"في أي مدينة يوجد هذا المعلم؟",place:"قصر المصمك",country:"السعودية",lat:24.6308,lng:46.7132,image:commons("Masmak fort 2022.jpg"),story:"معلم تاريخي بارز في قلب الرياض." },
  { id:"s-elephant",mode:"saudi",title:"أين تقع هذه الصخرة؟",place:"جبل الفيل",country:"السعودية",lat:26.6928,lng:37.9836,image:commons("Elephant Rock Al Ula.jpg"),story:"تكوين صخري شهير قرب العلا." },
  { id:"s-edge",mode:"saudi",title:"حدد موقع هذا المطل",place:"حافة العالم",country:"السعودية",lat:24.9484,lng:45.9958,image:commons("Edge of the World Saudi Arabia.jpg"),story:"جروف طويق المهيبة شمال غرب الرياض." },
  { id:"s-fountain",mode:"saudi",title:"في أي مدينة توجد هذه النافورة؟",place:"نافورة الملك فهد",country:"السعودية",lat:21.5157,lng:39.1458,image:commons("King Fahd's Fountain.jpg"),story:"نافورة شهيرة على كورنيش جدة." },
  { id:"s-rijal",mode:"saudi",title:"أين تقع هذه القرية؟",place:"قرية رجال ألمع",country:"السعودية",lat:18.2125,lng:42.2723,image:commons("Rijal Almaa Heritage Village.jpg"),story:"قرية تراثية حجرية في منطقة عسير." },
  { id:"s-hail",mode:"saudi",title:"حدد موقع هذه القلعة",place:"قلعة أعيرف",country:"السعودية",lat:27.5189,lng:41.6907,image:commons("A'arif fort Hail.jpg"),story:"قلعة تاريخية تطل على مدينة حائل." },
  { id:"s-ithra",mode:"saudi",title:"في أي مدينة يوجد هذا المركز؟",place:"مركز إثراء",country:"السعودية",lat:26.3357,lng:50.1205,image:commons("King Abdulaziz Center for World Culture.jpg"),story:"مركز ثقافي بارز في الظهران." },
];

export const MODE_LABELS: Record<GameMode,string> = {
  place:"أين هذا المكان؟", city:"اكتشف المدينة", aerial:"صورة جوية", border:"حدود الدولة", saudi:"تحديات السعودية", mixed:"جولة العالم"
};

export const DIFFICULTY_LABELS: Record<GameDifficulty,string> = {
  easy:"سهل", medium:"متوسط", hard:"صعب"
};

export function challengeDifficulty(challenge: Challenge): GameDifficulty {
  const sameMode = CHALLENGES.filter((item) => item.mode === challenge.mode);
  const index = sameMode.findIndex((item) => item.id === challenge.id);
  const ratio = index / Math.max(1, sameMode.length);
  return ratio < 0.38 ? "easy" : ratio < 0.74 ? "medium" : "hard";
}

export function distanceKm(aLat:number,aLng:number,bLat:number,bLng:number){
  const r=6371,toRad=(n:number)=>n*Math.PI/180;
  const dLat=toRad(bLat-aLat),dLng=toRad(bLng-aLng);
  const x=Math.sin(dLat/2)**2+Math.cos(toRad(aLat))*Math.cos(toRad(bLat))*Math.sin(dLng/2)**2;
  return Math.round(r*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)));
}
