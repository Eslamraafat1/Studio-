import type { L, LA } from "@/lib/i18n";

export type Category = "residential" | "cultural" | "commercial" | "hospitality";

export interface Room { id: string; d: string; name: L; fn: L; area: string; lx: number; ly: number }
export interface Spec { label: L; value: L }
export interface GalleryImage { src: string; w: number; h: number; alt: L; caption: L }
export interface Project {
  slug: string; no: string; name: L; location: L; city: string; year: string; category: Category;
  categoryLabel: L; blurb: L; concept: L; challenge: L; response: L; materials: { name: L; note: L }[];
  specs: Spec[]; images: GalleryImage[]; plan: { rooms: Room[]; title: L; scale: string };
  layout: "full" | "tall" | "split-a" | "split-b" | "offset" | "wide";
  /** gallery index used for portrait ( "tall" ) cards */
  tallIndex?: number;
  seo: L; accent: string;
}

const R = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}z`;
const img = (slug: string, n: number, portrait: boolean, alt: L, caption: L): GalleryImage => ({
  src: `/images/projects/${slug}-${n}.jpg`, w: portrait ? 1500 : 2400, h: portrait ? 2000 : 1350, alt, caption,
});
const catLabel: Record<Category, L> = {
  residential: { en: "Residential", ar: "سكني" }, cultural: { en: "Cultural", ar: "ثقافي" },
  commercial: { en: "Commercial", ar: "تجاري" }, hospitality: { en: "Hospitality", ar: "ضيافة" },
};
export const categories = Object.entries(catLabel).map(([id, label]) => ({ id: id as Category, label }));

export const projects: Project[] = [
  {
    slug: "the-silent-house", no: "01", name: { en: "THE SILENT HOUSE", ar: "البيت الصامت" },
    location: { en: "Kyoto, Japan", ar: "كيوتو، اليابان" }, city: "Kyoto", year: "2024", category: "residential", categoryLabel: catLabel.residential,
    layout: "full", accent: "#505A49",
    blurb: { en: "A single-storey house beneath one concrete roof, where light is filtered through timber and silence is the programme.", ar: "بيت من طابق واحد تحت سقف خرساني واحد، يُرشَّح فيه الضوء عبر الخشب ويصبح الصمت هو البرنامج." },
    concept: { en: "Kyoto's machiya taught us that a house is a sequence of thresholds. The Silent House reduces that sequence to three: a gravel court, a timber veranda and a room that opens entirely to the garden. A single board-marked concrete roof hovers over all of it.", ar: "علّمتنا بيوت «ماتشيا» في كيوتو أن البيت سلسلة من العتبات. يختزل البيت الصامت هذه السلسلة إلى ثلاث: فناء حصوي، وشرفة خشبية، وغرفة تنفتح كلياً على الحديقة. ويحوم فوقها جميعاً سقف واحد من الخرسانة المشكَّلة بالألواح." },
    challenge: { en: "A narrow 410 m² plot in a protected historic district, a 4.2 m height limit, and neighbours three metres away on both sides. The clients, a retired calligrapher and a cellist, asked for a house that would not disturb either practice.", ar: "قطعة أرض ضيقة بمساحة ٤١٠ م² في حيّ تاريخي محمي، وحدّ ارتفاع ٤٫٢ م، وجيران على بعد ثلاثة أمتار من الجانبين. طلب العميلان، خطّاط متقاعد وعازفة تشيلو، بيتاً لا يزعج أيّاً من ممارستيهما." },
    response: { en: "We buried acoustic mass in the concrete core to the west and screened the south façade with 46 cedar fins at 180 mm centres. The fins cut glare, hide the interior from the street and turn the veranda into a slow-moving drawing of shadow.", ar: "دفنّا الكتلة الصوتية في النواة الخرسانية غرباً، وحجبنا الواجهة الجنوبية بـ٤٦ زعنفة من خشب الأرز على محاور ١٨٠ مم. تقطع الزعانف الوهج وتُخفي الداخل عن الشارع وتحوّل الشرفة إلى رسمٍ بطيء من الظلال." },
    materials: [
      { name: { en: "Board-marked concrete", ar: "خرسانة بآثار الألواح" }, note: { en: "Roof and acoustic core, cast in Hinoki formwork", ar: "السقف والنواة الصوتية، صُبّت في قوالب خشب هينوكي" } },
      { name: { en: "Kiso cedar", ar: "أرز كيسو" }, note: { en: "Fins, veranda and soffit", ar: "الزعانف والشرفة وباطن السقف" } },
      { name: { en: "River stone", ar: "حجر نهري" }, note: { en: "Stepping stones, hand-set", ar: "حجارة العبور، مثبّتة يدوياً" } },
      { name: { en: "Frameless glass", ar: "زجاج بلا إطار" }, note: { en: "South wall, 3.4 m panes", ar: "الجدار الجنوبي، ألواح بارتفاع ٣٫٤ م" } },
    ],
    specs: [
      { label: { en: "Gross area", ar: "المساحة الإجمالية" }, value: { en: "312 m²", ar: "٣١٢ م²" } },
      { label: { en: "Site", ar: "الأرض" }, value: { en: "410 m²", ar: "٤١٠ م²" } },
      { label: { en: "Structure", ar: "الإنشاء" }, value: { en: "In-situ RC + glulam", ar: "خرسانة مسلحة + خشب لامينا" } },
      { label: { en: "Height", ar: "الارتفاع" }, value: { en: "4.2 m", ar: "٤٫٢ م" } },
      { label: { en: "Energy", ar: "الطاقة" }, value: { en: "ZEH-Oriented", ar: "موجّه لصفر طاقة" } },
      { label: { en: "Status", ar: "الحالة" }, value: { en: "Completed 2024", ar: "اكتمل ٢٠٢٤" } },
    ],
    images: [
      img("the-silent-house", 1, false, { en: "Long concrete roof over a timber-screened veranda", ar: "سقف خرساني طويل فوق شرفة خشبية محجوبة بالزعانف" }, { en: "The south façade at dusk — roof, fins, veranda.", ar: "الواجهة الجنوبية عند الغروب — السقف والزعانف والشرفة." }),
      img("the-silent-house", 2, false, { en: "Side view of the house with stepping stones", ar: "منظر جانبي للبيت مع حجارة العبور" }, { en: "Stepping stones lead from the gravel court to the veranda.", ar: "تقود حجارة العبور من الفناء الحصوي إلى الشرفة." }),
      img("the-silent-house", 3, true, { en: "Portrait view of the cedar fin screen", ar: "منظر رأسي لحاجب الزعانف الخشبية" }, { en: "Cedar fins at 180 mm centres filter the afternoon sun.", ar: "زعانف الأرز على محاور ١٨٠ مم ترشّح شمس العصر." }),
      img("the-silent-house", 4, false, { en: "Detail of the roof edge and timber soffit", ar: "تفصيل لحافة السقف وباطنه الخشبي" }, { en: "Roof edge: 380 mm of concrete over a cedar soffit.", ar: "حافة السقف: ٣٨٠ مم خرسانة فوق باطن من الأرز." }),
    ],
    plan: { title: { en: "Ground floor — 1:200", ar: "الطابق الأرضي — ١:٢٠٠" }, scale: "1:200", rooms: [
      { id: "core", d: R(20, 40, 90, 180), name: { en: "Acoustic core", ar: "النواة الصوتية" }, fn: { en: "Cello studio and calligraphy room, double-walled", ar: "استوديو التشيلو وغرفة الخط، بجدار مزدوج" }, area: "58 m²", lx: 65, ly: 130 },
      { id: "living", d: R(110, 70, 190, 120), name: { en: "Living room", ar: "غرفة المعيشة" }, fn: { en: "Open to the garden along its full width", ar: "مفتوحة على الحديقة بعرضها كاملاً" }, area: "96 m²", lx: 205, ly: 130 },
      { id: "kitchen", d: R(300, 70, 80, 70), name: { en: "Kitchen", ar: "المطبخ" }, fn: { en: "Timber-lined, with a stone counter", ar: "مكسوّ بالخشب مع سطح حجري" }, area: "24 m²", lx: 340, ly: 105 },
      { id: "bed", d: R(300, 140, 80, 80), name: { en: "Bedroom", ar: "غرفة النوم" }, fn: { en: "Single window framing a maple", ar: "نافذة واحدة تؤطّر شجرة قيقب" }, area: "26 m²", lx: 340, ly: 180 },
      { id: "veranda", d: R(110, 190, 190, 40), name: { en: "Veranda", ar: "الشرفة" }, fn: { en: "Behind the cedar fin screen", ar: "خلف حاجب زعانف الأرز" }, area: "34 m²", lx: 205, ly: 212 },
      { id: "bath", d: R(110, 40, 190, 30), name: { en: "Bath & service", ar: "الحمّام والخدمات" }, fn: { en: "Stone bath, utilities", ar: "حمام حجري ومرافق" }, area: "18 m²", lx: 205, ly: 57 },
    ] },
    seo: { en: "A single-storey concrete and cedar house in Kyoto by MONOLITH®.", ar: "بيت من الخرسانة وخشب الأرز في كيوتو من «مونوليث®»." },
  },
  {
    slug: "concrete-horizon", no: "02", name: { en: "CONCRETE HORIZON", ar: "أفق الخرسانة" },
    location: { en: "Copenhagen, Denmark", ar: "كوبنهاغن، الدنمارك" }, city: "Copenhagen", year: "2023", category: "cultural", categoryLabel: catLabel.cultural,
    layout: "tall", tallIndex: 3, accent: "#7a7f7c",
    blurb: { en: "A 84-metre concrete bar cantilevered over the harbour, holding a gallery, a library and a public ramp to the water.", ar: "كتلة خرسانية بطول ٨٤ متراً تتدلّى فوق الميناء، تضم معرضاً ومكتبة ومنحدراً عاماً نحو الماء." },
    concept: { en: "The harbour is Copenhagen's living room. We drew a building that behaves like a pier: long, low, and generous at its edges. Two concrete slabs frame a single glazed band, so the city reads the horizon through the building.", ar: "الميناء هو غرفة معيشة كوبنهاغن. رسمنا مبنى يتصرّف كرصيف: طويل ومنخفض وسخيّ عند أطرافه. بلاطتان خرسانيتان تؤطّران شريطاً زجاجياً واحداً، فتقرأ المدينة الأفق عبر المبنى." },
    challenge: { en: "A former shipping quay with 1970s bearing limits, a flood design level of +2.4 m, and a brief for 3,200 m² of column-free gallery space.", ar: "رصيف شحن سابق بحدود تحمّل من السبعينيات، ومنسوب فيضان تصميمي +٢٫٤ م، وبرنامج يطلب ٣٢٠٠ م² من قاعات العرض بلا أعمدة." },
    response: { en: "The building lands only at its two ends; between them 41 m post-tensioned slabs span the void. The ground is left open as a covered public promenade, and a 1:20 ramp lets visitors walk from the quay to the roof without a lift.", ar: "يلامس المبنى الأرض عند طرفيه فقط؛ وبينهما بلاطات مسبقة الإجهاد بامتداد ٤١ م. تُركت الأرض مفتوحة كممشى عام مغطّى، ويتيح منحدر ١:٢٠ الصعود من الرصيف إلى السطح بلا مصعد." },
    materials: [
      { name: { en: "Post-tensioned concrete", ar: "خرسانة مسبقة الإجهاد" }, note: { en: "Slabs and core", ar: "البلاطات والنواة" } },
      { name: { en: "Low-iron glass", ar: "زجاج منخفض الحديد" }, note: { en: "4.8 m continuous band", ar: "شريط متصل بارتفاع ٤٫٨ م" } },
      { name: { en: "Oiled oak", ar: "بلوط مزيّت" }, note: { en: "Gallery floors and library", ar: "أرضيات القاعات والمكتبة" } },
      { name: { en: "Granite setts", ar: "حجر غرانيت" }, note: { en: "Promenade paving", ar: "رصف الممشى" } },
    ],
    specs: [
      { label: { en: "Gross area", ar: "المساحة الإجمالية" }, value: { en: "9,400 m²", ar: "٩٤٠٠ م²" } },
      { label: { en: "Length", ar: "الطول" }, value: { en: "84 m", ar: "٨٤ م" } },
      { label: { en: "Max span", ar: "أقصى بحر" }, value: { en: "41 m", ar: "٤١ م" } },
      { label: { en: "Structure", ar: "الإنشاء" }, value: { en: "Post-tensioned RC", ar: "خرسانة مسبقة الإجهاد" } },
      { label: { en: "Flood level", ar: "منسوب الفيضان" }, value: { en: "+2.4 m", ar: "+٢٫٤ م" } },
      { label: { en: "Status", ar: "الحالة" }, value: { en: "Completed 2023", ar: "اكتمل ٢٠٢٣" } },
    ],
    images: [
      img("concrete-horizon", 1, false, { en: "The concrete bar cantilevering over the harbour", ar: "الكتلة الخرسانية متدلية فوق الميناء" }, { en: "From the water: two slabs, one glazed band.", ar: "من الماء: بلاطتان وشريط زجاجي واحد." }),
      img("concrete-horizon", 2, false, { en: "Gallery glazing with concrete fins", ar: "واجهة القاعات الزجاجية مع الزعانف الخرسانية" }, { en: "Concrete fins at 3 m centres temper the harbour light.", ar: "زعانف خرسانية على محاور ٣ م تلطّف ضوء الميناء." }),
      img("concrete-horizon", 3, true, { en: "Portrait view of the harbour ramp and bar", ar: "منظر رأسي للمنحدر والكتلة" }, { en: "The public ramp rises from the quay to the roof terrace.", ar: "يرتفع المنحدر العام من الرصيف إلى مدرّج السطح." }),
      img("concrete-horizon", 4, false, { en: "Plinth and quay seen from above", ar: "القاعدة والرصيف من أعلى" }, { en: "The plinth anchors the bar against the quay.", ar: "تثبّت القاعدة الكتلة على الرصيف." }),
    ],
    plan: { title: { en: "Level 1 — 1:500", ar: "المستوى ١ — ١:٥٠٠" }, scale: "1:500", rooms: [
      { id: "foyer", d: R(10, 90, 70, 80), name: { en: "Foyer & ticketing", ar: "البهو والتذاكر" }, fn: { en: "Double-height entrance from the ramp", ar: "مدخل مزدوج الارتفاع من المنحدر" }, area: "420 m²", lx: 45, ly: 132 },
      { id: "gal1", d: R(80, 90, 120, 80), name: { en: "Gallery I", ar: "القاعة الأولى" }, fn: { en: "Column-free, 41 m span", ar: "بلا أعمدة، بحر ٤١ م" }, area: "1,640 m²", lx: 140, ly: 132 },
      { id: "gal2", d: R(200, 90, 110, 80), name: { en: "Gallery II", ar: "القاعة الثانية" }, fn: { en: "Daylit, north-facing", ar: "مضاءة طبيعياً، شمالية" }, area: "1,200 m²", lx: 255, ly: 132 },
      { id: "lib", d: R(310, 90, 80, 80), name: { en: "Library", ar: "المكتبة" }, fn: { en: "Reading room with harbour view", ar: "قاعة قراءة تطل على الميناء" }, area: "480 m²", lx: 350, ly: 132 },
      { id: "cafe", d: R(80, 170, 120, 30), name: { en: "Café terrace", ar: "مقهى" }, fn: { en: "Cantilevered over the water", ar: "متدلٍّ فوق الماء" }, area: "180 m²", lx: 140, ly: 189 },
      { id: "ramp", d: R(320, 40, 40, 50), name: { en: "Public ramp", ar: "المنحدر العام" }, fn: { en: "1:20, step-free to the roof", ar: "١:٢٠، بلا درجات حتى السطح" }, area: "—", lx: 340, ly: 68 },
    ] },
    seo: { en: "A cantilevered concrete cultural building on Copenhagen harbour.", ar: "مبنى ثقافي خرساني متدلٍّ فوق ميناء كوبنهاغن." },
  },
  {
    slug: "the-courtyard", no: "03", name: { en: "THE COURTYARD", ar: "الفناء" },
    location: { en: "Cairo, Egypt", ar: "القاهرة، مصر" }, city: "Cairo", year: "2022", category: "residential", categoryLabel: catLabel.residential,
    layout: "split-a", accent: "#A66D4E",
    blurb: { en: "A walled family compound organised around a shaded pool courtyard, cooled by mashrabiya and the movement of air.", ar: "مجمّع عائلي مسوّر ينتظم حول فناء ظليل بمسبح، تبرّده المشربيات وحركة الهواء." },
    concept: { en: "The courtyard house is the oldest climate machine in Cairo. We recalibrated it for three generations living together: shared water at the centre, private galleries on the edge, and a roof for the evening.", ar: "بيت الفناء هو أقدم آلة مناخية في القاهرة. أعدنا ضبطه لثلاثة أجيال تعيش معاً: ماء مشترك في المركز، ورواقات خاصة على الأطراف، وسطح للمساء." },
    challenge: { en: "Summer peaks of 41 °C, a dense Zamalek street frontage and no air-conditioning budget for communal spaces.", ar: "ذروة صيفية تبلغ ٤١ درجة مئوية، وواجهة شارع كثيفة في الزمالك، وبلا ميزانية تكييف للمساحات المشتركة." },
    response: { en: "A thermal-mass limestone envelope, 82 handmade timber mashrabiya panels, and a stack-effect wind tower over the pool pull air through the compound. Measured courtyard temperature stays 9 °C below the street at 15:00.", ar: "غلاف من الحجر الجيري عالي الكتلة الحرارية، و٨٢ لوحة مشربية خشبية مصنوعة يدوياً، وبرج رياح فوق المسبح يسحب الهواء عبر المجمّع. تبقى حرارة الفناء المقيسة أقل من الشارع بـ٩ درجات عند الثالثة عصراً." },
    materials: [
      { name: { en: "Mokattam limestone", ar: "حجر المقطم الجيري" }, note: { en: "Walls and paving, quarried 30 km away", ar: "الجدران والرصف، من محجر يبعد ٣٠ كم" } },
      { name: { en: "Mashrabiya in teak", ar: "مشربية من خشب الساج" }, note: { en: "Turned and assembled by hand in Cairo", ar: "خرط وتجميع يدوي في القاهرة" } },
      { name: { en: "Lime plaster", ar: "بياض جيري" }, note: { en: "Breathable interior finishes", ar: "تشطيبات داخلية قابلة للتنفس" } },
      { name: { en: "Still water", ar: "ماء ساكن" }, note: { en: "Evaporative cooling and reflected light", ar: "تبريد تبخّري وضوء منعكس" } },
    ],
    specs: [
      { label: { en: "Gross area", ar: "المساحة الإجمالية" }, value: { en: "1,860 m²", ar: "١٨٦٠ م²" } },
      { label: { en: "Courtyard", ar: "الفناء" }, value: { en: "14 × 14 m", ar: "١٤ × ١٤ م" } },
      { label: { en: "Panels", ar: "اللوحات" }, value: { en: "82 mashrabiya", ar: "٨٢ مشربية" } },
      { label: { en: "Cooling", ar: "التبريد" }, value: { en: "Passive, −9 °C", ar: "سلبي، −٩ °م" } },
      { label: { en: "Structure", ar: "الإنشاء" }, value: { en: "Load-bearing stone", ar: "حجر حامل" } },
      { label: { en: "Status", ar: "الحالة" }, value: { en: "Completed 2022", ar: "اكتمل ٢٠٢٢" } },
    ],
    images: [
      img("the-courtyard", 1, false, { en: "Courtyard with pool and timber galleries", ar: "فناء به مسبح ورواقات خشبية" }, { en: "The pool courtyard from the south gallery.", ar: "فناء المسبح من الرواق الجنوبي." }),
      img("the-courtyard", 2, false, { en: "Mashrabiya screens across the far wall", ar: "المشربيات على الجدار البعيد" }, { en: "Mashrabiya panels filter light and let air through.", ar: "تُرشّح المشربيات الضوء وتسمح بمرور الهواء." }),
      img("the-courtyard", 3, true, { en: "Portrait view of the shaded gallery", ar: "منظر رأسي للرواق الظليل" }, { en: "Two-storey gallery — stone below, timber above.", ar: "رواق من طابقين — حجر في الأسفل وخشب في الأعلى." }),
      img("the-courtyard", 4, false, { en: "The compound from outside the walls", ar: "المجمّع من خارج الأسوار" }, { en: "From the street: a quiet limestone wall, nothing more.", ar: "من الشارع: جدار حجري هادئ، لا أكثر." }),
    ],
    plan: { title: { en: "Ground floor — 1:250", ar: "الطابق الأرضي — ١:٢٥٠" }, scale: "1:250", rooms: [
      { id: "court", d: R(130, 70, 140, 120), name: { en: "Courtyard & pool", ar: "الفناء والمسبح" }, fn: { en: "Shared water garden, open to the sky", ar: "حديقة مائية مشتركة مفتوحة للسماء" }, area: "196 m²", lx: 200, ly: 130 },
      { id: "n", d: R(40, 20, 320, 50), name: { en: "North wing — elders", ar: "الجناح الشمالي — الكبار" }, fn: { en: "Grandparents' suite and majlis", ar: "جناح الأجداد والمجلس" }, area: "310 m²", lx: 200, ly: 48 },
      { id: "s", d: R(40, 190, 320, 50), name: { en: "South wing — kitchen", ar: "الجناح الجنوبي — المطبخ" }, fn: { en: "Kitchen, dining, service", ar: "مطبخ وطعام وخدمات" }, area: "290 m²", lx: 200, ly: 218 },
      { id: "w", d: R(40, 70, 90, 120), name: { en: "West wing — family", ar: "الجناح الغربي — الأسرة" }, fn: { en: "Bedrooms for the middle generation", ar: "غرف نوم الجيل الأوسط" }, area: "260 m²", lx: 85, ly: 130 },
      { id: "e", d: R(270, 70, 90, 120), name: { en: "East wing — guests", ar: "الجناح الشرقي — الضيوف" }, fn: { en: "Guest rooms with private entrance", ar: "غرف الضيوف بمدخل خاص" }, area: "240 m²", lx: 315, ly: 130 },
    ] },
    seo: { en: "A passively cooled courtyard compound in Cairo.", ar: "مجمّع فناء مبرَّد سلبياً في القاهرة." },
  },
  {
    slug: "form-and-light", no: "04", name: { en: "FORM & LIGHT", ar: "الشكل والضوء" },
    location: { en: "Milan, Italy", ar: "ميلانو، إيطاليا" }, city: "Milan", year: "2024", category: "commercial", categoryLabel: catLabel.commercial,
    layout: "offset", accent: "#8b7a5a",
    blurb: { en: "A stacked 36-metre office building whose stone and bronze fins turn the Lombard sun into a daily choreography.", ar: "مبنى مكاتب مكدَّس بارتفاع ٣٦ متراً، تحوّل زعانفه الحجرية والبرونزية شمس لومبارديا إلى رقصة يومية." },
    concept: { en: "Three volumes — a dark base, a stone shaft and a floating crown — each answer a different question about the street, the workplace and the sky. The fins make the building a sundial.", ar: "ثلاث كتل — قاعدة داكنة وجذع حجري وتاج عائم — تجيب كلٌّ عن سؤال مختلف: الشارع ومكان العمل والسماء. وتجعل الزعانف المبنى مزولة شمسية." },
    challenge: { en: "A 22 × 24 m infill plot, a 7:1 plot-ratio, and an anchor tenant who wanted ‘a calm building in a loud city’.", ar: "قطعة أرض بينية ٢٢ × ٢٤ م، ونسبة بناء ٧:١، ومستأجر رئيسي أراد «مبنى هادئاً في مدينة صاخبة»." },
    response: { en: "Fin depth varies by orientation — 750 mm on the west, 450 mm on the south — cutting cooling load by 31 %. The crown cantilevers 6 m over the plaza, creating a covered public room at ground level.", ar: "يتغير عمق الزعانف بحسب الاتجاه — ٧٥٠ مم غرباً و٤٥٠ مم جنوباً — فتخفض حمل التبريد ٣١٪. ويتدلّى التاج ٦ م فوق الساحة ليصنع غرفة عامة مغطّاة عند مستوى الأرض." },
    materials: [
      { name: { en: "Pietra Serena stone", ar: "حجر بيترا سيرينا" }, note: { en: "Shaft cladding and fins", ar: "كسوة الجذع والزعانف" } },
      { name: { en: "Blackened bronze", ar: "برونز مسوَّد" }, note: { en: "Base and crown fins", ar: "زعانف القاعدة والتاج" } },
      { name: { en: "Smoked glass", ar: "زجاج مدخَّن" }, note: { en: "Curtain wall behind fins", ar: "الواجهة الزجاجية خلف الزعانف" } },
      { name: { en: "Polished concrete", ar: "خرسانة مصقولة" }, note: { en: "Plaza and lobby", ar: "الساحة والبهو" } },
    ],
    specs: [
      { label: { en: "Gross area", ar: "المساحة الإجمالية" }, value: { en: "14,800 m²", ar: "١٤٨٠٠ م²" } },
      { label: { en: "Height", ar: "الارتفاع" }, value: { en: "36 m / 9 floors", ar: "٣٦ م / ٩ طوابق" } },
      { label: { en: "Fins", ar: "الزعانف" }, value: { en: "1,240 units", ar: "١٢٤٠ وحدة" } },
      { label: { en: "Cooling saving", ar: "توفير التبريد" }, value: { en: "31 %", ar: "٣١٪" } },
      { label: { en: "Certification", ar: "الشهادة" }, value: { en: "LEED Gold", ar: "ليد ذهبي" } },
      { label: { en: "Status", ar: "الحالة" }, value: { en: "Completed 2024", ar: "اكتمل ٢٠٢٤" } },
    ],
    images: [
      img("form-and-light", 1, false, { en: "Stacked office volumes with vertical fins", ar: "كتل مكاتب متراكبة بزعانف رأسية" }, { en: "Base, shaft and crown at golden hour.", ar: "القاعدة والجذع والتاج عند الساعة الذهبية." }),
      img("form-and-light", 2, false, { en: "Fin detail from the plaza", ar: "تفصيل الزعانف من الساحة" }, { en: "Fin depth changes with orientation.", ar: "يتغير عمق الزعانف مع الاتجاه." }),
      img("form-and-light", 3, true, { en: "Looking up the stone shaft", ar: "النظر إلى أعلى الجذع الحجري" }, { en: "The shaft, 22 metres of stone and shadow.", ar: "الجذع: ٢٢ متراً من الحجر والظل." }),
      img("form-and-light", 4, false, { en: "The crown cantilever from above", ar: "تدلّي التاج من أعلى" }, { en: "The crown cantilevers 6 m over the plaza.", ar: "يتدلّى التاج ٦ م فوق الساحة." }),
    ],
    plan: { title: { en: "Typical floor L4–L7 — 1:200", ar: "طابق نموذجي ٤–٧ — ١:٢٠٠" }, scale: "1:200", rooms: [
      { id: "core", d: R(150, 90, 100, 80), name: { en: "Core", ar: "النواة" }, fn: { en: "Lifts, stairs, risers", ar: "مصاعد ودرج ومجاري" }, area: "64 m²", lx: 200, ly: 130 },
      { id: "open", d: R(40, 30, 320, 60), name: { en: "North floorplate", ar: "المسطّح الشمالي" }, fn: { en: "Open workspace, 3.6 m ceiling", ar: "مساحة عمل مفتوحة بسقف ٣٫٦ م" }, area: "168 m²", lx: 200, ly: 62 },
      { id: "south", d: R(40, 170, 320, 60), name: { en: "South floorplate", ar: "المسطّح الجنوبي" }, fn: { en: "Behind 450 mm fins", ar: "خلف زعانف ٤٥٠ مم" }, area: "168 m²", lx: 200, ly: 202 },
      { id: "w", d: R(40, 90, 110, 80), name: { en: "West meeting zone", ar: "منطقة الاجتماعات الغربية" }, fn: { en: "Meeting rooms behind 750 mm fins", ar: "غرف اجتماعات خلف زعانف ٧٥٠ مم" }, area: "88 m²", lx: 95, ly: 132 },
      { id: "e", d: R(250, 90, 110, 80), name: { en: "East terrace room", ar: "غرفة الشرفة الشرقية" }, fn: { en: "Informal room with morning sun", ar: "غرفة غير رسمية بشمس الصباح" }, area: "88 m²", lx: 305, ly: 132 },
    ] },
    seo: { en: "A nine-storey stone and bronze office building in Milan.", ar: "مبنى مكاتب من الحجر والبرونز في ميلانو." },
  },
  {
    slug: "desert-frame", no: "05", name: { en: "DESERT FRAME", ar: "إطار الصحراء" },
    location: { en: "AlUla, Saudi Arabia", ar: "العُلا، السعودية" }, city: "AlUla", year: "2025", category: "hospitality", categoryLabel: catLabel.hospitality,
    layout: "wide", accent: "#b98a5a",
    blurb: { en: "Seven monumental sandstone frames lead guests across a reflecting channel into a low desert retreat.", ar: "سبعة إطارات حجرية ضخمة تقود الضيوف عبر قناة عاكسة إلى منتجع صحراوي منخفض." },
    concept: { en: "In a landscape of colossal cliffs, a building should not compete with the horizon — it should frame it. Each portal narrows the view and deepens it, so arrival is a slow, rehearsed approach to the mesa.", ar: "في منظر من الجروف العملاقة لا ينبغي للمبنى أن ينافس الأفق، بل أن يؤطّره. يضيّق كل بوّابة المشهد ويعمّقه، فيصبح الوصول اقتراباً بطيئاً مُتقناً نحو الهضبة." },
    challenge: { en: "Fifty-degree summers, protected rock-art within 2 km, and a client mandate for zero permanent scarring of the site.", ar: "صيف يبلغ خمسين درجة، ورسوم صخرية محمية على بعد ٢ كم، وتكليف من العميل بألا يترك المشروع ندباً دائمة في الموقع." },
    response: { en: "Frames are built from rammed local sandstone aggregate on shallow footings that can be removed. The reflecting channel cools the approach by evaporation; the 26 suites sit behind the last frame, half-buried and invisible from the road.", ar: "تُبنى الإطارات من ركام الحجر الرملي المحلي المدكوك على أساسات ضحلة قابلة للإزالة. تبرّد القناة العاكسة الممرّ بالتبخّر، وتقع الأجنحة الـ٢٦ خلف الإطار الأخير نصف مدفونة وغير مرئية من الطريق." },
    materials: [
      { name: { en: "Rammed sandstone", ar: "حجر رملي مدكوك" }, note: { en: "Frames and suite walls, site-won aggregate", ar: "الإطارات وجدران الأجنحة، من ركام الموقع" } },
      { name: { en: "Reflecting water", ar: "ماء عاكس" }, note: { en: "Channel, evaporative cooling", ar: "القناة، تبريد تبخّري" } },
      { name: { en: "Palm-timber", ar: "خشب النخيل" }, note: { en: "Roof battens and doors", ar: "عوارض السقف والأبواب" } },
      { name: { en: "Weathered steel", ar: "فولاذ مقاوم للتآكل" }, note: { en: "Thresholds and lighting", ar: "العتبات والإضاءة" } },
    ],
    specs: [
      { label: { en: "Gross area", ar: "المساحة الإجمالية" }, value: { en: "6,200 m²", ar: "٦٢٠٠ م²" } },
      { label: { en: "Suites", ar: "الأجنحة" }, value: { en: "26", ar: "٢٦" } },
      { label: { en: "Frames", ar: "الإطارات" }, value: { en: "7 × 12 m", ar: "٧ × ١٢ م" } },
      { label: { en: "Footprint", ar: "البصمة" }, value: { en: "Fully reversible", ar: "قابلة للإزالة كلياً" } },
      { label: { en: "Climate", ar: "المناخ" }, value: { en: "Hyper-arid", ar: "شديد الجفاف" } },
      { label: { en: "Status", ar: "الحالة" }, value: { en: "Opens 2025", ar: "يُفتتح ٢٠٢٥" } },
    ],
    images: [
      img("desert-frame", 1, false, { en: "Seven sandstone frames receding into the desert", ar: "سبعة إطارات حجرية تتراجع نحو الصحراء" }, { en: "The processional axis: seven frames and a mirror of water.", ar: "المحور الاحتفالي: سبعة إطارات ومرآة من الماء." }),
      img("desert-frame", 2, false, { en: "The frames seen from the dunes at sunset", ar: "الإطارات من الكثبان عند الغروب" }, { en: "At sunset the frames glow, then disappear.", ar: "عند الغروب تتوهج الإطارات ثم تختفي." }),
      img("desert-frame", 3, true, { en: "A single portal frame against the sky", ar: "بوّابة منفردة في مواجهة السماء" }, { en: "Each portal is 12 m high and 4.4 m deep.", ar: "ارتفاع كل بوّابة ١٢ م وعمقها ٤٫٤ م." }),
      img("desert-frame", 4, false, { en: "Aerial approach toward the suites", ar: "الاقتراب من الأجنحة من أعلى" }, { en: "The approach narrows toward the half-buried suites.", ar: "يضيق الممر نحو الأجنحة نصف المدفونة." }),
    ],
    plan: { title: { en: "Site plan — 1:1000", ar: "مسقط الموقع — ١:١٠٠٠" }, scale: "1:1000", rooms: [
      { id: "frames", d: R(20, 105, 190, 50), name: { en: "The seven frames", ar: "الإطارات السبعة" }, fn: { en: "Processional axis over the reflecting channel", ar: "المحور الاحتفالي فوق القناة العاكسة" }, area: "—", lx: 115, ly: 134 },
      { id: "lobby", d: R(210, 85, 60, 90), name: { en: "Arrival hall", ar: "بهو الوصول" }, fn: { en: "Reception under a palm-timber roof", ar: "استقبال تحت سقف من خشب النخيل" }, area: "620 m²", lx: 240, ly: 132 },
      { id: "sN", d: R(270, 30, 110, 55), name: { en: "North suites", ar: "الأجنحة الشمالية" }, fn: { en: "13 suites with private plunge pools", ar: "١٣ جناحاً مع أحواض خاصة" }, area: "1,850 m²", lx: 325, ly: 60 },
      { id: "sS", d: R(270, 175, 110, 55), name: { en: "South suites", ar: "الأجنحة الجنوبية" }, fn: { en: "13 suites facing the mesa", ar: "١٣ جناحاً يواجه الهضبة" }, area: "1,850 m²", lx: 325, ly: 205 },
      { id: "dine", d: R(270, 85, 110, 90), name: { en: "Dining & spa", ar: "المطعم والسبا" }, fn: { en: "Rammed-earth pavilion around a fire court", ar: "جناح من الطين المدكوك حول فناء نار" }, area: "1,100 m²", lx: 325, ly: 132 },
    ] },
    seo: { en: "A reversible sandstone desert retreat in AlUla.", ar: "منتجع صحراوي من الحجر الرملي في العُلا." },
  },
  {
    slug: "the-observatory", no: "06", name: { en: "THE OBSERVATORY", ar: "المرصد" },
    location: { en: "Lisbon, Portugal", ar: "لشبونة، البرتغال" }, city: "Lisbon", year: "2023", category: "cultural", categoryLabel: catLabel.cultural,
    layout: "split-b", accent: "#43597e",
    blurb: { en: "A concrete drum and bronzed dome on a Lisbon hilltop, wrapped by a public spiral ramp toward the stars.", ar: "أسطوانة خرسانية وقبّة برونزية على تلّة في لشبونة، يلتفّ حولها منحدر عام حلزوني نحو النجوم." },
    concept: { en: "A public observatory should begin at street level. The ramp winds 1.4 turns around the drum so every visitor — child, telescope enthusiast, wheelchair user — climbs the same path to the same sky.", ar: "ينبغي أن يبدأ المرصد العام من مستوى الشارع. يلتفّ المنحدر ١٫٤ دورة حول الأسطوانة بحيث يصعد كل زائر — طفلاً كان أو هاوياً أو مستخدم كرسي متحرك — المسار نفسه نحو السماء نفسها." },
    challenge: { en: "Light pollution, a 1755-earthquake-informed seismic code, and a mandate that the dome remain operable by volunteers.", ar: "تلوّث ضوئي، ومدوّنة زلزالية مستندة إلى دروس زلزال ١٧٥٥، وشرط أن يبقى تشغيل القبّة ممكناً للمتطوعين." },
    response: { en: "The drum is a 450 mm in-situ concrete cylinder acting as a seismic shear tube. The 9.4 m aluminium-bronze dome rotates on 24 rollers and a 750 W motor. All exterior lighting is amber and shielded, held below the horizon plane.", ar: "الأسطوانة خرسانة مصبوبة في الموقع بسماكة ٤٥٠ مم تعمل كأنبوب قص زلزالي. تدور القبّة من البرونز والألومنيوم بقطر ٩٫٤ م على ٢٤ بكرة ومحرك ٧٥٠ واط. كل الإضاءة الخارجية كهرمانية ومحجوبة تحت مستوى الأفق." },
    materials: [
      { name: { en: "Cast concrete", ar: "خرسانة مصبوبة" }, note: { en: "Drum and ramp", ar: "الأسطوانة والمنحدر" } },
      { name: { en: "Aluminium bronze", ar: "برونز الألومنيوم" }, note: { en: "Dome shell, hand-finished", ar: "غلاف القبّة بتشطيب يدوي" } },
      { name: { en: "Lioz limestone", ar: "حجر ليوز الجيري" }, note: { en: "Plaza, from Sintra quarries", ar: "الساحة، من محاجر سينترا" } },
      { name: { en: "Blackened steel", ar: "فولاذ مسوَّد" }, note: { en: "Balustrade and rail", ar: "الدرابزين والسياج" } },
    ],
    specs: [
      { label: { en: "Height", ar: "الارتفاع" }, value: { en: "25 m", ar: "٢٥ م" } },
      { label: { en: "Dome", ar: "القبّة" }, value: { en: "Ø 9.4 m", ar: "قطر ٩٫٤ م" } },
      { label: { en: "Ramp", ar: "المنحدر" }, value: { en: "1.4 turns · 1:15", ar: "١٫٤ دورة · ١:١٥" } },
      { label: { en: "Telescope", ar: "المقراب" }, value: { en: "0.6 m reflector", ar: "عاكس ٠٫٦ م" } },
      { label: { en: "Structure", ar: "الإنشاء" }, value: { en: "RC shear tube", ar: "أنبوب قص خرساني" } },
      { label: { en: "Status", ar: "الحالة" }, value: { en: "Completed 2023", ar: "اكتمل ٢٠٢٣" } },
    ],
    images: [
      img("the-observatory", 1, false, { en: "Concrete drum with spiral ramp at dusk", ar: "أسطوانة خرسانية ومنحدر حلزوني عند الغروب" }, { en: "The drum and ramp at blue hour.", ar: "الأسطوانة والمنحدر في الساعة الزرقاء." }),
      img("the-observatory", 2, false, { en: "The observatory from the plaza", ar: "المرصد من الساحة" }, { en: "From the plaza: the ramp begins at street level.", ar: "من الساحة: يبدأ المنحدر من مستوى الشارع." }),
      img("the-observatory", 3, true, { en: "Portrait view of the dome and drum", ar: "منظر رأسي للقبّة والأسطوانة" }, { en: "Twelve slit windows pierce the drum.", ar: "اثنتا عشرة نافذة شقّية تخترق الأسطوانة." }),
      img("the-observatory", 4, false, { en: "Elevated view along the spiral ramp", ar: "منظر مرتفع على امتداد المنحدر الحلزوني" }, { en: "Halfway up: the city opens to the south.", ar: "في منتصف الصعود: تنفتح المدينة جنوباً." }),
    ],
    plan: { title: { en: "Level 2 — 1:100", ar: "المستوى ٢ — ١:١٠٠" }, scale: "1:100", rooms: [
      { id: "plaza", d: "M200 130m-110 0a110 110 0 1 0 220 0a110 110 0 1 0 -220 0", name: { en: "Ramp & plaza", ar: "المنحدر والساحة" }, fn: { en: "Public spiral, 3.2 m wide", ar: "حلزون عام بعرض ٣٫٢ م" }, area: "—", lx: 200, ly: 38 },
      { id: "drum", d: "M200 130m-70 0a70 70 0 1 0 140 0a70 70 0 1 0 -140 0", name: { en: "Drum", ar: "الأسطوانة" }, fn: { en: "Exhibition floor beneath the dome", ar: "طابق المعرض تحت القبّة" }, area: "154 m²", lx: 200, ly: 78 },
      { id: "scope", d: "M200 130m-34 0a34 34 0 1 0 68 0a34 34 0 1 0 -68 0", name: { en: "Telescope pier", ar: "قاعدة المقراب" }, fn: { en: "Isolated pier, 0.6 m reflector", ar: "قاعدة معزولة لمقراب ٠٫٦ م" }, area: "36 m²", lx: 200, ly: 134 },
      { id: "lab", d: R(30, 200, 80, 40), name: { en: "Classroom", ar: "قاعة التعليم" }, fn: { en: "School visits, 30 seats", ar: "زيارات المدارس، ٣٠ مقعداً" }, area: "62 m²", lx: 70, ly: 222 },
    ] },
    seo: { en: "A public observatory with a spiral ramp in Lisbon.", ar: "مرصد عام بمنحدر حلزوني في لشبونة." },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectIndex = (slug: string) => projects.findIndex((p) => p.slug === slug);
export const neighbours = (slug: string) => {
  const i = projectIndex(slug);
  return { prev: projects[(i - 1 + projects.length) % projects.length], next: projects[(i + 1) % projects.length] };
};
export const related = (slug: string, n = 3) => {
  const p = getProject(slug)!;
  return [...projects.filter((x) => x.slug !== slug)].sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category)).slice(0, n);
};
export type { LA };
