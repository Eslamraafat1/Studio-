import type { L, LA } from "@/lib/i18n";

export const site = {
  name: "MONOLITH®",
  url: "https://monolith-studio.example",
  email: "studio@monolith-studio.example",
  phone: "+45 32 00 14 14",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Behance", href: "https://behance.net" },
  ],
};

export const stats: { value: number; label: L; pad?: boolean }[] = [
  { value: 12, label: { en: "Years of practice", ar: "عاماً من الممارسة" } },
  { value: 38, label: { en: "Completed projects", ar: "مشروعاً منجزاً" } },
  { value: 9, pad: true, label: { en: "Countries", ar: "دول" } },
  { value: 14, label: { en: "International awards", ar: "جائزة دولية" } },
];

export const principles: { id: string; no: string; title: L; text: L; points: LA }[] = [
  { id: "material", no: "I", title: { en: "MATERIAL HONESTY", ar: "صدق المادة" },
    text: { en: "We let concrete be concrete, timber be timber. Finishes are never disguises; they are the building's own skin, and they should age with dignity.", ar: "ندع الخرسانة خرسانةً والخشب خشباً. التشطيبات ليست أقنعة بل جلد المبنى ذاته، وينبغي أن تشيخ بكرامة." },
    points: { en: ["Unfinished surfaces", "Local sourcing", "Repairable details"], ar: ["أسطح غير مُغطّاة", "مصادر محلية", "تفاصيل قابلة للإصلاح"] } },
  { id: "light", no: "II", title: { en: "LIGHT & SHADOW", ar: "الضوء والظل" },
    text: { en: "Light is drawn before walls are. We model sun paths by hand and tune every opening so a room changes character across the day.", ar: "نرسم الضوء قبل الجدران. نحاكي مسارات الشمس يدوياً ونضبط كل فتحة ليتغيّر طابع الغرفة على امتداد النهار." },
    points: { en: ["Physical daylight models", "Controlled glare", "Deep shadow"], ar: ["نماذج ضوء مادية", "وهج مضبوط", "ظل عميق"] } },
  { id: "human", no: "III", title: { en: "HUMAN EXPERIENCE", ar: "التجربة الإنسانية" },
    text: { en: "Proportion, threshold, touch and sound — we design what a body feels first. A good building is understood long before it is analysed.", ar: "النسب والعتبة واللمس والصوت؛ نصمّم ما يشعر به الجسد أولاً. المبنى الجيد يُفهم قبل أن يُحلَّل بزمن طويل." },
    points: { en: ["Human scale", "Acoustic comfort", "Slow arrival"], ar: ["مقياس إنساني", "راحة صوتية", "وصول بطيء"] } },
];

export interface Member { name: string; role: L; bio: L; years: string; tone: string; initials: string }
export const team: Member[] = [
  { name: "Ingrid Solheim", initials: "IS", tone: "#505A49", years: "2014", role: { en: "Founding Partner · Design", ar: "الشريكة المؤسِّسة · التصميم" }, bio: { en: "Trained in Copenhagen and Kyoto. Leads concept design and the studio's research into concrete and light.", ar: "تدرّبت في كوبنهاغن وكيوتو. تقود التصميم المفاهيمي وأبحاث الاستوديو في الخرسانة والضوء." } },
  { name: "Karim El-Sayed", initials: "KE", tone: "#A66D4E", years: "2014", role: { en: "Founding Partner · Cairo", ar: "الشريك المؤسِّس · القاهرة" }, bio: { en: "Directs the Cairo studio and the practice's work on passive cooling, stone and craft collaboration.", ar: "يدير استوديو القاهرة وأعمال الممارسة في التبريد السلبي والحجر والتعاون مع الحِرفيين." } },
  { name: "Elena Rossi", initials: "ER", tone: "#77766F", years: "2017", role: { en: "Partner · Commercial", ar: "الشريكة · التجاري" }, bio: { en: "Leads urban and commercial projects, with a focus on facades, structure and public ground floors.", ar: "تقود المشاريع الحضرية والتجارية مع تركيز على الواجهات والإنشاء والطوابق الأرضية العامة." } },
  { name: "Yuki Tanabe", initials: "YT", tone: "#43597e", years: "2018", role: { en: "Associate · Model Shop", ar: "المساعد · ورشة النماذج" }, bio: { en: "Runs the model workshop. Builds every project three times before it is built once.", ar: "يدير ورشة النماذج. يبني كل مشروع ثلاث مرات قبل أن يُبنى مرة." } },
  { name: "Omar Haddad", initials: "OH", tone: "#8b7a5a", years: "2019", role: { en: "Associate · Technical", ar: "المساعد · التقني" }, bio: { en: "Coordinates structure, envelope and site delivery from detail design to handover.", ar: "ينسّق الإنشاء والغلاف والتنفيذ في الموقع من التفاصيل حتى التسليم." } },
  { name: "Maja Lindqvist", initials: "ML", tone: "#3c4a40", years: "2021", role: { en: "Designer · Sustainability", ar: "المصمِّمة · الاستدامة" }, bio: { en: "Leads carbon accounting and life-cycle studies across all of the studio's projects.", ar: "تقود محاسبة الكربون ودراسات دورة الحياة في جميع مشاريع الاستوديو." } },
];

