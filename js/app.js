let allBooksData = [
  {
    "id": 1,
    "title": "الصلاة ركن الإسلام الثاني (الجزء الأول)",
    "author": "أحمد مصطفى محمد مصطفى",
    "category": "العبادات والفقه",
    "file": "book-1.json",
    "description": "كتاب تربوي إيماني يبين أهمية الصلاة، روحها وصورتها، شجرة الدين، وضرورة الطهارة وأسرار الأذان."
  },
  {
    "id": 2,
    "title": "الصلاة ركن الإسلام الثاني (الجزء الثاني)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "العبادات والفقه",
    "file": "book-2.json",
    "description": "الجزء الثاني: تفاصيل أحكام الوضوء، السواك، سنن الوضوء، آداب المضمضة والاستنشاق، والتنقل بين الحكم التربوية والأخلاقية."
  },
  {
    "id": 3,
    "title": "الصلاة ركن الإسلام الثاني (الجزء الثالث)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "العبادات والفقه",
    "file": "book-3.json",
    "description": "الجزء الثالث: أدعية الوضوء، إطالة الغرة والتحجيل، أركان الوضوء ومعانيها السلوكية، نواقض الوضوء، وأحكام المياه."
  },
  {
    "id": 4,
    "title": "الصلاة ركن الإسلام الثاني (الجزء الرابع)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "العبادات والفقه",
    "file": "book-4.json",
    "description": "الجزء الرابع: معاني الصلاة والصلة، شروط صحة الصلاة، أركانها الخمسة عشر بالتفصيل، صلاة التطوع، وأسرار القرب والمحبة."
  },
  {
    "id": 5,
    "title": "في مدرسة الصلاة والتوحيد وأقسام الشريعة (الكتاب الخامس - الحلقتان 1 و 2)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصلاة",
    "file": "book-5.json",
    "description": "يضم الحلقتين الأولى والثانية: قاعدة التوحيد، الكبسولات الروحية، أقسام الشريعة، وأبواب الجنة الثمانية في الصلاة."
  },
  {
    "id": 6,
    "title": "مدرسة التدريب الإيماني وأسرار الطهارة والماء (الكتاب السادس - الحلقتان 3 و 4)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصلاة",
    "file": "book-6.json",
    "description": "يضم الحلقتين الثالثة والرابعة: مدرسة التدريب، معرفة قدر النفس، خداع الأنا، أسرار الماء السبع، وآداب الخلاء."
  },
  {
    "id": 7,
    "title": "أسرار المياه، حقائق الوضوء، ونواقض الطهارة (الكتاب السابع - الحلقتان 5 و 6)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصلاة",
    "file": "book-7.json",
    "description": "يضم الحلقتين الخامسة والسادسة: أنواع المياه، حقائق الوضوء الثمانية، أسرار البسملة، ونواقض الوضوء الباطنة."
  },
  {
    "id": 8,
    "title": "أسرار البسملة والنواقض الباطنة وقواعد الوقت (الكتاب الثامن - درسين)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصلاة",
    "file": "book-8.json",
    "description": "يضم درسين: أسرار البسملة، الحقائق الثمانية، النواقض الباطنة للإنسان، وشروط صحة الصلاة وقانون الوقت."
  },
  {
    "id": 9,
    "title": "شروط الصلاة، أركانها الخمسة عشر، وخشوع القلب (الكتاب التاسع - 4 حلقات)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصلاة",
    "file": "book-9.json",
    "description": "يضم 4 حلقات (من 9 إلى 12): شروط صحة الصلاة، الاستقبال، أركان الصلاة، فقه الفاتحة، والخشوع القلبي."
  },
  {
    "id": 10,
    "title": "صلاة التطوع، الجماعة، الجمعة، وأحكام السفر (الكتاب العاشر - 4 حلقات)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصلاة",
    "file": "book-10.json",
    "description": "يضم 4 حلقات (من 13 إلى 16): أسرار النوافل، صلاة الجماعة، فقه الجمعة والأعياد، وصلاة السفر والخوف."
  },
  {
    "id": 11,
    "title": "أحكام المريض، سجود السهو، الأذكار، وخاتمة ثمرات الصلاة (الكتاب الحادي عشر والأخير)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصلاة",
    "file": "book-11.json",
    "description": "يضم الحلقات الأربع الأخيرة (من 17 إلى 20): صلاة المريض، سجود السهو، أسرار الأذكار، وخاتمة ثمرات الصلاة."
  },
  {
    "id": 12,
    "title": "الصيام معراج المتقين ولباس الروح وزاد القلوب (الكتاب الأول - الصيام)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصيام",
    "file": "fasting-book-1.json",
    "description": "حقيقة العبادة والاحتياج الإلهي، علة التقوى، الوقاية من نار الدنيا والآخرة، لباس الروح، ووصايا النجاة في زمن الفتن."
  },
  {
    "id": 13,
    "title": "الصيام بالقلب، الشفافية الروحية، والعبور إلى نور القرآن (الكتاب الثاني - الصيام)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصيام",
    "file": "fasting-book-2.json",
    "description": "سماع القلب، مكان التقوى، خطورة أذى الجوارح واللسان، فلسفة التحول من الخشب للزجاج بالصيام، واللقمة الحلال."
  },
  {
    "id": 14,
    "title": "ليلة القدر، حال القلب، وصور الصيام الثلاثة والتحرر (الكتاب الثالث - الصيام)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصيام",
    "file": "fasting-book-3.json",
    "description": "قاعدة الظروف الثلاثة (المكان والزمان والحال)، حقيقة ليلة القدر القلبية، زكاة الفطر، مراتب شجرة الدين، وصور الصيام الثلاثة."
  },
  {
    "id": 15,
    "title": "التقوى والقلب، أسرار الخيط الأبيض، ووجبة القلوب القرآنية (الكتاب الرابع - الصيام)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصيام",
    "file": "fasting-book-4.json",
    "description": "تفصيل التقوى ومحلها الصدري، أسرار كتابة الصيام، مراتب النور، تحذيرات النفاق ودعوات جبريل، والوجبة القرآنية للقلب."
  },
  {
    "id": 16,
    "title": "قيام الليل، نفحات العشر الأواخر، ودوام الصلة بعد رمضان (الكتاب الخامس والأخير - الصيام)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الصيام",
    "file": "fasting-book-5.json",
    "description": "قيام الليل، فقه العطاء وإفطار الصائمين، العشر الأواخر والعتق من النار، وما بعد رمضان ودوام التقوى والاستقامة."
  },
  {
    "id": 17,
    "title": "أسرار الزكاة والرزق الخفي.. حقيقة الغلاف والمضمون وشجرة الإيمان (الكتاب الأول - الزكاة)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الزكاة",
    "file": "zakat-book-1.json",
    "description": "حقيقة العبادات كغلاف ومضمون، شجرة الإيمان والأخلاق، أسرار الزكاة والنمو والبركة، نجاسة الشح، وقصة ثعلبة والإخلاص."
  },
  {
    "id": 18,
    "title": "أسرار العطاء الشامل وفلسفة الشروط التربوية للزكاة (الكتاب الثاني - الزكاة)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الزكاة",
    "file": "zakat-book-2.json",
    "description": "أركان الإسلام، مفهوم الزكاة الشامل (عطاء الجيب واللسان والقلب)، قانون العطاء الإلهي، ذم التبذير، وفلسفة شروط الزكاة التربوية."
  },
  {
    "id": 19,
    "title": "أسرار الإحرام، الطواف، الفطرة في عرفات، ورحلة السعي واليقين (الكتاب الأول - الحج)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الحج",
    "file": "hajj-book-1.json",
    "description": "رحلة الموت الاختياري، إشارات الإحرام، الطواف والمركزية الكونية، جبل عرفات، قصة السيدة هاجر واليقين."
  },
  {
    "id": 20,
    "title": "رحلة السعي النفسية، حب الوطن، هدايات الأنبياء، والصحبة الصادقة (الكتاب الثاني - الحج)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الحج",
    "file": "hajj-book-2.json",
    "description": "إشارات السعي الثلاثة، شروط القبول وحرمة الأموال، الوطن وعاء الدين، دروس الهجرة النبوية وصحبة الغار."
  },
  {
    "id": 21,
    "title": "حقيقة زيارة النبي، أسرار النية والإخلاص، ومعرفة القلوب (الكتاب الثالث والأخير - الحج)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "دروس ومحاضرات الحج",
    "file": "hajj-book-3.json",
    "description": "حقيقة زيارة النبي الحي، الأخلاق جوهر الدين، أسرار النية والإخلاص، مشهد الصديق والفاروق، وعلامات الحج المبرور."
  },
  {
    "id": 22,
    "title": "الكتاب الأول: أسماء الله الحسنى (من هو الله إلى المتكبر)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "أسماء الله الحسنى",
    "file": "asmaa_allah_book_1.json",
    "description": "الدروس العقدية والتربوية لأسماء الله الحسنى من هو الله إلى المتكبر."
  },
  {
    "id": 23,
    "title": "الكتاب الثاني: أسماء الله الحسنى (من الخالق إلى القابض)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "أسماء الله الحسنى",
    "file": "asmaa_allah_book_2.json",
    "description": "الدروس العقدية والتربوية لأسماء الله الحسنى من الخالق إلى القابض."
  },
  {
    "id": 24,
    "title": "الكتاب الثالث: أسماء الله الحسنى (من الخافض إلى الحفيظ)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "أسماء الله الحسنى",
    "file": "asmaa_allah_book_3.json",
    "description": "الدروس العقدية والتربوية لأسماء الله الحسنى من الخافض إلى الحفيظ."
  },
  {
    "id": 25,
    "title": "الكتاب الرابع: أسماء الله الحسنى (من المقيت إلى المجيد)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "أسماء الله الحسنى",
    "file": "asmaa_allah_book_4.json",
    "description": "الدروس العقدية والتربوية لأسماء الله الحسنى من المقيت إلى المجيد."
  },
  {
    "id": 26,
    "title": "الكتاب الخامس: أسماء الله الحسنى (من الباعث إلى المعيد)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "أسماء الله الحسنى",
    "file": "asmaa_allah_book_5.json",
    "description": "الدروس العقدية والتربوية لأسماء الله الحسنى من الباعث إلى المعيد."
  },
  {
    "id": 27,
    "title": "الكتاب السادس: أسماء الله الحسنى (من المحيي إلى التواب)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "أسماء الله الحسنى",
    "file": "asmaa_allah_book_6.json",
    "description": "الدروس العقدية والتربوية لأسماء الله الحسنى من المحيي إلى التواب."
  },
  {
    "id": 28,
    "title": "الكتاب السابع: أسماء الله الحسنى (من المنتقم إلى الصبور - الختام)",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "أسماء الله الحسنى",
    "file": "asmaa_allah_book_7.json",
    "description": "الدروس العقدية والتربوية لأسماء الله الحسنى من المنتقم إلى الصبور."
  },
  {
    "id": 29,
    "title": "الكتاب الأول: الصفات الواجبة - الصفات النفسية والسلبية",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "العقيدة - الصفات الواجبة",
    "file": "sifat_book_1.json",
    "description": "الصفات النفسية والسلبية: الوجود، القدم، البقاء، القيام بالنفس، المخالفة للحوادث، الوحدانية."
  },
  {
    "id": 30,
    "title": "الكتاب الثاني: الصفات الواجبة - صفات المعاني",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "العقيدة - الصفات الواجبة",
    "file": "sifat_book_2.json",
    "description": "صفات المعاني: الحياة ودوام الوجود، العلم المحيط، الإرادة ونفي الاضطرار، القدرة المطلقة."
  },
  {
    "id": 31,
    "title": "الكتاب الثالث: الصفات الواجبة - السمع والبصر والكلام وحقيقة الإيمان",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "العقيدة - الصفات الواجبة",
    "file": "sifat_book_3.json",
    "description": "السمع والبصر والكلام، وحقيقة الإيمان السلوكي وتحويل الإيمان النظري لنظام تشغيل لحياتك."
  },
  {
    "id": 32,
    "title": "الصباح الخامس: مصباح البسملة",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-basmala.json",
    "description": "مصباح البسملة كامل نصاً حرفياً للتعليم والحفظ - 11 بند."
  },
  {
    "id": 33,
    "title": "المصباح الرابع: مصباح الاستعاذة النبوي",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-istiaza.json",
    "description": "مصباح الاستعاذة النبوي كامل 42 معلومة حرفياً للتعليم والحفظ."
  },
  {
    "id": 34,
    "title": "المصباح السادس: مصباح المصابيح",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-masabih.json",
    "description": "مصباح المصابيح كامل 31 معلومة حرفياً للتعليم والحفظ."
  },
  {
    "id": 35,
    "title": "المصباح الأول: مصباح السور والآيات",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-suwar-wal-ayat.json",
    "description": "مصباح السور والآيات 15 معلومة حرفياً للتعليم والحفظ."
  },
  {
    "id": 36,
    "title": "المصباح السابع: مصباح السلسلة الكبير",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-silsila-al-kabir.json",
    "description": "مصباح السلسلة الكبير 13 صفحة حرفي بدون تأليف."
  },
  {
    "id": 37,
    "title": "مصباح الشهادتين",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-shahadatayn.json",
    "description": "مصباح الشهادتين كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 38,
    "title": "مصباح الأذان والإقامة",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-azan.json",
    "description": "مصباح الأذان والإقامة كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 39,
    "title": "مصباح الاستفتاح",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-istiftah.json",
    "description": "مصباح الاستفتاح كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 40,
    "title": "مصباح الركوع",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-rukuu.json",
    "description": "مصباح الركوع كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 41,
    "title": "مصباح السجود",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-sujood.json",
    "description": "مصباح السجود كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 42,
    "title": "مصباح القنوت",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-qunoot.json",
    "description": "مصباح القنوت كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 43,
    "title": "مصباح ختام الصلاة",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-khtam-al-salah.json",
    "description": "مصباح ختام الصلاة كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 44,
    "title": "مصباح الوضوء",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-wudoo.json",
    "description": "مصباح الوضوء كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 45,
    "title": "مصباح الصيام",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-siyam.json",
    "description": "مصباح الصيام كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 46,
    "title": "مصباح التشهد",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-tashahhud.json",
    "description": "مصباح التشهد كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 47,
    "title": "مصباح الخروج",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-khurooj.json",
    "description": "مصباح الخروج كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 48,
    "title": "مصباح الدخول",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-dukhool.json",
    "description": "مصباح الدخول كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 49,
    "title": "مصباح الداعي",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-dai.json",
    "description": "مصباح الداعي كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 50,
    "title": "مصباح الدعوة",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-dawa.json",
    "description": "مصباح الدعوة كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 51,
    "title": "مصباح السفر",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-safar.json",
    "description": "مصباح السفر كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 52,
    "title": "مصباح السؤال",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-sual.json",
    "description": "النص الكامل للمصباح الثاني والأربعون (مصباح السؤال)."
  },
  {
    "id": 53,
    "title": "المصباح العاشر: مصباح الصباح والمساء",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-sabah-wal-masaa.json",
    "description": "مصباح الصباح والمساء كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 54,
    "title": "المصباح الثامن: مصباح الصباح",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-sabah.json",
    "description": "مصباح الصباح كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 55,
    "title": "المصباح التاسع: مصباح المساء",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-masaa.json",
    "description": "مصباح المساء كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 56,
    "title": "المصباح الخامس عشر: مصباح الأكل والشرب",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-akl-wal-shurb.json",
    "description": "مصباح الأكل والشرب كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 57,
    "title": "المصباح الثالث عشر: مصباح الملبس",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-malbas.json",
    "description": "مصباح الملبس كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 58,
    "title": "المصباح الثامن والثلاثون: مصباح الموت",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-mawt.json",
    "description": "مصباح الموت كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 59,
    "title": "المصباح السابع والثلاثون: مصباح النفس",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-nafs.json",
    "description": "مصباح النفس كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 60,
    "title": "المصباح التاسع والثلاثون: مصباح النور",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-noor.json",
    "description": "مصباح النور كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 61,
    "title": "المصباح الثامن عشر: مصباح النوم واليقظة",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-nawm-wal-yaqaza.json",
    "description": "مصباح النوم واليقظة كامل نصاً حرفياً للتعليم والحفظ."
  },
  {
    "id": 62,
    "title": "المصباح الأربعون: مصباح الحضرة الجامعة",
    "author": "أحمد مصطفى محمد مصطفى (أحمد البسفي)",
    "category": "المصابيح والأذكار",
    "file": "misbah-al-hadra.json",
    "description": "النص الكامل للمصباح الأربعون (مصباح الحضرة الجامعة)."
  },
  {
    "id": 63,
    "title": "الإمام علي زين العابدين السجاد (رضي الله عنه)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "imam-zayn-alabidin.json",
    "description": "سيرة الإمام علي زين العابدين بن الحسين بن علي بن أبي طالب رضي الله عنه."
  },
  {
    "id": 64,
    "title": "الإمام علي بن أبي طالب (رضي الله عنه)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "imam-ali.json",
    "description": "سيرة الإمام علي بن أبي طالب رضي الله عنه."
  },
  {
    "id": 65,
    "title": "السيدة خديجة بنت خويلد (رضي الله عنها)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "khadija.json",
    "description": "سيرة أم المؤمنين السيدة خديجة بنت خويلد رضي الله عنها."
  },
  {
    "id": 66,
    "title": "السيدة زينب بنت علي عقيلة بني هاشم (رضي الله عنها)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "zainab-bint-ali.json",
    "description": "سيرة السيدة زينب بنت علي بن أبي طالب رضي الله عنها."
  },
  {
    "id": 67,
    "title": "السيدة فاطمة الزهراء (عليها السلام)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "fatima-al-zahraa.json",
    "description": "سيرة سيدة نساء العالمين السيدة فاطمة الزهراء عليها السلام."
  },
  {
    "id": 68,
    "title": "سيدنا أبي بكر الصديق (رضي الله عنه)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "abu-bakr.json",
    "description": "سيرة أمير المؤمنين أبي بكر الصديق رضي الله عنه."
  },
  {
    "id": 69,
    "title": "الإمام الحسن بن علي (رضي الله عنهما)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "hassan-bin-ali.json",
    "description": "سيرة سبط رسول الله وسيد شباب الجنة الإمام الحسن بن علي رضي الله عنهما."
  },
  {
    "id": 70,
    "title": "سيدنا الحسين بن علي سيد الشهداء (رضي الله عنهما)",
    "author": "رائد المستقبل",
    "category": "الشخصيات الإسلامية والتراجم",
    "file": "imam-al-hussein.json",
    "description": "سيرة سيد شباب الجنة أبي عبد الله الحسين بن علي رضي الله عنهما."
  },
  {
    "id": 71,
    "title": "خلاصة السيرة النبوية المطهرة: محطات وأحداث",
    "author": "علماء السيرة النبوية",
    "category": "السيرة النبوية والتاريخ الإسلامي",
    "file": "seerah-al-nabi.json",
    "description": "تقسيم زمني وموضوعي شامل لأبرز محطات السيرة النبوية."
  },
  {
    "id": 72,
    "title": "سيدنا محمد رسول الله ﷺ: شمائله الحميدة وخصاله المجيدة",
    "author": "الشيخ عبد الله سراج الدين",
    "category": "السيرة النبوية والشمائل",
    "file": "shamael-al-nabi.json",
    "description": "كتاب شامل يبين شمائل النبي ﷺ الحميدة وخصاله المجيدة."
  },
  {
    "id": 73,
    "title": "حلية رسول الله صلى الله عليه وسلم",
    "author": "حديث شريف",
    "category": "الشمائل المحمدية",
    "file": "hilyat-rasool-allah.json",
    "description": "تفصيل وصف حلية رسول الله صلى الله عليه وسلم وصفاته الخلقية."
  },
  {
    "id": 74,
    "title": "دلائل الخيرات وشوارق الأنوار",
    "author": "الإمام سيدي محمد بن سليمان الجزولي",
    "category": "أوراد وأذكار",
    "file": "dalael.json",
    "description": "الصلاة على النبي ﷺ مقسمة على أحزاب وأوراد أيام الأسبوع السبعة.",
    "pdfUrl": "https://lh3.googleusercontent.com/d/1dcbaGpxEYaJQYnpx-wv-yGPTiy1mUoEc",
    "isLatest": true
  },
  {
    "id": 75,
    "title": "فيض المنان",
    "author": "الشيخ جابر البغدادي",
    "category": "أوراد وأذكار",
    "file": "fayd-almanan.json",
    "description": "مجموعة الأوراد والصلوات والأدعية المباركة للشيخ جابر البغدادي.",
    "pdfUrl": "https://lh3.googleusercontent.com/d/15F43ORYaPJKKyZYoFTyJgycE4PX0OSv1",
    "isLatest": true
  }
];

