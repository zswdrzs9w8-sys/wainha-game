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
  { id:"p-redeemer",mode:"place",title:"أين يقع هذا التمثال؟",place:"تمثال المسيح الفادي",country:"البرازيل",lat:-22.9519,lng:-43.2105,image:commons("Christ the Redeemer Rio de Janeiro panorama"),story:"تمثال شهير يطل على مدينة ريو دي جانيرو." },
  { id:"p-louvre",mode:"place",title:"حدد موقع هذا الهرم الزجاجي",place:"هرم اللوفر",country:"فرنسا",lat:48.8606,lng:2.3376,image:commons("Louvre Pyramid Paris courtyard"),story:"مدخل زجاجي شهير في ساحة متحف اللوفر بباريس." },
  { id:"p-rushmore",mode:"place",title:"أين يقع هذا الجبل المنحوت؟",place:"جبل راشمور",country:"الولايات المتحدة",lat:43.8791,lng:-103.4591,image:commons("Mount Rushmore National Memorial"),story:"نحت جبلي ضخم في ولاية داكوتا الجنوبية." },
  { id:"p-forbidden",mode:"place",title:"حدد موقع هذا القصر",place:"المدينة المحرمة",country:"الصين",lat:39.9163,lng:116.3972,image:commons("Forbidden City Beijing panorama"),story:"مجمع قصور إمبراطوري في قلب بكين." },
  { id:"p-hassan",mode:"place",title:"أين يقع هذا المسجد؟",place:"مسجد الحسن الثاني",country:"المغرب",lat:33.6084,lng:-7.6327,image:commons("Hassan II Mosque Casablanca ocean"),story:"مسجد بارز يطل على المحيط الأطلسي في الدار البيضاء." },
  { id:"p-skytree",mode:"place",title:"حدد موقع هذا البرج",place:"طوكيو سكاي تري",country:"اليابان",lat:35.7101,lng:139.8107,image:commons("Tokyo Skytree daylight"),story:"برج بث ومراقبة مرتفع في العاصمة اليابانية." },
  { id:"p-atomium",mode:"place",title:"أين يقع هذا المبنى؟",place:"الأتوميوم",country:"بلجيكا",lat:50.8949,lng:4.3416,image:commons("Atomium Brussels Belgium"),story:"مبنى شهير على هيئة بلورة حديد مكبرة في بروكسل." },
  { id:"p-merlion",mode:"place",title:"حدد موقع هذا التمثال",place:"الميرليون",country:"سنغافورة",lat:1.2868,lng:103.8545,image:commons("Merlion Singapore Marina Bay"),story:"تمثال برأس أسد وجسم سمكة عند خليج سنغافورة." },
  { id:"p-space-needle",mode:"place",title:"أين يقع هذا البرج؟",place:"سبيس نيدل",country:"الولايات المتحدة",lat:47.6205,lng:-122.3493,image:commons("Space Needle Seattle skyline"),story:"برج مراقبة شهير في مدينة سياتل." },
  { id:"p-gateway-india",mode:"place",title:"حدد موقع هذه البوابة",place:"بوابة الهند – مومباي",country:"الهند",lat:18.9220,lng:72.8347,image:commons("Gateway of India Mumbai waterfront"),story:"قوس حجري شهير على واجهة مومباي البحرية." },
  { id:"c-istanbul",mode:"city",title:"اكتشف المدينة",place:"إسطنبول",country:"تركيا",countryId:"792",lat:41.0082,lng:28.9784,image:commons("Istanbul skyline from Galata tower.jpg"),hints:["تقع في قارتي آسيا وأوروبا.","يفصل بين جانبيها مضيق شهير.","اشتهرت بآيا صوفيا والمسجد الأزرق.","هذه صورة لخريطتها المطلة على مضيق البوسفور."],story:"مدينة تاريخية على ضفتي البوسفور." },
  { id:"c-marrakesh",mode:"city",title:"اكتشف المدينة",place:"مراكش",country:"المغرب",countryId:"504",lat:31.6295,lng:-7.9811,image:commons("Marrakech Medina.jpg"),hints:["تقع في قارة أفريقيا.","تقع شمال غرب القارة وقرب جبال الأطلس.","تشتهر بساحة جامع الفنا ولون مبانيها الأحمر.","هذه صورة للمدينة القديمة وأسواقها."],story:"إحدى أشهر المدن التاريخية في المغرب." },
  { id:"c-kyoto",mode:"city",title:"اكتشف المدينة",place:"كيوتو",country:"اليابان",countryId:"392",lat:35.0116,lng:135.7681,image:commons("Kiyomizu-dera in Kyoto-r.jpg"),hints:["تقع في قارة آسيا.","تقع في شرق القارة ضمن دولة جزرية.","تشتهر بمعابدها وأزهار الكرز.","كانت عاصمة إمبراطورية لقرون طويلة."],story:"العاصمة الثقافية القديمة لليابان." },
  { id:"c-rio",mode:"city",title:"اكتشف المدينة",place:"ريو دي جانيرو",country:"البرازيل",countryId:"076",lat:-22.9068,lng:-43.1729,image:commons("Rio de Janeiro aerial coast"),hints:["تقع في أمريكا الجنوبية.","تقع على الساحل الشرقي للقارة.","تشتهر بجبل السكر وشاطئ كوباكابانا.","تحيط بها خلجان وجبال وشواطئ شهيرة."],story:"مدينة برازيلية بين الجبال والمحيط." },
  { id:"c-cape",mode:"city",title:"اكتشف المدينة",place:"كيب تاون",country:"جنوب أفريقيا",countryId:"710",lat:-33.9249,lng:18.4241,image:commons("Cape Town and Table Mountain from Bloubergstrand.jpg"),hints:["تقع في قارة أفريقيا.","تقع قرب الطرف الجنوبي الغربي للقارة.","تشتهر بجبل الطاولة.","تطل على ملتقى طرق بحرية تاريخية."],story:"مدينة ساحلية تحت جبل الطاولة." },
  { id:"c-venice",mode:"city",title:"اكتشف المدينة",place:"البندقية",country:"إيطاليا",countryId:"380",lat:45.4408,lng:12.3155,image:commons("Venice Grand Canal gondolas"),hints:["تقع في قارة أوروبا.","تقع في جنوب القارة على البحر الأدرياتيكي.","تشتهر بالقنوات والقوارب بدل الشوارع.","بني مركزها التاريخي فوق جزر صغيرة كثيرة."],story:"مدينة القنوات الشهيرة في شمال إيطاليا." },
  { id:"c-riyadh",mode:"city",title:"اكتشف المدينة",place:"الرياض",country:"السعودية",countryId:"682",lat:24.7136,lng:46.6753,image:commons("Riyadh skyline Kingdom Centre"),hints:["تقع في قارة آسيا.","تقع في قلب شبه الجزيرة العربية.","تشتهر ببرج المملكة ومركز الملك عبدالله المالي.","هي عاصمة المملكة العربية السعودية."],story:"عاصمة المملكة وأكبر مدنها." },
  { id:"c-cairo",mode:"city",title:"اكتشف المدينة",place:"القاهرة",country:"مصر",countryId:"818",lat:30.0444,lng:31.2357,image:commons("Cairo skyline Nile river"),hints:["تقع في قارة أفريقيا.","يمر فيها أطول أنهار القارة.","تقع قرب أهرامات الجيزة.","هي عاصمة مصر وتلقب بمدينة الألف مئذنة."],story:"عاصمة مصر على ضفاف النيل." },
  { id:"c-paris",mode:"city",title:"اكتشف المدينة",place:"باريس",country:"فرنسا",countryId:"250",lat:48.8566,lng:2.3522,image:commons("Paris skyline Eiffel Tower Seine"),hints:["تقع في قارة أوروبا.","يمر فيها نهر السين.","تشتهر بالشانزليزيه ومتحف اللوفر.","يقف فيها برج إيفل."],story:"العاصمة الفرنسية ومدينة الفنون." },
  { id:"c-london",mode:"city",title:"اكتشف المدينة",place:"لندن",country:"المملكة المتحدة",countryId:"826",lat:51.5074,lng:-0.1278,image:commons("London skyline Thames Big Ben"),hints:["تقع في قارة أوروبا.","يمر فيها نهر التايمز.","تشتهر بالحافلات الحمراء وبرج الساعة.","هي عاصمة المملكة المتحدة."],story:"مدينة عالمية على نهر التايمز." },
  { id:"c-dubai",mode:"city",title:"اكتشف المدينة",place:"دبي",country:"الإمارات",countryId:"784",lat:25.2048,lng:55.2708,image:commons("Dubai skyline Burj Khalifa aerial"),hints:["تقع في قارة آسيا.","تقع على الساحل الجنوبي للخليج العربي.","تشتهر بنخلة جميرا ومينائها التجاري.","يوجد فيها برج خليفة أعلى مبنى في العالم."],story:"مدينة إماراتية حديثة على الخليج العربي." },
  { id:"c-seoul",mode:"city",title:"اكتشف المدينة",place:"سيول",country:"كوريا الجنوبية",countryId:"410",lat:37.5665,lng:126.9780,image:commons("Seoul skyline Han River"),hints:["تقع في قارة آسيا.","تقع في شرق القارة على شبه جزيرة.","يمر فيها نهر الهان وتشتهر بالتقنية.","هي عاصمة كوريا الجنوبية."],story:"عاصمة حديثة تجمع القصور التاريخية والتقنية." },
  { id:"c-bangkok",mode:"city",title:"اكتشف المدينة",place:"بانكوك",country:"تايلاند",countryId:"764",lat:13.7563,lng:100.5018,image:commons("Bangkok skyline Chao Phraya river"),hints:["تقع في قارة آسيا.","تقع في جنوب شرق القارة.","يمر فيها نهر تشاو فرايا وتشتهر بالأسواق العائمة.","هي عاصمة تايلاند."],story:"مدينة نابضة بالحياة في جنوب شرق آسيا." },
  { id:"c-buenos",mode:"city",title:"اكتشف المدينة",place:"بوينس آيرس",country:"الأرجنتين",countryId:"032",lat:-34.6037,lng:-58.3816,image:commons("Buenos Aires Obelisk city"),hints:["تقع في أمريكا الجنوبية.","تقع على الساحل الشرقي قرب مصب نهر عريض.","تشتهر برقصة التانغو وشارع التاسع من يوليو.","هي عاصمة الأرجنتين."],story:"عاصمة الأرجنتين وموطن التانغو." },
  { id:"c-lima",mode:"city",title:"اكتشف المدينة",place:"ليما",country:"بيرو",countryId:"604",lat:-12.0464,lng:-77.0428,image:commons("Lima Peru coast skyline"),hints:["تقع في أمريكا الجنوبية.","تقع على الساحل الغربي للقارة.","تطل على المحيط الهادئ وتقع قرب صحراء ساحلية.","هي عاصمة بيرو."],story:"عاصمة ساحلية على المحيط الهادئ." },
  { id:"c-mexico",mode:"city",title:"اكتشف المدينة",place:"مكسيكو سيتي",country:"المكسيك",countryId:"484",lat:19.4326,lng:-99.1332,image:commons("Mexico City skyline monument"),hints:["تقع في أمريكا الشمالية.","تقع على هضبة مرتفعة وسط دولة لاتينية.","تشتهر بساحة الدستور ومتحف الأنثروبولوجيا.","هي عاصمة المكسيك."],story:"مدينة ضخمة فوق هضبة المكسيك." },
  { id:"c-toronto",mode:"city",title:"اكتشف المدينة",place:"تورونتو",country:"كندا",countryId:"124",lat:43.6532,lng:-79.3832,image:commons("Toronto skyline CN Tower waterfront"),hints:["تقع في أمريكا الشمالية.","تقع على ضفاف إحدى البحيرات العظمى.","تشتهر ببرج سي إن.","هي أكبر مدن كندا."],story:"أكبر مدن كندا على بحيرة أونتاريو." },
  { id:"c-lisbon",mode:"city",title:"اكتشف المدينة",place:"لشبونة",country:"البرتغال",countryId:"620",lat:38.7223,lng:-9.1393,image:commons("Lisbon tram Tagus river"),hints:["تقع في قارة أوروبا.","تقع في أقصى غرب جنوب القارة.","تشتهر بالترام الأصفر وجسر ممتد فوق مصب واسع.","هي عاصمة البرتغال."],story:"مدينة التلال والترام على نهر تاجه." },
  { id:"c-amsterdam",mode:"city",title:"اكتشف المدينة",place:"أمستردام",country:"هولندا",countryId:"528",lat:52.3676,lng:4.9041,image:commons("Amsterdam canals bicycles"),hints:["تقع في قارة أوروبا.","تقع في شمال غرب القارة ضمن دولة منخفضة.","تشتهر بالقنوات والدراجات والمنازل الضيقة.","هي عاصمة هولندا."],story:"مدينة القنوات والدراجات في هولندا." },
  { id:"c-prague",mode:"city",title:"اكتشف المدينة",place:"براغ",country:"التشيك",countryId:"203",lat:50.0755,lng:14.4378,image:commons("Prague Charles Bridge castle"),hints:["تقع في قارة أوروبا.","تقع في وسط القارة ويمر بها نهر فلتافا.","تشتهر بجسر تشارلز وساعتها الفلكية.","هي عاصمة التشيك."],story:"مدينة تاريخية تعرف بمدينة المئة برج." },
  { id:"c-vienna",mode:"city",title:"اكتشف المدينة",place:"فيينا",country:"النمسا",countryId:"040",lat:48.2082,lng:16.3738,image:commons("Vienna skyline Danube"),hints:["تقع في قارة أوروبا.","تقع في وسط القارة قرب نهر الدانوب.","اشتهرت بالموسيقى الكلاسيكية والقصور الإمبراطورية.","هي عاصمة النمسا."],story:"عاصمة الموسيقى والقصور في النمسا." },
  { id:"c-nairobi",mode:"city",title:"اكتشف المدينة",place:"نيروبي",country:"كينيا",countryId:"404",lat:-1.2921,lng:36.8219,image:commons("Nairobi skyline Kenya"),hints:["تقع في قارة أفريقيا.","تقع في شرق القارة قرب خط الاستواء.","توجد قربها حديقة وطنية تشاهد منها الحيوانات وخلفها الأبراج.","هي عاصمة كينيا."],story:"عاصمة كينيا وبوابة رحلات السفاري." },
  { id:"c-addis",mode:"city",title:"اكتشف المدينة",place:"أديس أبابا",country:"إثيوبيا",countryId:"231",lat:8.9806,lng:38.7578,image:commons("Addis Ababa skyline Ethiopia"),hints:["تقع في قارة أفريقيا.","تقع في شرق القارة على هضبة مرتفعة.","تستضيف مقر الاتحاد الأفريقي.","هي عاصمة إثيوبيا."],story:"عاصمة مرتفعة ومقر الاتحاد الأفريقي." },
  { id:"c-muscat",mode:"city",title:"اكتشف المدينة",place:"مسقط",country:"عُمان",countryId:"512",lat:23.5880,lng:58.3829,image:commons("Muscat Oman mountains coast"),hints:["تقع في قارة آسيا.","تقع في جنوب شرق شبه الجزيرة العربية.","تحيط بها جبال صخرية وتطل على بحر عُمان.","هي عاصمة سلطنة عُمان."],story:"مدينة ساحلية بين الجبال والبحر." },
  { id:"c-doha",mode:"city",title:"اكتشف المدينة",place:"الدوحة",country:"قطر",countryId:"634",lat:25.2854,lng:51.5310,image:commons("Doha skyline Corniche Qatar"),hints:["تقع في قارة آسيا.","تقع على شبه جزيرة صغيرة في الخليج العربي.","تشتهر بكورنيشها وأبراج الخليج الغربي.","هي عاصمة قطر."],story:"عاصمة خليجية حديثة على البحر." },
  { id:"c-amman",mode:"city",title:"اكتشف المدينة",place:"عمّان",country:"الأردن",countryId:"400",lat:31.9539,lng:35.9106,image:commons("Amman Jordan Citadel city"),hints:["تقع في قارة آسيا.","تقع في بلاد الشام فوق عدة جبال.","تشتهر بالمدرج الروماني والقلعة.","هي عاصمة الأردن."],story:"مدينة جبلية تاريخية في بلاد الشام." },
  { id:"c-tunis",mode:"city",title:"اكتشف المدينة",place:"تونس",country:"تونس",countryId:"788",lat:36.8065,lng:10.1815,image:commons("Tunis Tunisia medina skyline"),hints:["تقع في قارة أفريقيا.","تقع في شمال القارة قرب البحر المتوسط.","تقع قرب آثار قرطاج وتشتهر بمدينتها العتيقة.","هي عاصمة تونس."],story:"عاصمة متوسطية قرب قرطاج." },
  { id:"c-reykjavik",mode:"city",title:"اكتشف المدينة",place:"ريكيافيك",country:"آيسلندا",countryId:"352",lat:64.1466,lng:-21.9426,image:commons("Reykjavik Iceland skyline mountain"),hints:["تقع في قارة أوروبا.","تقع على جزيرة بركانية في شمال المحيط الأطلسي.","تشتهر بالينابيع الحارة والشفق القطبي.","هي عاصمة آيسلندا."],story:"إحدى أقصى عواصم العالم شمالًا." },
  { id:"c-auckland",mode:"city",title:"اكتشف المدينة",place:"أوكلاند",country:"نيوزيلندا",countryId:"554",lat:-36.8509,lng:174.7645,image:commons("Auckland skyline harbour New Zealand"),hints:["تقع في جنوب المحيط الهادئ.","تقع في الجزء الشمالي من دولة جزرية.","تشتهر بالمرافئ والقوارب وبرج السماء.","هي أكبر مدن نيوزيلندا."],story:"مدينة المرافئ في نيوزيلندا." },
  { id:"c-singapore",mode:"city",title:"اكتشف المدينة",place:"سنغافورة",country:"سنغافورة",countryId:"702",lat:1.3521,lng:103.8198,image:commons("Singapore Marina Bay skyline gardens"),hints:["تقع في قارة آسيا.","تقع عند الطرف الجنوبي لشبه جزيرة الملايو.","تشتهر بمارينا باي وحدائق الخليج.","هي مدينة ودولة في الوقت نفسه."],story:"دولة مدينة حديثة في جنوب شرق آسيا." },
  { id:"a-palm",mode:"aerial",title:"صورة من الأعلى… أين هذا المكان؟",place:"نخلة جميرا",country:"الإمارات",lat:25.1124,lng:55.1390,image:commons("Palm Jumeirah's Palm Leaf on 1 May 2007 Pict 1.jpg"),story:"جزيرة صناعية على شكل نخلة قبالة دبي." },
  { id:"a-niagara",mode:"aerial",title:"حدد موقع هذه الظاهرة الطبيعية",place:"شلالات نياجرا",country:"كندا والولايات المتحدة",lat:43.0828,lng:-79.0742,image:commons("Niagara Falls NASA.jpg"),story:"تقع على الحدود بين كندا والولايات المتحدة." },
  { id:"a-everest",mode:"aerial",title:"أين تقع هذه القمة؟",place:"جبل إيفرست",country:"نيبال والصين",lat:27.9881,lng:86.9250,image:commons("Mount Everest as seen from Drukair2 PLW edit.jpg"),story:"أعلى قمة جبلية فوق مستوى سطح البحر." },
  { id:"a-victoria",mode:"aerial",title:"ضع الدبوس عند هذه الشلالات",place:"شلالات فيكتوريا",country:"زامبيا وزيمبابوي",lat:-17.9243,lng:25.8572,image:commons("Victoria Falls 2012 05 24 1628 (7422466716).jpg"),story:"ستار مائي هائل على نهر الزمبيزي." },
  { id:"a-grand",mode:"aerial",title:"أين يقع هذا الأخدود؟",place:"غراند كانيون",country:"الولايات المتحدة",lat:36.1069,lng:-112.1129,image:commons("Grand Canyon view from Pima Point 2010.jpg"),story:"أخدود عظيم نحته نهر كولورادو." },
  { id:"a-maldives",mode:"aerial",title:"حدد موقع هذه الجزر",place:"جزر المالديف",country:"المالديف",lat:3.2028,lng:73.2207,image:commons("Maldives 1997.jpg"),story:"سلسلة جزر مرجانية في المحيط الهندي." },
  { id:"a-uyuni",mode:"aerial",title:"أين تقع هذه المسطحات البيضاء؟",place:"سالار دي أويوني",country:"بوليفيا",lat:-20.1338,lng:-67.4891,image:commons("Salar de Uyuni aerial Bolivia"),story:"أكبر مسطح ملحي في العالم." },
  { id:"a-barrier",mode:"aerial",title:"حدد موقع هذه الشعاب",place:"الحاجز المرجاني العظيم",country:"أستراليا",lat:-18.2871,lng:147.6992,image:commons("Great Barrier Reef aerial Australia"),story:"أكبر نظام للشعاب المرجانية في العالم." },
  { id:"a-nile",mode:"aerial",title:"أين تقع هذه الدلتا؟",place:"دلتا النيل",country:"مصر",lat:30.9000,lng:31.1000,image:commons("Nile Delta satellite image"),story:"أرض خضراء مثلثة عند مصب نهر النيل." },
  { id:"a-baikal",mode:"aerial",title:"حدد موقع هذه البحيرة",place:"بحيرة بايكال",country:"روسيا",lat:53.5587,lng:108.1650,image:commons("Lake Baikal satellite image"),story:"أعمق بحيرة للمياه العذبة في العالم." },
  { id:"a-uluru",mode:"aerial",title:"أين تقع هذه الصخرة العملاقة؟",place:"أولورو",country:"أستراليا",lat:-25.3444,lng:131.0369,image:commons("Uluru aerial Australia"),story:"تكوين صخري أحمر شهير في قلب أستراليا." },
  { id:"a-nazca",mode:"aerial",title:"حدد موقع هذه الرسوم الأرضية",place:"خطوط نازكا",country:"بيرو",lat:-14.7390,lng:-75.1300,image:commons("Nazca Lines aerial Peru"),story:"رسوم ضخمة قديمة لا تتضح إلا من الأعلى." },
  { id:"a-panama",mode:"aerial",title:"أين يقع هذا الممر المائي؟",place:"قناة بنما",country:"بنما",lat:9.0800,lng:-79.6800,image:commons("Panama Canal aerial locks"),story:"قناة تربط بين المحيطين الأطلسي والهادئ." },
  { id:"a-fuji",mode:"aerial",title:"حدد موقع هذا الجبل",place:"جبل فوجي",country:"اليابان",lat:35.3606,lng:138.7274,image:commons("Mount Fuji aerial Japan"),story:"جبل بركاني متناظر يعد رمزًا لليابان." },
  { id:"a-santorini",mode:"aerial",title:"أين تقع هذه الجزيرة البركانية؟",place:"سانتوريني",country:"اليونان",lat:36.3932,lng:25.4615,image:commons("Santorini caldera aerial Greece"),story:"جزيرة على حافة كالديرا بركانية في بحر إيجه." },
  { id:"a-amazon",mode:"aerial",title:"حدد موقع هذا النهر المتعرج",place:"نهر الأمازون",country:"البرازيل",lat:-3.4653,lng:-62.2159,image:commons("Amazon River satellite Brazil"),story:"أحد أعظم أنهار العالم وسط غابة مطيرة واسعة." },
  { id:"b-italy",mode:"border",title:"شكل أي دولة؟",place:"إيطاليا",country:"إيطاليا",lat:42.8,lng:12.8,image:commons("Italy map-blank.svg"),story:"دولة أوروبية يشبه شكلها الحذاء." },
  { id:"b-japan",mode:"border",title:"شكل أي دولة؟",place:"اليابان",country:"اليابان",lat:36.2,lng:138.3,image:commons("Japan map blank.png"),story:"أرخبيل طويل في شرق آسيا." },
  { id:"b-chile",mode:"border",title:"شكل أي دولة؟",place:"تشيلي",country:"تشيلي",lat:-33.4,lng:-70.7,image:commons("Chile location map.svg"),story:"دولة طويلة وضيقة على ساحل أمريكا الجنوبية." },
  { id:"b-madagascar",mode:"border",title:"شكل أي دولة؟",place:"مدغشقر",country:"مدغشقر",lat:-18.7669,lng:46.8691,image:commons("Madagascar location map.svg"),story:"جزيرة كبيرة شرق قارة أفريقيا." },
  { id:"b-india",mode:"border",title:"شكل أي دولة؟",place:"الهند",country:"الهند",lat:22.8,lng:79.0,image:commons("India location map.svg"),story:"دولة كبيرة في جنوب قارة آسيا." },
  { id:"b-brazil",mode:"border",title:"شكل أي دولة؟",place:"البرازيل",country:"البرازيل",lat:-14.2,lng:-51.9,image:commons("Brazil location map.svg"),story:"أكبر دول أمريكا الجنوبية مساحة." },
  { id:"b-saudi",mode:"border",title:"شكل أي دولة؟",place:"السعودية",country:"السعودية",lat:23.9,lng:45.1,image:commons("Saudi Arabia blank map"),story:"أكبر دول شبه الجزيرة العربية مساحة." },
  { id:"b-australia",mode:"border",title:"شكل أي دولة؟",place:"أستراليا",country:"أستراليا",lat:-25.3,lng:133.8,image:commons("Australia blank map"),story:"دولة وقارة تحيط بها المحيطات." },
  { id:"b-mexico",mode:"border",title:"شكل أي دولة؟",place:"المكسيك",country:"المكسيك",lat:23.6,lng:-102.5,image:commons("Mexico blank map"),story:"دولة بين الولايات المتحدة وأمريكا الوسطى." },
  { id:"b-canada",mode:"border",title:"شكل أي دولة؟",place:"كندا",country:"كندا",lat:56.1,lng:-106.3,image:commons("Canada blank map"),story:"ثاني أكبر دول العالم مساحة." },
  { id:"b-turkey",mode:"border",title:"شكل أي دولة؟",place:"تركيا",country:"تركيا",lat:39.0,lng:35.2,image:commons("Turkey blank map"),story:"تمتد أراضيها بين قارتي آسيا وأوروبا." },
  { id:"b-egypt",mode:"border",title:"شكل أي دولة؟",place:"مصر",country:"مصر",lat:26.8,lng:30.8,image:commons("Egypt blank map"),story:"دولة عربية يعبرها نهر النيل." },
  { id:"b-morocco",mode:"border",title:"شكل أي دولة؟",place:"المغرب",country:"المغرب",lat:31.8,lng:-7.1,image:commons("Morocco blank map"),story:"تقع في أقصى شمال غرب أفريقيا." },
  { id:"b-norway",mode:"border",title:"شكل أي دولة؟",place:"النرويج",country:"النرويج",lat:60.5,lng:8.5,image:commons("Norway blank map"),story:"دولة طويلة ذات ساحل كثير المضائق." },
  { id:"s-kaaba",mode:"saudi",title:"حدد موقع هذا المعلم السعودي",place:"المسجد الحرام",country:"السعودية",lat:21.4225,lng:39.8262,image:commons("Kaaba Masjid Haram Makkah.jpg"),story:"قبلة المسلمين في مكة المكرمة." },
  { id:"s-masmak",mode:"saudi",title:"في أي مدينة يوجد هذا المعلم؟",place:"قصر المصمك",country:"السعودية",lat:24.6308,lng:46.7132,image:commons("Masmak fort 2022.jpg"),story:"معلم تاريخي بارز في قلب الرياض." },
  { id:"s-elephant",mode:"saudi",title:"أين تقع هذه الصخرة؟",place:"جبل الفيل",country:"السعودية",lat:26.6928,lng:37.9836,image:commons("Elephant Rock Al Ula.jpg"),story:"تكوين صخري شهير قرب العلا." },
  { id:"s-edge",mode:"saudi",title:"حدد موقع هذا المطل",place:"حافة العالم",country:"السعودية",lat:24.9484,lng:45.9958,image:commons("Edge of the World Saudi Arabia.jpg"),story:"جروف طويق المهيبة شمال غرب الرياض." },
  { id:"s-fountain",mode:"saudi",title:"في أي مدينة توجد هذه النافورة؟",place:"نافورة الملك فهد",country:"السعودية",lat:21.5157,lng:39.1458,image:commons("King Fahd's Fountain.jpg"),story:"نافورة شهيرة على كورنيش جدة." },
  { id:"s-rijal",mode:"saudi",title:"أين تقع هذه القرية؟",place:"قرية رجال ألمع",country:"السعودية",lat:18.2125,lng:42.2723,image:commons("Rijal Almaa Heritage Village.jpg"),story:"قرية تراثية حجرية في منطقة عسير." },
  { id:"s-hail",mode:"saudi",title:"حدد موقع هذه القلعة",place:"قلعة أعيرف",country:"السعودية",lat:27.5189,lng:41.6907,image:commons("A'arif fort Hail.jpg"),story:"قلعة تاريخية تطل على مدينة حائل." },
  { id:"s-ithra",mode:"saudi",title:"في أي مدينة يوجد هذا المركز؟",place:"مركز إثراء",country:"السعودية",lat:26.3357,lng:50.1205,image:commons("King Abdulaziz Center for World Culture.jpg"),story:"مركز ثقافي بارز في الظهران." },
  { id:"s-kingdom",mode:"saudi",title:"في أي مدينة يوجد هذا البرج؟",place:"برج المملكة",country:"السعودية",lat:24.7114,lng:46.6744,image:commons("Kingdom Centre Riyadh skyline"),story:"برج شهير بفتحة علوية وجسر مشاهدة في الرياض." },
  { id:"s-prophet",mode:"saudi",title:"حدد موقع هذا المسجد",place:"المسجد النبوي",country:"السعودية",lat:24.4672,lng:39.6111,image:commons("Al Masjid an Nabawi Medina"),story:"مسجد رسول الله ﷺ في المدينة المنورة." },
  { id:"s-turaif",mode:"saudi",title:"أين يقع هذا الحي التاريخي؟",place:"حي الطريف",country:"السعودية",lat:24.7340,lng:46.5720,image:commons("At Turaif Diriyah Saudi Arabia"),story:"موقع تراث عالمي في الدرعية التاريخية." },
  { id:"s-balad",mode:"saudi",title:"في أي مدينة توجد هذه البيوت؟",place:"جدة التاريخية",country:"السعودية",lat:21.4858,lng:39.1876,image:commons("Al Balad historic Jeddah Roshan"),story:"حي تاريخي مشهور ببيوت الرواشين." },
  { id:"s-disah",mode:"saudi",title:"حدد موقع هذا الوادي",place:"وادي الديسة",country:"السعودية",lat:27.6330,lng:36.5330,image:commons("Wadi Al Disah Saudi Arabia"),story:"وادٍ تحيط به أعمدة صخرية شاهقة في منطقة تبوك." },
  { id:"s-qarah",mode:"saudi",title:"أين يقع هذا الجبل؟",place:"جبل القارة",country:"السعودية",lat:25.4114,lng:49.6914,image:commons("Al Qarah Mountain Al Ahsa"),story:"جبل ذو كهوف وممرات صخرية في الأحساء." },
  { id:"s-umluj",mode:"saudi",title:"حدد موقع هذه الجزر",place:"جزر أملج",country:"السعودية",lat:25.0500,lng:37.2700,image:commons("Umluj islands Saudi Arabia Red Sea"),story:"جزر وشواطئ صافية على ساحل البحر الأحمر." },
  { id:"s-qasr",mode:"saudi",title:"أين يقع هذا القصر؟",place:"قصر شبرا",country:"السعودية",lat:21.2756,lng:40.4158,image:commons("Shubra Palace Taif Saudi Arabia"),story:"قصر تاريخي شهير في مدينة الطائف." },
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
