const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} = require('docx');

async function createGuidelinesDoc() {
  const primaryColor = "1E3A8A"; // Dark Blue
  const secondaryColor = "0D9488"; // Teal
  const darkTextColor = "1F2937";
  const lightBgColor = "F3F4F6";
  const accentBorderColor = "CBD5E1";

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24, // 12pt
            color: darkTextColor,
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 line spacing
              before: 120,
              after: 120,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Document Header / Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "دليل ومعايير صياغة مقالات المدونة لموقع جلوبالايز جروب",
                bold: true,
                size: 36, // 18pt
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "Globalize Group Blog Writing & Content Brief (1200 Words Standard)\nSEO, GEO & AEO Compliance Guide",
                bold: true,
                size: 24,
                color: secondaryColor,
              }),
            ],
          }),

          // Box / Overview
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "EFF6FF", type: ShadingType.CLEAR },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 4, color: primaryColor },
                      bottom: { style: BorderStyle.SINGLE, size: 4, color: primaryColor },
                      left: { style: BorderStyle.SINGLE, size: 16, color: primaryColor },
                      right: { style: BorderStyle.SINGLE, size: 4, color: primaryColor },
                    },
                    margins: { top: 200, bottom: 200, left: 250, right: 250 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "📌 الهدف من هذا الدليل: ",
                            bold: true,
                            color: primaryColor,
                          }),
                          new TextRun({
                            text: "تزويد كتاب المحتوى والمترجمين بالمعايير الصارمة لإنتاج مقالات حصرية متوافقة مع محركات البحث التقليدية (SEO)، ومحركات الإجابة بالذكاء الاصطناعي (GEO / Generative Engine Optimization)، والبحث الصوتي المباشر (AEO / Answer Engine Optimization) بحجم ثابت ومثالي 1200 كلمة لكل مقال.",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300 } }),

          // SECTION 1: Fundamental Rules
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "1. القواعد العامة وحجم المقال (1200 كلمة)",
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "حجم المقال: ", bold: true }),
              new TextRun({ text: "يجب أن يتراوح طول كل مقال بين 1,150 إلى 1,250 كلمة (المتوسط 1,200 كلمة) باللغة العربية مع توفير نسخة إنجليزية متطابقة ومترجمة باحترافية." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "ممنوع الحشو (No Fluff): ", bold: true }),
              new TextRun({ text: "كل فقرة يجب أن تقدم معلومة قيمة، إجراءً ملموساً، أو حلاً لمشكلة تواجه العميل (مثل خطوات تصديق، متطلبات سفارة، حلول مشاكل تأشيرات)." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "ازدواجية اللغة (Bilingual Output): ", bold: true }),
              new TextRun({ text: "الموقع يدعم اللغتين العربية والإنجليزية بالكامل (Next-intl)، لذلك يُسلم المقال بملف يحتوي على النسختين كاملتين مع كافة العناوين والميتا داتا والأسئلة الشائعة." }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // SECTION 2: The Trinity (SEO, GEO, AEO)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "2. ركائز التحسين الثلاث: SEO vs GEO vs AEO",
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),

          // Comparison Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: primaryColor, type: ShadingType.CLEAR },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "المعيار", bold: true, color: "FFFFFF" })] })],
                  }),
                  new TableCell({
                    shading: { fill: primaryColor, type: ShadingType.CLEAR },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "المفهوم والهدف", bold: true, color: "FFFFFF" })] })],
                  }),
                  new TableCell({
                    shading: { fill: primaryColor, type: ShadingType.CLEAR },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "شروط التطبيق الإلزامية في المقال", bold: true, color: "FFFFFF" })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBgColor, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "SEO\n(Search Engine Optimization)", bold: true, color: primaryColor })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "التصدر في محركات البحث التقليدية (Google / Bing) وتلبية نية البحث (Search Intent)." })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "• كلمة مفتاحية رئيسية بنسبة 1-1.5%.\n• عناوين منظمة هرمياً (H1 -> H2 -> H3).\n• ميتا ديسكريبشن 130-160 حرف.\n• روابط داخلية لصفحات الفروع والخدمات." })] }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBgColor, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "GEO\n(Generative Engine Optimization)", bold: true, color: secondaryColor })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "ظهور المقال كاقتباس ومصدر مرجعي في محركات الذكاء الاصطناعي (ChatGPT, Perplexity, Gemini, Google AI Overviews)." })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "• استخدام أسلوب الكيانات (Entity-based writing).\n• وضع إحصائيات وأرقام دقيقة وحقائق موثقة.\n• تضمين ملخصات تنفيذية سهلة الاقتباس.\n• لغة موثوقة ذات سلطة معرفية (E-E-A-T)." })] }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBgColor, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "AEO\n(Answer Engine Optimization)", bold: true, color: "B45309" })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "الفوز بالنتيجة الصفرية (Position Zero) والإجابة المباشرة على المساعدات الصوتية وتطبيقات السؤال والجواب." })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "• كتابة فقرة 'Answer Box' (40-60 كلمة) في أول 100 كلمة تجيب عن السؤال مباشرة.\n• صياغة عناوين فرعية على هيئة أسئلة مباشرة (ما هي...؟ كيف يتم...؟ كم سعر...؟).\n• قسم أسئلة شائعة FAQ Schema من 4 أسئلة." })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300 } }),

          // SECTION 3: Article Structure Breakdown (1200 words blueprint)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "3. الهيكل الهندسي للمقال بحجم 1200 كلمة (Article Architecture)",
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "المقدمة والـ Answer Box (حوالي 150 كلمة): ", bold: true }),
              new TextRun({ text: "مقدمة مشوقة تحدد المشكلة + إجابة مباشرة وفورية وموجزة في 50 كلمة لتصدر الـ Featured Snippets والـ AEO." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "القسم الأول - الإطار النظري والشروط القانونية (حوالي 250 كلمة - H2 + H3): ", bold: true }),
              new TextRun({ text: "شرح المفاهيم، شروط السفارات، الجهات المعترف بها، الفرق بين الترجمة العادية والمعتمدة." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "القسم الثاني - دليل الخطوات العملية وجدول المقارنة (حوالي 350 كلمة - H2 + H3 + Table/List): ", bold: true }),
              new TextRun({ text: "خطوات تفصيلية مرقمة من 1 إلى 5 تشرح رحلة المستند من الاستخراج للتصديق للترجمة مع جدول يوضح التكلفة أو المدة أو الفروقات." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "القسم الثالث - تجنب الأخطاء الشائعة وحلول المشكلات (حوالي 200 كلمة - H2 + H3): ", bold: true }),
              new TextRun({ text: "أسباب رفض الأوراق في السفارات وكيف تتفادى التأخير (يعزز ثقة العميل والـ E-E-A-T)." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "القسم الرابع - الأسئلة الشائعة FAQ Schema (حوالي 150 كلمة): ", bold: true }),
              new TextRun({ text: "4 أسئلة دقيقة مع إجابات موجزة واضحة وشاملة." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "الخاتمة والدعوة لاتخاذ إجراء CTA (حوالي 100 كلمة - H2): ", bold: true }),
              new TextRun({ text: "ملخص سريع + حث القارئ على طلب عرض سعر أو التواصل الفوري عبر واتساب أو زيارة أقرب فرع لجلوبالايز جروب." }),
            ],
          }),

          new Paragraph({ spacing: { before: 300 } }),

          // SECTION 4: Ready-to-use Template
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "4. نموذج تسليم المقال الجاهز للتعبئة (Article Submission Form)",
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "يجب على كاتب المحتوى ملء هذا النموذج بالكامل عند تسليم كل مقال:\n",
                italics: true,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBgColor, type: ShadingType.CLEAR },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "حقل البيانات", bold: true })] })],
                  }),
                  new TableCell({
                    shading: { fill: lightBgColor, type: ShadingType.CLEAR },
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "محتوى الحقل المطلوب ملؤه", bold: true })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "عنوان المقال (AR)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "[اكتب هنا العنوان الجذاب والمستهدف بالعربية]" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Title (EN)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "[English Title]" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "الرابط الدائم (Slug)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "example-slug-in-english-words-separated-by-dashes" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "التصنيف (Category)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ترجمة معتمدة والسفارات / Certified Translation & Embassies" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "الميتا ديسكريبشن (AR)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "[نبذة تعريفية شاملة بين 130 إلى 150 حرفاً]" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Meta Description (EN)", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "[Engaging English meta description 130-150 characters]" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "الكلمة المفتاحية الرئيسية", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "[مثال: ترجمة شهادة التخرج للفيزا الألمانية]" })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "الكلمات المفتاحية الفرعية", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "1. ............. | 2. ............. | 3. ............." })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "وصف الصورة البارزة", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "[وصف للمصمم أو أداة الذكاء الاصطناعي لإنشاء صورة المقال]" })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300 } }),

          // SECTION 5: Quality Checklist
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "5. قائمة التحقق النهائية قبل تسليم المقال (Quality Checklist)",
                bold: true,
                size: 28,
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "☑ عدد الكلمات محقق بدقة (1200 كلمة) دون تكرار أو تمطيط." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "☑ تم تضمين Answer Box في المقدمة بإجابة صريحة مباشرة في أول 50-80 كلمة." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "☑ العناوين متدرجة منطقياً (H1 المقال -> H2 للأقسام -> H3 للتفريعات)." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "☑ يحتوي المقال على جدول منظم أو قوائم نقطية لسهولة القراءة والـ Scannability." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "☑ تم تضمين روابط داخلية تقود العميل لخدمات الموقع ونموذج التسعير وواتساب." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "☑ تم إرفاق 4 أسئلة شائعة FAQ باللغتين العربية والإنجليزية مطابقة للمحتوى." }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "☑ النسخة الإنجليزية مترجمة باحترافية وصياغة سليمة نحوياً ومصطلحات معتمدة." }),
            ],
          }),

          new Paragraph({ spacing: { before: 400 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "شركة جلوبالايز جروب للترجمة المعتمدة © — دليل كتابة المحتوى الرقمي",
                size: 20,
                color: "6B7280",
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve(__dirname, '..', 'Globalize_Blog_Writing_Guidelines_SEO_GEO_AEO.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document generated successfully at: ${outputPath}`);
}

createGuidelinesDoc().catch(console.error);