export const history: { year: string; title: L; text: L }[] = [
  { year: "2014", title: { en: "A table in a boatyard", ar: "طاولة في حوض سفن" }, text: { en: "Ingrid and Karim open MONOLITH® on a single table in a Copenhagen boatyard. First commission: a garden wall.", ar: "تفتتح إنغريد وكريم «مونوليث®» على طاولة واحدة في حوض سفن بكوبنهاغن. أول تكليف: جدار حديقة." } },
  { year: "2016", title: { en: "Zamalek, Cairo", ar: "الزمالك، القاهرة" }, text: { en: "The Cairo studio opens above a bookbinder's. The first mashrabiya prototype is built in the stairwell.", ar: "يُفتتح استوديو القاهرة فوق ورشة تجليد كتب. يُبنى أول نموذج مشربية في بيت الدرج." } },
  { year: "2019", title: { en: "The model shop", ar: "ورشة النماذج" }, text: { en: "A dedicated workshop for physical models becomes the studio's main design tool.", ar: "ورشة مخصّصة للنماذج المادية تصبح أداة التصميم الرئيسية في الاستوديو." } },
  { year: "2022", title: { en: "The Courtyard", ar: "الفناء" }, text: { en: "Completion of the Cairo compound wins the studio's first international award.", ar: "اكتمال المجمّع في القاهرة يفوز بأول جائزة دولية للاستوديو." } },
  { year: "2023", title: { en: "Two cultural landmarks", ar: "معلمان ثقافيان" }, text: { en: "Concrete Horizon and The Observatory complete within months of each other.", ar: "يكتمل «أفق الخرسانة» و«المرصد» في غضون أشهر." } },
  { year: "2025", title: { en: "Into the desert", ar: "نحو الصحراء" }, text: { en: "Desert Frame opens in AlUla — the studio's first fully reversible building.", ar: "يُفتتح «إطار الصحراء» في العُلا — أول مبنى للاستوديو قابل للإزالة كلياً." } },
];

export const disciplines: { title: L; text: L }[] = [
  { title: { en: "Architecture", ar: "العمارة" }, text: { en: "Houses, cultural buildings and workplaces, from feasibility to handover.", ar: "بيوت ومبانٍ ثقافية وأماكن عمل، من دراسة الجدوى حتى التسليم." } },
  { title: { en: "Interiors", ar: "التصميم الداخلي" }, text: { en: "Fitted joinery, lighting and furniture designed with the building.", ar: "نجارة مثبّتة وإضاءة وأثاث يُصمَّم مع المبنى." } },
  { title: { en: "Urban & landscape", ar: "العمران والمناظر" }, text: { en: "Public grounds, courtyards and plazas treated as rooms.", ar: "أراضٍ عامة وأفنية وساحات تُعامَل كغرف." } },
  { title: { en: "Research", ar: "البحث" }, text: { en: "Material studies, daylight modelling and carbon accounting.", ar: "دراسات مواد ونمذجة ضوء ومحاسبة كربون." } },
];