let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
    buildCategoriesSidebar();
    renderBooks(allBooksData);
    setupSearch();
});

function buildCategoriesSidebar() {
    const categoriesListEl = document.getElementById('categoriesList');
    if (!categoriesListEl) return;

    let categories = [...new Set(allBooksData.map(b => b.category || 'عام'))];
    categoriesListEl.innerHTML = '';

    categories.forEach(cat => {
        let count = allBooksData.filter(b => (b.category || 'عام') === cat).length;
        let item = document.createElement('a');
        item.href = '#';
        item.className = 'nav-item';
        item.innerHTML = `📁 ${cat} <span style="float: left; font-size: 0.8rem; opacity: 0.7;">(${count})</span>`;
        item.onclick = (e) => filterCategory(cat, e);
        categoriesListEl.appendChild(item);
    });
}

function filterCategory(category, event) {
    if (event) event.preventDefault();
    currentFilter = category;

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    let filtered = [];
    if (category === 'all') {
        filtered = allBooksData;
    } else if (category === 'favorites') {
        let favs = getFavorites();
        filtered = allBooksData.filter(b => favs.includes(b.file));
    } else {
        filtered = allBooksData.filter(b => (b.category || 'عام') === category);
    }

    renderBooks(filtered);

    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function renderBooks(booksList) {
    const container = document.getElementById('sectionsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (booksList.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #64748b; padding: 40px;">لا توجد كتب في هذا القسم حالياً.</p>`;
        return;
    }

    // تجميع الكتب حسب التصنيف لتظهر مرتبة داخل أقسام
    let grouped = {};
    booksList.forEach(book => {
        let cat = book.category || 'عام';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(book);
    });

    let favorites = getFavorites();

    for (let cat in grouped) {
        let groupDiv = document.createElement('div');
        groupDiv.className = 'category-group';
        groupDiv.style.marginBottom = '30px';
        
        groupDiv.innerHTML = `
            <div class="category-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color, #e6e4df); padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="font-size: 1.2rem; color: var(--accent-color, #1b4d3e);">📁 ${cat}</h2>
                <span class="count-badge" style="background: rgba(27, 77, 62, 0.08); color: var(--accent-color, #1b4d3e); padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">${grouped[cat].length} عنصر</span>
            </div>
        `;

        let grid = document.createElement('div');
        grid.className = 'books-grid';

        grouped[cat].forEach(book => {
            let isFav = favorites.includes(book.file);
            let card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                ${book.isLatest ? '<span class="latest-badge">✨ أحدث إضافة</span>' : ''}
                <div>
                    <h3>${book.title}</h3>
                    ${book.author ? `<p class="book-author" style="font-size: 0.85rem; color: #666; margin-bottom: 6px;">${book.author}</p>` : ''}
                    ${book.description ? `<p class="book-desc" style="font-size: 0.9rem; color: #444; line-height: 1.4;">${book.description}</p>` : ''}
                </div>
                <div class="card-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                    <span class="read-action" style="color: var(--accent-color, #1b4d3e); font-weight: bold; font-size: 0.88rem;">اقرأ الآن ←</span>
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${book.file}', event)" title="إضافة للمفضلة" style="background: none; border: 1px solid #ccc; font-size: 1.1rem; cursor: pointer; padding: 5px 8px; border-radius: 6px;">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
            `;
            
            card.onclick = () => openBookReader(book.file, book.pdfUrl);
            grid.appendChild(card);
        });

        groupDiv.appendChild(grid);
        container.appendChild(groupDiv);
    }
}

function getFavorites() {
    let favs = localStorage.getItem('app_favorites');
    return favs ? JSON.parse(favs) : [];
}

function toggleFavorite(bookFile, event) {
    event.stopPropagation();
    let favs = getFavorites();
    let index = favs.indexOf(bookFile);

    if (index > -1) {
        favs.splice(index, 1);
    } else {
        favs.push(bookFile);
    }

    localStorage.setItem('app_favorites', JSON.stringify(favs));
    filterCategory(currentFilter);
}

function toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

function openBookReader(fileName, pdfUrl) {
    if (pdfUrl) {
        window.location.href = `reader.html?pdf=${encodeURIComponent(pdfUrl)}&book=${fileName}`;
    } else {
        window.location.href = `reader.html?file=${fileName}`;
    }
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', (e) => {
        let query = e.target.value.trim().toLowerCase();
        if (!query) {
            renderBooks(allBooksData);
            return;
        }

        let filtered = allBooksData.filter(b => 
            b.title.toLowerCase().includes(query) || 
            (b.author && b.author.toLowerCase().includes(query)) ||
            (b.description && b.description.toLowerCase().includes(query))
        );

        renderBooks(filtered);
    });
}
