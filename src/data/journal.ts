import type { L, LA } from "@/lib/i18n";

export type JCat = "materials" | "light" | "sustainability" | "practice";
export interface Article {
  slug: string; title: L; dek: L; category: JCat; date: string; minutes: number; author: string; role: L;
  image: string; imageAlt: L; body: LA; quote: L; featured?: boolean; layout: "wide" | "tall" | "standard";
}
export const jCats: Record<JCat, L> = {
  materials: { en: "Materials", ar: "المواد" }, light: { en: "Light", ar: "الضوء" },
  sustainability: { en: "Sustainability", ar: "الاستدامة" }, practice: { en: "Practice", ar: "الممارسة" },
};

export const articles: Article[] = [
  {
    slug: "the-poetry-of-concrete", featured: true, layout: "wide", category: "materials", date: "2025-03-12", minutes: 7, author: "Ingrid Solheim", role: { en: "Founding Partner", ar: "الشريكة المؤسِّسة" },
    title: { en: "The Poetry of Concrete", ar: "شعرية الخرسانة" },
    dek: { en: "Why a material mocked as cold keeps producing the warmest rooms we know.", ar: "لماذا تواصل مادة يُسخَر منها لبرودتها صناعة أدفأ الغرف التي نعرفها." },
    image: "/images/projects/the-silent-house-4.jpg", imageAlt: { en: "Roof edge of a concrete house over timber", ar: "حافة سقف خرساني فوق الخشب" },
    quote: { en: "Concrete remembers the hand, the board and the weather of the day it was poured.", ar: "تتذكّر الخرسانة اليد واللوح وطقس اليوم الذي صُبّت فيه." },
    body: {
      en: [
        "Concrete is mocked for being cold, yet we have rarely stood in a warmer room than a well-made concrete one. Warmth, in architecture, is not temperature; it is the evidence of care. Every board mark, every tie-hole and every faint colour change records a decision made by a person on a particular morning.",
        "At the Silent House in Kyoto, we asked the formwork carpenters to use Hinoki boards that had already been used twice. The grain of the old timber transferred to the roof soffit as a quiet, rippled texture that no catalogue finish could replicate. The clients say they sometimes run a hand across it while passing, as one touches a banister.",
        "The material also teaches humility. Concrete cannot be corrected once it has cured. This forces a kind of drawing discipline — every joint, every pour sequence and every reinforcement cage is resolved on paper long before the first truck arrives. Our model-makers build the formwork in cardboard first, and often discover the mistake there.",
        "There is an ethical argument too. A building that lasts three hundred years is a lighter burden than three that last a hundred, whatever the embodied carbon on day one. We now specify low-clinker mixes and recycled aggregates wherever the structure allows, but we refuse to trade away durability for a headline number.",
        "So when someone calls concrete brutal, we agree — in the old sense of the word, from the French for raw. Raw material, honestly shown. It asks very little of a room except that the light be good. Give it that, and it will speak softly for centuries.",
      ],
      ar: [
        "يُسخَر من الخرسانة لبرودتها، ومع ذلك نادراً ما وقفنا في غرفة أدفأ من غرفة خرسانية جيدة الصنع. الدفء في العمارة ليس درجة حرارة، بل دليل على العناية. كل أثر لوح، وكل ثقب ربط، وكل تغيّر طفيف في اللون يسجّل قراراً اتخذه شخص ما في صباح بعينه.",
        "في البيت الصامت بكيوتو، طلبنا من نجّاري القوالب استخدام ألواح هينوكي سبق استعمالها مرتين. انتقل عرق الخشب القديم إلى باطن السقف نسيجاً متموّجاً هادئاً لا يضاهيه أي تشطيب جاهز. يقول العميلان إنهما يمرّران يداً عليه أحياناً كما يلمس المرء درابزين.",
        "وتعلّمنا المادة التواضع. فالخرسانة لا تُصحَّح بعد أن تتصلّب، وهذا يفرض انضباطاً في الرسم؛ كل وصلة وتسلسل صبّ وقفص تسليح يُحسم على الورق قبل وصول أول شاحنة. يبني صنّاع النماذج لدينا القوالب من الكرتون أولاً، وغالباً ما يكتشفون الخطأ هناك.",
        "وثمة حجّة أخلاقية أيضاً. مبنى يعمّر ثلاثمئة عام عبء أخفّ من ثلاثة مبانٍ تعمّر مئة، مهما كان الكربون المتجسّد في اليوم الأول. نحدّد اليوم خلطات منخفضة الكلنكر وركاماً مُعاد تدويره حيثما سمح الإنشاء، لكننا نرفض مقايضة المتانة برقم لافت.",
        "فحين يصف أحدهم الخرسانة بالقسوة نوافقه — بالمعنى القديم للكلمة، من الفرنسية «خام». مادة خام تُعرض بصدق. لا تطلب من الغرفة شيئاً سوى أن يكون الضوء جيداً. امنحها ذلك فتتحدث بهدوء قروناً.",
      ],
    },
  },
  {
    slug: "designing-with-natural-light", layout: "tall", category: "light", date: "2025-02-04", minutes: 6, author: "Karim El-Sayed", role: { en: "Partner, Cairo", ar: "الشريك، القاهرة" },
    title: { en: "Designing With Natural Light", ar: "التصميم بالضوء الطبيعي" },
    dek: { en: "Light is the only material we cannot buy, store or ship — only shape.", ar: "الضوء هو المادة الوحيدة التي لا نستطيع شراءها أو تخزينها أو شحنها، بل تشكيلها فقط." },
    image: "/images/projects/the-courtyard-2.jpg", imageAlt: { en: "Mashrabiya screens casting patterned light", ar: "مشربيات تلقي ضوءاً منقوشاً" },
    quote: { en: "Shadow is not the absence of light. It is what gives light something to say.", ar: "الظل ليس غياب الضوء، بل ما يمنح الضوء ما يقوله." },
    body: {
      en: [
        "Light is the only material we cannot buy, store or ship. We can only shape it — by cutting an opening, tilting a surface, or deciding where it should be refused. That refusal is the part most often forgotten.",
        "In Cairo, a courtyard house is a machine for managing the sun. The sky is brightest at noon and harshest at noon, so the traditional plan hands light to the courtyard and filters it through mashrabiya before it reaches the rooms. The lattice does not simply block; it breaks the sun into a thousand small gestures that the eye reads as softness.",
        "We study light with physical models long before we run software. A cardboard model on the roof terrace, photographed every hour, tells us in a single afternoon what a week of simulation might hide: the colour of the reflected light off a limestone wall, the moment a shadow crosses a threshold.",
        "Good daylight design is also a choreography of time. A reading corner should be bright in the morning and quiet by evening; a dining table should receive the last warm light. When the building is finished, the occupants should feel the day move through it, and not need to think about why.",
      ],
      ar: [
        "الضوء هو المادة الوحيدة التي لا نستطيع شراءها أو تخزينها أو شحنها، بل تشكيلها فقط؛ بفتح كوّة، أو إمالة سطح، أو قرار بشأن موضع رفضه. وهذا الرفض هو الجزء الذي يُنسى غالباً.",
        "في القاهرة، بيت الفناء آلة لإدارة الشمس. السماء أسطع ما تكون عند الظهيرة وأقسى ما تكون عندها، لذا يسلّم المسقط التقليدي الضوء للفناء ويرشّحه عبر المشربية قبل أن يبلغ الغرف. لا تحجب الشبكة الخشبية فحسب، بل تكسر الشمس إلى ألف إيماءة صغيرة تقرؤها العين نعومةً.",
        "ندرس الضوء بنماذج مادية قبل أن نشغّل أي برنامج. نموذج كرتوني على سطح البيت يُصوَّر كل ساعة يخبرنا في عصر واحد بما قد يخفيه أسبوع من المحاكاة: لون الضوء المنعكس عن جدار حجري، واللحظة التي يعبر فيها ظل عتبة.",
        "وتصميم الضوء الجيد تصميم للزمن أيضاً. ركن القراءة ينبغي أن يكون مشرقاً صباحاً وهادئاً مساءً؛ وطاولة الطعام تستقبل آخر ضوء دافئ. حين يكتمل المبنى ينبغي أن يشعر ساكنوه بالنهار يمرّ عبره دون أن يتساءلوا لماذا.",
      ],
    },
  },
  {
    slug: "the-future-of-sustainable-architecture", layout: "standard", category: "sustainability", date: "2025-01-15", minutes: 8, author: "Ingrid Solheim", role: { en: "Founding Partner", ar: "الشريكة المؤسِّسة" },
    title: { en: "The Future of Sustainable Architecture", ar: "مستقبل العمارة المستدامة" },
    dek: { en: "Beyond the label: durability, repair and the slow arithmetic of carbon.", ar: "ما وراء الشارة: المتانة والإصلاح والحساب البطيء للكربون." },
    image: "/images/projects/desert-frame-2.jpg", imageAlt: { en: "Sandstone frames at sunset", ar: "إطارات حجرية عند الغروب" },
    quote: { en: "The most sustainable building is the one nobody wants to demolish.", ar: "أكثر المباني استدامة هو الذي لا يريد أحد هدمه." },
    body: {
      en: [
        "Sustainability has become a label, and labels invite shortcuts. A building can score well on a checklist and still be unloved, unrepaired and demolished within forty years. The most sustainable building is, quite simply, the one nobody wants to knock down.",
        "That reframes the work. Durability becomes a design strategy: materials that age into their beauty, details that can be repaired by a competent local craftsperson, and plans that can change use without surgery. At Desert Frame, the frames sit on removable footings and are built from aggregate won on site; the building could be taken away and the desert would hardly notice.",
        "Carbon accounting is changing how we think about structure. A shorter span, a lighter slab, a timber frame in place of steel — each decision is now quantified in the first weeks of design, when it is cheap to change. We publish our assumptions in every client report so the figures can be challenged.",
        "The harder part is cultural. Clients still reward novelty. We have learned to talk about maintenance as a design feature, to draw the ladder and the access hatch, and to leave a short ‘owner’s manual’ with every building. The future of sustainable architecture may look less like innovation and more like care.",
      ],
      ar: [
        "صارت الاستدامة شارة، والشارات تدعو إلى الاختصارات. قد يحقق المبنى درجات عالية في قائمة معايير ثم يبقى غير محبوب وغير مُصان ويُهدم خلال أربعين عاماً. أكثر المباني استدامة هو ببساطة الذي لا يريد أحد هدمه.",
        "وهذا يغيّر طبيعة العمل. تصبح المتانة استراتيجية تصميم: مواد تزداد جمالاً بالتقادم، وتفاصيل يمكن لحِرفي محلي ماهر إصلاحها، ومساقط تتغير وظيفتها دون جراحة. في «إطار الصحراء» تقوم الإطارات على أساسات قابلة للإزالة ومن ركام استُخرج من الموقع؛ يمكن رفع المبنى ولن تلاحظ الصحراء ذلك.",
        "تغيّر محاسبة الكربون طريقة تفكيرنا في الإنشاء. بحر أقصر، وبلاطة أخف، وهيكل خشبي بدل الفولاذ؛ كل قرار يُقاس كمياً في الأسابيع الأولى من التصميم حين يكون تغييره رخيصاً. ننشر افتراضاتنا في كل تقرير للعميل ليتسنى الاعتراض على الأرقام.",
        "أما الجزء الأصعب فثقافي. ما يزال العملاء يكافئون الجِدّة. تعلّمنا أن نتحدث عن الصيانة كميزة تصميمية، وأن نرسم السلّم وفتحة الوصول، وأن نترك «دليل المالك» القصير مع كل مبنى. قد يبدو مستقبل العمارة المستدامة أقرب إلى العناية منه إلى الابتكار.",
      ],
    },
  },
  {
    slug: "drawing-before-building", layout: "tall", category: "practice", date: "2024-11-20", minutes: 5, author: "Yuki Tanabe", role: { en: "Associate, Model Shop", ar: "المساعد، ورشة النماذج" },
    title: { en: "Drawing Before Building", ar: "الرسم قبل البناء" },
    dek: { en: "Inside the model shop, where every project is built three times before it is built once.", ar: "داخل ورشة النماذج، حيث يُبنى كل مشروع ثلاث مرات قبل أن يُبنى مرة." },
    image: "/images/studio/workshop-1.jpg", imageAlt: { en: "White massing models on a timber table", ar: "نماذج كتل بيضاء على طاولة خشبية" },
    quote: { en: "A model is an argument you can hold in your hands.", ar: "النموذج حجّة يمكنك حملها بين يديك." },
    body: {
      en: [
        "Every project in the studio is built three times before it is built once: first as a quick massing model in white card, then as a detailed model at 1:50, and finally as a full-scale mock-up of a single bay. Each stage is cheaper to be wrong in than the next.",
        "The white massing model is the studio's real meeting table. Clients move the buildings about with their fingers. A tower slides a few centimetres and suddenly a courtyard gets its afternoon sun. This tactile argument is worth more than an hour of slides.",
        "We still draw by hand, too. A section sketched at 1:20 forces the question that a 3D model lets you skip: how, exactly, does this wall meet that floor? The answer often lives in a margin note.",
      ],
      ar: [
        "يُبنى كل مشروع في الاستوديو ثلاث مرات قبل أن يُبنى مرة: أولاً نموذج كتلة سريع بورق أبيض، ثم نموذج مفصّل بمقياس ١:٥٠، وأخيراً نموذج بالحجم الطبيعي لوحدة واحدة. الخطأ في كل مرحلة أرخص منه في التي تليها.",
        "نموذج الكتلة الأبيض هو طاولة الاجتماعات الحقيقية في الاستوديو. يحرّك العملاء المباني بأصابعهم. يُزاح برج بضعة سنتيمترات فيحصل فناء على شمس عصره. هذه الحجّة اللمسية تساوي أكثر من ساعة من الشرائح.",
        "ولا نزال نرسم باليد. يفرض قطاع مرسوم بمقياس ١:٢٠ السؤال الذي يتيح لك النموذج الثلاثي الأبعاد تخطّيه: كيف بالضبط يلتقي هذا الجدار بتلك الأرضية؟ وغالباً ما تسكن الإجابة في ملاحظة على الهامش.",
      ],
    },
  },
  {
    slug: "a-house-for-listening", layout: "standard", category: "practice", date: "2024-09-02", minutes: 6, author: "Karim El-Sayed", role: { en: "Partner, Cairo", ar: "الشريك، القاهرة" },
    title: { en: "A House for Listening", ar: "بيت للإصغاء" },
    dek: { en: "Acoustics, silence and the design of the Silent House.", ar: "الصوتيات والصمت وتصميم البيت الصامت." },
    image: "/images/projects/the-silent-house-3.jpg", imageAlt: { en: "Cedar fin screen of the Silent House", ar: "حاجب زعانف الأرز في البيت الصامت" },
    quote: { en: "Silence is not empty. It is a room with good walls.", ar: "الصمت ليس فراغاً، بل غرفة بجدران جيدة." },
    body: {
      en: [
        "When a cellist and a calligrapher ask for the same house, the brief is really about attention. One practice makes sound; the other requires its absence. The design had to hold both without either noticing the other.",
        "We worked with an acoustician from the first sketch. Mass goes where sound is made — a double-skinned concrete room at the west — and softness goes where it is received. The living room has a timber ceiling perforated at one in four boards, backed by mineral wool.",
        "The garden is part of the system. Gravel underfoot is an alarm; moss is a muffler. The route from the gate to the front door is paved with large river stones precisely so that arrivals are announced gently, never abruptly.",
      ],
      ar: [
        "حين يطلب عازف تشيلو وخطّاط البيت نفسه، يصير البرنامج في حقيقته عن الانتباه. إحدى الممارستين تصنع الصوت والأخرى تتطلب غيابه، وعلى التصميم أن يحتضنهما دون أن يلحظ أحدهما الآخر.",
        "عملنا مع خبير صوتيات منذ أول رسم. تذهب الكتلة حيث يُصنع الصوت — غرفة خرسانية مزدوجة الجلد في الغرب — وتذهب النعومة حيث يُستقبل. في غرفة المعيشة سقف خشبي مثقّب في لوح من كل أربعة، مسنود بصوف معدني.",
        "الحديقة جزء من المنظومة. الحصى تحت القدم جرس إنذار، والطحلب كاتم صوت. مسار البوابة إلى الباب الأمامي مرصوف بحجارة نهرية كبيرة تحديداً ليُعلَن الوصول برفق لا بفجاجة.",
      ],
    },
  },
  {
    slug: "the-city-as-material", layout: "wide", category: "light", date: "2024-06-18", minutes: 5, author: "Elena Rossi", role: { en: "Partner, Milan studio", ar: "الشريكة، استوديو ميلانو" },
    title: { en: "The City as Material", ar: "المدينة بوصفها مادة" },
    dek: { en: "Designing Form & Light in an old street, between a church and a bank.", ar: "تصميم «الشكل والضوء» في شارع قديم بين كنيسة ومصرف." },
    image: "/images/projects/form-and-light-2.jpg", imageAlt: { en: "Stone fins on a Milan office building", ar: "زعانف حجرية على مبنى مكاتب في ميلانو" },
    quote: { en: "A new building is a guest. It should arrive on time and leave the room better.", ar: "المبنى الجديد ضيف؛ عليه أن يصل في موعده وأن يترك الغرفة أفضل." },
    body: {
      en: [
        "A new building in an old city is a guest. It should arrive on time, dress appropriately and leave the room slightly better than it found it. In Milan, that meant studying the stone of the church next door for weeks before we drew a line.",
        "The fins on Form & Light borrow the rhythm of the baroque façade across the street, translated into a modern idiom. At 500 mm centres they are close enough to read as a surface from afar and as individual blades from the pavement.",
        "At street level we gave away three metres of site to widen the pavement. It cost us lettable area and bought us a plaza that, six months in, has become a lunch spot for half the neighbourhood. No metric on the feasibility study predicted that.",
      ],
      ar: [
        "المبنى الجديد في مدينة قديمة ضيف؛ عليه أن يصل في موعده، وأن يرتدي ما يليق، وأن يترك الغرفة أفضل قليلاً مما وجدها. في ميلانو عنى ذلك دراسة حجر الكنيسة المجاورة أسابيع قبل رسم أي خط.",
        "تستعير زعانف «الشكل والضوء» إيقاع الواجهة الباروكية المقابلة في صياغة معاصرة. وعلى محاور ٥٠٠ مم تقترب بما يكفي لتُقرأ سطحاً من بعيد وشفرات منفردة من الرصيف.",
        "عند مستوى الشارع تنازلنا عن ثلاثة أمتار من الأرض لتوسيع الرصيف. كلّفنا ذلك مساحة قابلة للتأجير واشترى لنا ساحة صارت بعد ستة أشهر مكان غداء لنصف الحي. لم يتنبأ بذلك أي مؤشر في دراسة الجدوى.",
      ],
    },
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const homeArticles = ["the-poetry-of-concrete", "designing-with-natural-light", "the-future-of-sustainable-architecture"].map((s) => articles.find((a) => a.slug === s)!);
export const relatedArticles = (slug: string, n = 3) => articles.filter((a) => a.slug !== slug).slice(0, n);