export const achievements: { year: string; title: L; org: L }[] = [
  { year: "2024", title: { en: "Silver Medal, Residential Architecture", ar: "الميدالية الفضية، العمارة السكنية" }, org: { en: "Concept awards (illustrative)", ar: "جوائز تصوّرية (توضيحي)" } },
  { year: "2023", title: { en: "Cultural Building of the Year — shortlist", ar: "مبنى العام الثقافي — القائمة القصيرة" }, org: { en: "Concept awards (illustrative)", ar: "جوائز تصوّرية (توضيحي)" } },
  { year: "2022", title: { en: "Climate-Responsive Design Prize", ar: "جائزة التصميم المتجاوب مع المناخ" }, org: { en: "Concept awards (illustrative)", ar: "جوائز تصوّرية (توضيحي)" } },
  { year: "2021", title: { en: "Emerging Practice, Northern Europe", ar: "ممارسة ناشئة، شمال أوروبا" }, org: { en: "Concept awards (illustrative)", ar: "جوائز تصوّرية (توضيحي)" } },
];

export interface Stage { id: string; no: string; title: L; summary: L; image: string; alt: L; activities: LA; deliverables: LA; duration: L }
export const stages: Stage[] = [
  { id: "discover", no: "01", title: { en: "DISCOVER", ar: "اكتشاف" }, duration: { en: "4–8 weeks", ar: "٤–٨ أسابيع" },
    summary: { en: "We walk the site at different hours, interview everyone who will use the building, and study the climate, soil, culture and law that will shape it.", ar: "نمشي في الموقع في ساعات مختلفة، ونحاور كل من سيستخدم المبنى، وندرس المناخ والتربة والثقافة والأنظمة التي ستشكّله." },
    image: "/images/studio/workshop-2.jpg", alt: { en: "Contour site model on a workshop table", ar: "نموذج كونتوري للموقع على طاولة الورشة" },
    activities: { en: ["Site walks at dawn, noon and dusk", "Stakeholder interviews", "Climate and daylight analysis", "Planning and heritage review"], ar: ["جولات موقع عند الفجر والظهر والغروب", "مقابلات مع أصحاب المصلحة", "تحليل المناخ والضوء", "مراجعة التخطيط والتراث"] },
    deliverables: { en: ["Site dossier", "Brief & ambition statement", "Programme diagram"], ar: ["ملف الموقع", "وثيقة البرنامج والطموح", "مخطط البرنامج"] } },
  { id: "concept", no: "02", title: { en: "CONCEPT", ar: "تصوّر" }, duration: { en: "6–10 weeks", ar: "٦–١٠ أسابيع" },
    summary: { en: "Ideas are tested in white card. We make dozens of quick massing models and choose, with the client, the one that says the most with the least.", ar: "تُختبر الأفكار بورق أبيض. نصنع عشرات نماذج الكتل السريعة ونختار مع العميل الأكثر قولاً بالأقل." },
    image: "/images/studio/workshop-1.jpg", alt: { en: "White massing models", ar: "نماذج كتل بيضاء" },
    activities: { en: ["Massing model workshops", "Hand sketching and sections", "Daylight and shadow studies", "Cost-planning with a quantity surveyor"], ar: ["ورش نماذج الكتل", "رسم يدوي وقطاعات", "دراسات الضوء والظل", "تخطيط التكلفة مع مهندس كميات"] },
    deliverables: { en: ["Concept model 1:200", "Concept book", "Outline cost plan"], ar: ["نموذج تصوّري ١:٢٠٠", "كتاب التصوّر", "خطة تكلفة مبدئية"] } },
  { id: "develop", no: "03", title: { en: "DEVELOP", ar: "تطوير" }, duration: { en: "3–6 months", ar: "٣–٦ أشهر" },
    summary: { en: "The idea becomes buildable. Structure, envelope and materials are resolved together, and the critical details are tested as full-size mock-ups.", ar: "تصبح الفكرة قابلة للبناء. يُحسم الإنشاء والغلاف والمواد معاً، وتُختبر التفاصيل الحرجة بنماذج بالحجم الطبيعي." },
    image: "/images/projects/form-and-light-2.jpg", alt: { en: "Fin detail on a stone facade", ar: "تفصيل زعانف على واجهة حجرية" },
    activities: { en: ["Structural and services coordination", "Material samples and mock-ups", "Detail design at 1:5 and 1:1", "Planning and permit submissions"], ar: ["تنسيق الإنشاء والخدمات", "عينات مواد ونماذج", "تصميم التفاصيل ١:٥ و١:١", "تقديم التراخيص"] },
    deliverables: { en: ["Technical drawing set", "Specification", "Full-size mock-up"], ar: ["مجموعة رسومات تقنية", "المواصفات", "نموذج بالحجم الطبيعي"] } },
  { id: "realize", no: "04", title: { en: "REALIZE", ar: "تحقيق" }, duration: { en: "12–30 months", ar: "١٢–٣٠ شهراً" },
    summary: { en: "We are on site every week. Decisions are made with the builder at the wall, not in the email thread, and the building is handed over with a care manual.", ar: "نحن في الموقع كل أسبوع. تُتخذ القرارات مع المقاول عند الجدار لا في سلسلة البريد، ويُسلَّم المبنى مع دليل عناية." },
    image: "/images/projects/the-observatory-2.jpg", alt: { en: "Completed observatory at dusk", ar: "المرصد المكتمل عند الغروب" },
    activities: { en: ["Weekly site presence", "Shop-drawing review", "Craft collaboration", "Post-occupancy review at 12 months"], ar: ["حضور أسبوعي في الموقع", "مراجعة الرسومات التنفيذية", "التعاون مع الحِرفيين", "مراجعة ما بعد الإشغال بعد ١٢ شهراً"] },
    deliverables: { en: ["Completed building", "Owner's care manual", "Post-occupancy report"], ar: ["المبنى المكتمل", "دليل عناية المالك", "تقرير ما بعد الإشغال"] } },
];

export interface MaterialItem { id: string; name: L; tagline: L; text: L; image: string; specs: { label: L; value: string; pct: number }[]; used: string[]; swatch: string }
export const materials: MaterialItem[] = [
  { id: "concrete", swatch: "#a8a59c", name: { en: "Concrete", ar: "الخرسانة" }, tagline: { en: "Mass, memory, patience", ar: "كتلة وذاكرة وصبر" },
    text: { en: "Poured in place and cast in timber boards, concrete holds the imprint of its making. We use it for mass — thermal, acoustic and visual.", ar: "تُصبّ في موضعها وتُشكَّل بألواح الخشب فتحمل أثر صنعها. نستخدمها للكتلة: الحرارية والصوتية والبصرية." },
    image: "/images/materials/concrete.jpg", used: ["the-silent-house", "concrete-horizon", "the-observatory"],
    specs: [{ label: { en: "Compressive strength", ar: "مقاومة الضغط" }, value: "40–60 MPa", pct: 78 }, { label: { en: "Thermal mass", ar: "الكتلة الحرارية" }, value: "2,400 kg/m³", pct: 92 }, { label: { en: "Design life", ar: "العمر التصميمي" }, value: "100+ yrs", pct: 95 }, { label: { en: "Embodied carbon", ar: "الكربون المتجسّد" }, value: "High → managed", pct: 70 }] },
  { id: "stone", swatch: "#c9b28c", name: { en: "Natural stone", ar: "الحجر الطبيعي" }, tagline: { en: "Time you can touch", ar: "زمن يمكن لمسه" },
    text: { en: "Quarried near the site wherever possible. Limestone and sandstone store heat by day, release it by night, and gain character as they weather.", ar: "من محاجر قريبة من الموقع حيثما أمكن. يخزّن الحجر الجيري والرملي الحرارة نهاراً ويطلقها ليلاً ويكتسب طابعاً مع التعرّض للعوامل." },
    image: "/images/materials/stone.jpg", used: ["the-courtyard", "form-and-light", "desert-frame"],
    specs: [{ label: { en: "Compressive strength", ar: "مقاومة الضغط" }, value: "20–120 MPa", pct: 72 }, { label: { en: "Thermal mass", ar: "الكتلة الحرارية" }, value: "2,200 kg/m³", pct: 88 }, { label: { en: "Design life", ar: "العمر التصميمي" }, value: "200+ yrs", pct: 100 }, { label: { en: "Embodied carbon", ar: "الكربون المتجسّد" }, value: "Low–mid", pct: 36 }] },
  { id: "timber", swatch: "#a8764a", name: { en: "Timber", ar: "الخشب" }, tagline: { en: "Warmth and carbon storage", ar: "دفء وتخزين للكربون" },
    text: { en: "Cedar, oak and teak — chosen for stability, scent and the way a hand reads them. Timber stores carbon while it stands and is the studio's preferred interior skin.", ar: "الأرز والبلوط والساج، تُختار لثباتها ورائحتها وللطريقة التي تقرؤها بها اليد. يخزّن الخشب الكربون ما دام قائماً وهو الجلد الداخلي المفضّل لدينا." },
    image: "/images/materials/timber.jpg", used: ["the-silent-house", "the-courtyard", "desert-frame"],
    specs: [{ label: { en: "Compressive strength", ar: "مقاومة الضغط" }, value: "30–50 MPa", pct: 55 }, { label: { en: "Thermal mass", ar: "الكتلة الحرارية" }, value: "500–700 kg/m³", pct: 30 }, { label: { en: "Design life", ar: "العمر التصميمي" }, value: "60–150 yrs", pct: 65 }, { label: { en: "Embodied carbon", ar: "الكربون المتجسّد" }, value: "Negative*", pct: 10 }] },
  { id: "glass", swatch: "#9fb7b0", name: { en: "Glass", ar: "الزجاج" }, tagline: { en: "The absence of a wall", ar: "غياب الجدار" },
    text: { en: "Used sparingly, in large panes, and always paired with shade. Low-iron glass for clarity, smoked glass where privacy and glare control are needed.", ar: "يُستخدم باعتدال وبألواح كبيرة ومقترناً دائماً بالتظليل. زجاج منخفض الحديد للصفاء، ومدخَّن حيث تلزم الخصوصية وضبط الوهج." },
    image: "/images/materials/glass.jpg", used: ["the-silent-house", "concrete-horizon", "form-and-light"],
    specs: [{ label: { en: "Light transmission", ar: "نفاذية الضوء" }, value: "60–91 %", pct: 85 }, { label: { en: "U-value (triple)", ar: "معامل U (ثلاثي)" }, value: "0.6 W/m²K", pct: 80 }, { label: { en: "Design life", ar: "العمر التصميمي" }, value: "40–60 yrs", pct: 50 }, { label: { en: "Embodied carbon", ar: "الكربون المتجسّد" }, value: "Mid–high", pct: 60 }] },
  { id: "metal", swatch: "#6c665c", name: { en: "Metal", ar: "المعدن" }, tagline: { en: "Precision and patina", ar: "دقة وصدأ نبيل" },
    text: { en: "Bronze, weathering steel and aluminium bronze for edges, thresholds and the details that must be exact. Metal is where craft meets machine.", ar: "البرونز والفولاذ المقاوم للتآكل وبرونز الألومنيوم للحواف والعتبات والتفاصيل التي يجب أن تكون دقيقة. المعدن حيث تلتقي الحِرفة بالآلة." },
    image: "/images/materials/metal.jpg", used: ["form-and-light", "the-observatory", "desert-frame"],
    specs: [{ label: { en: "Tensile strength", ar: "مقاومة الشد" }, value: "350–600 MPa", pct: 90 }, { label: { en: "Thermal conductivity", ar: "التوصيل الحراري" }, value: "Very high", pct: 95 }, { label: { en: "Design life", ar: "العمر التصميمي" }, value: "80+ yrs", pct: 82 }, { label: { en: "Recyclability", ar: "قابلية التدوير" }, value: "~95 %", pct: 95 }] },
];
