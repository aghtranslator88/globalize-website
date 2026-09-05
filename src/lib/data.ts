import { prisma } from './prisma';
import { ALL_BLOG_POSTS, BlogPostItem } from './blog-data';
import { ALL_EMBASSY_POSTS, EmbassyPostItem } from './embassies-data';

// Types for localized models
export interface LocalizedService {
  id: string;
  name: string;
  slug: string;
  type: 'CERTIFIED' | 'LOCALIZATION' | 'INTERPRETATION';
  description: string;
  definition: string;
  indexable: boolean;
}

export interface LocalizedDocument {
  id: string;
  name: string;
  slug: string;
  priceEGP: number;
  deliveryHours: number;
  description: string;
  answerBox: string;
  sampleImageUrl: string | null;
  indexable: boolean;
}

export interface LocalizedEmbassy {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  region: 'EUROPE' | 'GULF_ARAB' | 'AMERICAS' | 'ASIA_AUSTRALIA';
  requirements: string[];
  useCases: string[];
  indexable: boolean;
}

export interface LocalizedGovEntity {
  id: string;
  name: string;
  slug: string;
  requirements: string[];
  useCases: string[];
  indexable: boolean;
}

export interface LocalizedLanguage {
  id: string;
  name: string;
  slug: string;
  code: string;
  popular: boolean;
  description: string;
}

export interface LocalizedBranch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  whatsapp: string;
  workingHours: string;
  lat: number;
  lng: number;
  photoUrl: string | null;
  googleMapsUrl: string;
}

export interface LocalizedTeamMember {
  id: string;
  name: string;
  title: string;
  languagePair: string;
  yearsExperience: number;
  certifications: string[];
  photoUrl: string | null;
  isLeadership: boolean;
  bio: string;
}

export interface LocalizedReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  serviceType: 'CERTIFIED' | 'LOCALIZATION' | 'INTERPRETATION';
  date: Date;
  videoUrl: string | null;
}

export interface LocalizedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  featuredImageUrl: string | null;
  videoUrl: string | null;
  publishedAt: Date;
  readMinutes: number;
  author: LocalizedTeamMember;
}

export interface LocalizedFAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

// Fallback Mock Data for build-time safety when database is offline
const MOCK_SERVICES = (isAr: boolean): LocalizedService[] => [
  {
    id: 's1',
    name: isAr ? 'ترجمة معتمدة' : 'Certified Translation',
    slug: 'certified',
    type: 'CERTIFIED',
    description: isAr ? 'ترجمة رسمية معتمدة ومطابقة للأصل مقبولة لدى كافة السفارات والجهات الحكومية.' : 'Certified official translation accepted by all embassies and government entities.',
    definition: isAr ? 'الترجمة المعتمدة هي ترجمة رسمية للوثائق مختومة وموقعة من مترجم معتمد.' : 'Certified translation is an official, stamped translation of legal records.',
    indexable: true
  },
  {
    id: 's2',
    name: isAr ? 'توطين المواقع والبرمجيات' : 'Localization Services',
    slug: 'localization',
    type: 'LOCALIZATION',
    description: isAr ? 'تطويع المواقع والتطبيقات لتناسب الثقافة واللغة المحلية.' : 'Adapting digital websites and apps to match regional layout styles.',
    definition: isAr ? 'التوطين يعيد صياغة الواجهات وتجهيزها للغات والعملات المحلية.' : 'Localization shapes UI components and text keys to suit regional markets.',
    indexable: true
  },
  {
    id: 's3',
    name: isAr ? 'الترجمة الفورية للمؤتمرات' : 'Interpretation Services',
    slug: 'interpretation',
    type: 'INTERPRETATION',
    description: isAr ? 'ترجمة فورية وشفهية وتأجير كبائن الصوت والاجتماعات.' : 'Simultaneous interpretation and audio translation booths rentals.',
    definition: isAr ? 'الترجمة الشفهية تتيح نقل المحاضرات مباشرة للجمهور المتعدد اللغات.' : 'Consecutive and audio interpretation during international events.',
    indexable: true
  }
];

const MOCK_DOCS = (isAr: boolean): LocalizedDocument[] => [
  {
    id: 'd1',
    name: isAr ? 'شهادة ميلاد مميكنة' : 'Certified Birth Certificate',
    slug: 'birth-certificate',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لشهادة الميلاد المصرية المميكنة (الكمبيوتر) إلى مختلف اللغات لتقديمها للسفارات والجامعات.' : 'Certified translation of Egyptian computerized birth certificate into foreign languages for embassies.',
    answerBox: isAr ? 'سعر ترجمة الصفحة الواحدة لشهادة الميلاد هو 200 جنيه مصري للترجمة بين العربية والإنجليزية، و300 جنيه مصري للصفحة لأي لغة أجنبية أخرى. وفي حال تعدد الصفحات يُحسب الإجمالي بعدد الصفحات مع تسليم معتمد خلال 24 ساعة.' : 'The certified translation rate for a birth certificate starts at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for any other foreign language. Multi-page documents are charged per page with 24-hour turnaround.',
    sampleImageUrl: null,
    indexable: true
  },
  {
    id: 'd2',
    name: isAr ? 'عقد زواج مميكن' : 'Certified Marriage Contract',
    slug: 'marriage-contract',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لعقود الزواج الرسمية المميكنة الصادرة عن وزارة الداخلية والسجل المدني لجميع الأغراض الرسمية والسفر.' : 'Certified translation of official marriage contracts issued by the Civil Registry for travel and visa procedures.',
    answerBox: isAr ? 'سعر ترجمة الصفحة الواحدة لعقد الزواج هو 200 جنيه مصري للترجمة بين العربية والإنجليزية، و300 جنيه مصري للصفحة للغات الأجنبية الأخرى، ويُحسب الإجمالي بعدد الصفحات مع تسليم معتمد خلال 24 ساعة.' : 'The certified translation fee for marriage contracts is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated per page with 24-hour turnaround.',
    sampleImageUrl: null,
    indexable: true
  },
  {
    id: 'd3',
    name: isAr ? 'قيد عائلي مميكن' : 'Certified Family Record',
    slug: 'family-record',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لوثيقة القيد العائلي المميكن المطلوبة للسفر والهجرة وإجراءات شؤون الأسرة بالخارج.' : 'Certified translation of computerized family record required for immigration and family reunion.',
    answerBox: isAr ? 'تكلفة ترجمة الصفحة للقيد العائلي المميكن تبدأ من 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأخرى للصفحة، ويُحسب الإجمالي بعدد الصفحات.' : 'Family record certified translation starts at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated based on total page count.',
    sampleImageUrl: null,
    indexable: true
  },
  {
    id: 'd4',
    name: isAr ? 'شهادة تحركات' : 'Movement Certificate',
    slug: 'movement-certificate',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لشهادة التحركات الصادرة من مصلحة الجوازات والهجرة لتوضيح سجل السفر وتأشيرات الخروج والدخول.' : 'Certified translation of movement certificate issued by Passport Administration showing travel history.',
    answerBox: isAr ? 'سعر ترجمة الصفحة لشهادة التحركات هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأخرى، وتُحسب الشهادات المتعددة الصفحات بسعر الصفحة.' : 'Movement certificate translation rate is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, charged per page with official certification.',
    sampleImageUrl: null,
    indexable: true
  },
  {
    id: 'd5',
    name: isAr ? 'شهادة وفاة مميكنة' : 'Certified Death Certificate',
    slug: 'death-certificate',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لشهادة الوفاة الصادرة عن السجل المدني لإجراءات المواريث والمعاملات القانونية بالخارج.' : 'Certified translation of death certificates issued by the Civil Registry for inheritance procedures.',
    answerBox: isAr ? 'سعر ترجمة الصفحة الواحدة لشهادة الوفاة هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري للغات الأجنبية الأخرى، وتسلم معتمدة خلال 24 ساعة.' : 'Certified death certificate translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, processed within 24 hours.',
    sampleImageUrl: null,
    indexable: true
  },
  {
    id: 'd6',
    name: isAr ? 'فيش جنائي (صحيفة الحالة الجنائية)' : 'Certified Police Record',
    slug: 'police-record',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لصحيفة الحالة الجنائية (الفيش والتشبيه) المطلوبة للحصول على تأشيرات السفر والعمل بالخارج.' : 'Certified translation of criminal record check (police record) required for travel and work visas.',
    answerBox: isAr ? 'تكلفة ترجمة الصفحة الواحدة للفيش الجنائي هي 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري لأي لغة ثانية، والتسليم معتمد رسمياً في 24 ساعة.' : 'Police record certified translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other foreign languages, certified in 24 hours.',
    sampleImageUrl: null,
    indexable: true
  },
  {
    id: 'd7',
    name: isAr ? 'شهادة تخرج' : 'Certified Graduation Certificate',
    slug: 'graduation-certificate',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لشهادات التخرج الصادرة من مختلف الجامعات المصرية للمنح الدراسية والتقديم للوظائف بالخارج.' : 'Certified translation of university graduation certificates for admissions and employment abroad.',
    answerBox: isAr ? 'سعر ترجمة الصفحة لشهادة التخرج هو 200 جنيه مصري (عربي ↔ إنجليزي) و300 جنيه مصري لأي لغة ثانية، وتُحسب المستندات متعددة الصفحات بعدد صفحاتها.' : 'Graduation certificate translation is priced at 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages, calculated per page.',
    sampleImageUrl: null,
    indexable: true
  },
  {
    id: 'd8',
    name: isAr ? 'بيان درجات (سجل أكاديمي)' : 'Certified Academic Transcript',
    slug: 'academic-transcript',
    priceEGP: 200,
    deliveryHours: 24,
    description: isAr ? 'ترجمة معتمدة لبيانات الدرجات والسجلات الأكاديمية المفصلة للطلاب والخريجين لأغراض استكمال الدراسة في الخارج.' : 'Certified translation of detailed academic transcripts for university admissions abroad.',
    answerBox: isAr ? 'سعر ترجمة بيان الدرجات هو 200 جنيه مصري للصفحة الواحدة (عربي ↔ إنجليزي) و300 جنيه مصري للصفحة للغات الأجنبية الأخرى، ويُحتسب الإجمالي وفقاً لعدد صفحات البيان.' : 'Academic transcript translation is 200 EGP per page (Arabic ↔ English) and 300 EGP per page for other languages. Total fee is calculated based on transcript page count.',
    sampleImageUrl: null,
    indexable: true
  }
];

const MOCK_EMBASSIES = (isAr: boolean): LocalizedEmbassy[] => [
  { id: 'e1', name: isAr ? 'سفارة ألمانيا بالقاهرة' : 'Embassy of Germany in Cairo', slug: 'germany-embassy', countryCode: 'DE', region: 'EUROPE', requirements: isAr ? ['ترجمة المستندات للألمانية'] : ['German certified translations'], useCases: isAr ? ['تأشيرات العمل والدراسة'] : ['Study and Work visas'], indexable: true },
];

const MOCK_GOVS = (isAr: boolean): LocalizedGovEntity[] => [
  { id: 'g1', name: isAr ? 'وزارة الخارجية المصرية' : 'Egyptian Ministry of Foreign Affairs', slug: 'mofa-egypt', requirements: isAr ? ['ختم الجهة الأصلية'] : ['Original issuing stamp'], useCases: isAr ? ['تصديق الشهادات للسفر'] : ['Travel certificate legalizations'], indexable: true }
];

const MOCK_LANGS = (isAr: boolean): LocalizedLanguage[] => [
  { id: 'l1', name: isAr ? 'اللغة العربية' : 'Arabic Language', slug: 'arabic', code: 'ar', popular: true, description: isAr ? 'اللغة الأم.' : 'Native tongue.' },
  { id: 'l2', name: isAr ? 'اللغة الإنجليزية' : 'English Language', slug: 'english', code: 'en', popular: true, description: isAr ? 'اللغة الدولية.' : 'International tongue.' }
];

const MOCK_BRANCHES = (isAr: boolean): LocalizedBranch[] => [
  {
    id: 'b1',
    name: isAr ? 'الجيزة – المقر الرئيسي' : 'Giza – Head Office',
    slug: 'giza-headquarters',
    address: isAr ? '1 شارع جامعة القاهرة، مكتب 29، الدور الثامن، أعلى عمر أفندي، الجيزة.' : '1 Cairo University St., Office 29, 8th Floor, Above Omar Effendi, Giza, Egypt.',
    phone: '01062990808',
    whatsapp: '+20 106 299 0808',
    workingHours: isAr ? 'السبت - الخميس: 9:00 ص - 9:00 م' : 'Saturday - Thursday: 9:00 AM - 9:00 PM',
    lat: 30.0131,
    lng: 31.2089,
    photoUrl: null,
    googleMapsUrl: 'https://maps.google.com/?q=1+Cairo+University+St,+Giza,+Egypt+Globalize+Group'
  },
  {
    id: 'b2',
    name: isAr ? 'الدقي – الجيزة' : 'Dokki Branch – Giza',
    slug: 'dokki-branch',
    address: isAr ? '2 ب شارع عكاشة، الدور الخامس، بجوار مأمورية الشهر العقاري، الدقي، الجيزة.' : '2B Okasha St., 5th Floor, Next to Real Estate Registry Office, Dokki, Giza, Egypt.',
    phone: '01062990808',
    whatsapp: '+20 106 299 0808',
    workingHours: isAr ? 'السبت - الخميس: 9:00 ص - 9:00 م' : 'Saturday - Thursday: 9:00 AM - 9:00 PM',
    lat: 30.0385,
    lng: 31.2123,
    photoUrl: null,
    googleMapsUrl: 'https://maps.google.com/?q=2B+Okasha+St,+Dokki,+Giza,+Egypt+Globalize+Group'
  },
  {
    id: 'b3',
    name: isAr ? 'الهرم – الجيزة' : 'Haram Branch – Giza',
    slug: 'haram-branch',
    address: isAr ? '6 شارع أيوب، متفرع من شارع الهرم، بجوار كايرو مول، الهرم، الجيزة.' : '6 Ayoub St., Off Haram St., Next to Cairo Mall, Haram, Giza, Egypt.',
    phone: '01062990808',
    whatsapp: '+20 106 299 0808',
    workingHours: isAr ? 'السبت - الخميس: 9:00 ص - 9:00 م' : 'Saturday - Thursday: 9:00 AM - 9:00 PM',
    lat: 29.9986,
    lng: 31.1756,
    photoUrl: null,
    googleMapsUrl: 'https://maps.google.com/?q=6+Ayoub+St,+Haram,+Giza,+Egypt+Globalize+Group'
  },
  {
    id: 'b4',
    name: isAr ? 'صلاح سالم – مصر الجديدة (عمارات العبور)' : 'Salah Salem Branch – Heliopolis (Al-Obour Bldgs)',
    slug: 'salah-salem-branch',
    address: isAr ? 'عمارة 31، مكتب 4، عمارات العبور، شارع صلاح سالم، القاهرة.' : 'Building 31, Office 4, Al-Obour Buildings, Salah Salem St., Heliopolis, Cairo, Egypt.',
    phone: '01062990808',
    whatsapp: '+20 106 299 0808',
    workingHours: isAr ? 'السبت - الخميس: 9:00 ص - 9:00 م' : 'Saturday - Thursday: 9:00 AM - 9:00 PM',
    lat: 30.0732,
    lng: 31.3115,
    photoUrl: null,
    googleMapsUrl: 'https://maps.google.com/?q=Building+31+Al-Obour+Buildings,+Salah+Salem+St,+Cairo,+Egypt+Globalize+Group'
  }
];

const MOCK_TEAM = (isAr: boolean): LocalizedTeamMember[] => [
  { id: 't1', name: isAr ? 'د. أحمد منصور' : 'Dr. Ahmed Mansour', title: isAr ? 'المدير التنفيذي' : 'CEO', languagePair: 'EN-AR', yearsExperience: 18, certifications: ['EGYTA member'], photoUrl: null, isLeadership: true, bio: isAr ? 'خبرة طويلة بالترجمة.' : 'Long experience.' }
];

const MOCK_REVIEWS = (isAr: boolean): LocalizedReview[] => [
  { id: 'r1', authorName: 'محمد أحمد', rating: 5, text: isAr ? 'خدمة ممتازة وسريعة' : 'Excellent rapid service', serviceType: 'CERTIFIED', date: new Date(), videoUrl: null }
];

const MOCK_POSTS = (isAr: boolean): LocalizedBlogPost[] => [
  {
    id: 'p1',
    title: isAr ? 'ترجمة الأوراق الرسمية للسفر لألمانيا' : 'Translating Travel Documents for Germany',
    slug: 'translate-birth-certificate-germany',
    excerpt: isAr ? 'خطوات التوثيق والترجمة.' : 'Steps for certification.',
    body: isAr ? '## التفاصيل الأساسية للترجمة والاعتماد.' : '## Core requirements.',
    category: isAr ? 'ترجمة معتمدة' : 'Certified Translation',
    featuredImageUrl: null,
    videoUrl: null,
    publishedAt: new Date(),
    readMinutes: 5,
    author: { id: 't1', name: isAr ? 'أحمد منصور' : 'Ahmed Mansour', title: isAr ? 'مدير' : 'Manager', languagePair: 'EN-AR', yearsExperience: 18, certifications: [], photoUrl: null, isLeadership: true, bio: '' }
  }
];

const MOCK_FAQS = (isAr: boolean): LocalizedFAQ[] => [
  { id: 'f1', question: isAr ? 'هل الترجمة معتمدة؟' : 'Is it certified?', answer: isAr ? 'نعم معتمدة رسمياً.' : 'Yes, officially certified.', sortOrder: 1 }
];

export function isDatabaseAvailable(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  // If running on Vercel or cloud without external postgres, skip local connection to avoid 15s timeout
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return false;
  }
  return true;
}

const DEFAULT_SITE_SETTINGS = {
  company_name_ar: 'جلوبالايز جروب لأعمال الترجمة المعتمدة',
  company_name_en: 'Globalize Group for Certified Translation',
  phone: '01062990808',
  whatsapp: '+20 106 299 0808',
  email: 'info@globalizetl.com',
  meta_default_title_ar: 'جلوبالايز جروب — ترجمة معتمدة لدى جميع السفارات والهيئات الحكومية',
  meta_default_title_en: 'Globalize Group — Certified Translation for All Embassies & Gov Entities',
  meta_description_ar: 'مكتب ترجمة معتمد رائد في مصر والخليج.',
  meta_description_en: 'Leading certified translation firm in Egypt and GCC.'
};

export async function getSiteSettings() {
  if (!isDatabaseAvailable()) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const dbSettings = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {};
    dbSettings.forEach((s) => {
      settings[s.key] = s.value;
    });
    // Ensure critical fallbacks exist
    if (!settings.company_name_ar) settings.company_name_ar = 'جلوبالايز جروب';
    if (!settings.company_name_en) settings.company_name_en = 'Globalize Group';
    if (!settings.whatsapp) settings.whatsapp = '+20 106 299 0808';
    if (!settings.phone) settings.phone = '01062990808';
    if (!settings.email) settings.email = 'info@globalizetl.com';
    return settings;
  } catch (err) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getServices(locale: string): Promise<LocalizedService[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_SERVICES(isAr);
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' },
    });
    if (services.length === 0) return MOCK_SERVICES(isAr);
    return services.map((s) => ({
      id: s.id,
      name: isAr ? s.nameAr : s.nameEn,
      slug: s.slug,
      type: s.type,
      description: isAr ? s.descriptionAr : s.descriptionEn,
      definition: isAr ? s.definitionAr : s.definitionEn,
      indexable: s.indexable,
    }));
  } catch (err) {
    return MOCK_SERVICES(isAr);
  }
}

export async function getServiceBySlug(slug: string, locale: string): Promise<LocalizedService | null> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_SERVICES(isAr).find(srv => srv.slug === slug) || null;
  try {
    const s = await prisma.service.findUnique({
      where: { slug },
    });
    if (!s) return MOCK_SERVICES(isAr).find(srv => srv.slug === slug) || null;
    return {
      id: s.id,
      name: isAr ? s.nameAr : s.nameEn,
      slug: s.slug,
      type: s.type,
      description: isAr ? s.descriptionAr : s.descriptionEn,
      definition: isAr ? s.definitionAr : s.definitionEn,
      indexable: s.indexable,
    };
  } catch (err) {
    return MOCK_SERVICES(isAr).find(srv => srv.slug === slug) || null;
  }
}

export async function getDocuments(locale: string): Promise<LocalizedDocument[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_DOCS(isAr);
  try {
    const docs = await prisma.document.findMany({
      orderBy: { priceEGP: 'asc' },
    });
    if (docs.length === 0) return MOCK_DOCS(isAr);
    return docs.map((d) => ({
      id: d.id,
      name: isAr ? d.nameAr : d.nameEn,
      slug: d.slug,
      priceEGP: d.priceEGP,
      deliveryHours: d.deliveryHours,
      description: isAr ? d.descriptionAr : d.descriptionEn,
      answerBox: isAr ? d.answerBoxAr : d.answerBoxEn,
      sampleImageUrl: d.sampleImageUrl,
      indexable: d.indexable,
    }));
  } catch (err) {
    return MOCK_DOCS(isAr);
  }
}

export async function getDocumentBySlug(slug: string, locale: string): Promise<LocalizedDocument & { relatedDocuments: LocalizedDocument[] } | null> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) {
    const doc = MOCK_DOCS(isAr).find(dc => dc.slug === slug);
    return doc ? { ...doc, relatedDocuments: [] } : null;
  }
  try {
    const d = await prisma.document.findUnique({
      where: { slug },
      include: {
        relatedTo: true,
      },
    });
    if (!d) {
      const doc = MOCK_DOCS(isAr).find(dc => dc.slug === slug);
      return doc ? { ...doc, relatedDocuments: [] } : null;
    }
    return {
      id: d.id,
      name: isAr ? d.nameAr : d.nameEn,
      slug: d.slug,
      priceEGP: d.priceEGP,
      deliveryHours: d.deliveryHours,
      description: isAr ? d.descriptionAr : d.descriptionEn,
      answerBox: isAr ? d.answerBoxAr : d.answerBoxEn,
      sampleImageUrl: d.sampleImageUrl,
      indexable: d.indexable,
      relatedDocuments: d.relatedTo.map((r) => ({
        id: r.id,
        name: isAr ? r.nameAr : r.nameEn,
        slug: r.slug,
        priceEGP: r.priceEGP,
        deliveryHours: r.deliveryHours,
        description: isAr ? r.descriptionAr : r.descriptionEn,
        answerBox: isAr ? r.answerBoxAr : r.answerBoxEn,
        sampleImageUrl: r.sampleImageUrl,
        indexable: r.indexable,
      })),
    };
  } catch (err) {
    const doc = MOCK_DOCS(isAr).find(dc => dc.slug === slug);
    return doc ? { ...doc, relatedDocuments: [] } : null;
  }
}

export async function getEmbassies(locale: string): Promise<LocalizedEmbassy[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) {
    return ALL_EMBASSY_POSTS.map((e) => ({
      id: e.id,
      name: e.title,
      slug: e.slug,
      countryCode: e.countryCode,
      region: e.region,
      requirements: e.requirements,
      useCases: e.useCases,
      indexable: e.indexable,
    }));
  }
  try {
    const embassies = await prisma.embassy.findMany({
      orderBy: { nameAr: 'asc' },
    });
    if (embassies.length > 0) {
      return embassies.map((e) => ({
        id: e.id,
        name: isAr ? e.nameAr : e.nameEn,
        slug: e.slug,
        countryCode: e.countryCode,
        region: e.region,
        requirements: (isAr ? e.requirementsAr : e.requirementsEn) as string[],
        useCases: (isAr ? e.useCasesAr : e.useCasesEn) as string[],
        indexable: e.indexable,
      }));
    }
  } catch (err) {
    // Fallback to static embassy dataset
  }

  return ALL_EMBASSY_POSTS.map((e) => ({
    id: e.id,
    name: e.title,
    slug: e.slug,
    countryCode: e.countryCode,
    region: e.region,
    requirements: e.requirements,
    useCases: e.useCases,
    indexable: e.indexable,
  }));
}

export async function getEmbassyBySlug(
  slug: string,
  locale: string
): Promise<(LocalizedEmbassy & { popularDocuments: LocalizedDocument[]; body?: string; faqs?: { question: string; answer: string }[] }) | null> {
  const isAr = locale === 'ar';
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {
    decodedSlug = slug;
  }

  if (!isDatabaseAvailable()) {
    const emb = ALL_EMBASSY_POSTS.find((e) => e.slug === decodedSlug || e.slug === slug);
    if (!emb) return null;

    return {
      id: emb.id,
      name: emb.title,
      slug: emb.slug,
      countryCode: emb.countryCode,
      region: emb.region,
      requirements: emb.requirements,
      useCases: emb.useCases,
      indexable: emb.indexable,
      body: emb.body,
      faqs: emb.faqs,
      popularDocuments: [
        { id: 'doc-1', name: 'شهادة ميلاد معتمدة', slug: 'certified-birth-certificate', priceEGP: 200, deliveryHours: 24, description: 'ترجمة معتمدة لشهادة الميلاد وموثقة', answerBox: 'سعر ترجمة الصفحة 200 ج.م (عربي-إنجليزي) و300 ج.م للغات الأخرى', sampleImageUrl: null, indexable: true },
        { id: 'doc-2', name: 'صحيفة حالة جنائية (فيش وتشبيه)', slug: 'criminal-record-cert', priceEGP: 200, deliveryHours: 24, description: 'ترجمة معتمدة لفيش وتشبيه خالي من السوابق', answerBox: 'سعر ترجمة الصفحة 200 ج.م (عربي-إنجليزي) و300 ج.م للغات الأخرى', sampleImageUrl: null, indexable: true },
        { id: 'doc-3', name: 'كشف حساب بنكي معتمد', slug: 'bank-statement', priceEGP: 200, deliveryHours: 24, description: 'ترجمة معتمدة للحركات البنكية والملاءة المالية', answerBox: 'سعر ترجمة الصفحة 200 ج.م (عربي-إنجليزي) و300 ج.م للغات الأخرى', sampleImageUrl: null, indexable: true }
      ],
    };
  }

  try {
    const e = await prisma.embassy.findUnique({
      where: { slug: decodedSlug },
      include: {
        popularDocuments: true,
      },
    });
    if (e) {
      return {
        id: e.id,
        name: isAr ? e.nameAr : e.nameEn,
        slug: e.slug,
        countryCode: e.countryCode,
        region: e.region,
        requirements: (isAr ? e.requirementsAr : e.requirementsEn) as string[],
        useCases: (isAr ? e.useCasesAr : e.useCasesEn) as string[],
        indexable: e.indexable,
        popularDocuments: e.popularDocuments.map((d) => ({
          id: d.id,
          name: isAr ? d.nameAr : d.nameEn,
          slug: d.slug,
          priceEGP: d.priceEGP,
          deliveryHours: d.deliveryHours,
          description: isAr ? d.descriptionAr : d.descriptionEn,
          answerBox: isAr ? d.answerBoxAr : d.answerBoxEn,
          sampleImageUrl: d.sampleImageUrl,
          indexable: d.indexable,
        })),
      };
    }
  } catch (err) {
    // Fallback to static audited embassy dataset
  }

  const emb = ALL_EMBASSY_POSTS.find((e) => e.slug === decodedSlug || e.slug === slug);
  if (!emb) return null;

  return {
    id: emb.id,
    name: emb.title,
    slug: emb.slug,
    countryCode: emb.countryCode,
    region: emb.region,
    requirements: emb.requirements,
    useCases: emb.useCases,
    indexable: emb.indexable,
    body: emb.body,
    faqs: emb.faqs,
    popularDocuments: [
      { id: 'doc-1', name: 'شهادة ميلاد معتمدة', slug: 'certified-birth-certificate', priceEGP: 350, deliveryHours: 24, description: 'ترجمة معتمدة لشهادة الميلاد وموثقة', answerBox: 'ترجمة معتمدة مقبولة بالسفارة', sampleImageUrl: null, indexable: true },
      { id: 'doc-2', name: 'صحيفة حالة جنائية (فيش وتشبيه)', slug: 'criminal-record-cert', priceEGP: 400, deliveryHours: 24, description: 'ترجمة معتمدة لفيش وتشبيه خالي من السوابق', answerBox: 'مقبول رسمياً بسفارات العالم', sampleImageUrl: null, indexable: true },
      { id: 'doc-3', name: 'كشف حساب بنكي معتمد', slug: 'bank-statement', priceEGP: 450, deliveryHours: 24, description: 'ترجمة معتمدة للحركات البنكية والملاءة المالية', answerBox: 'مقبول لملفات الفيزا والتأشيرات', sampleImageUrl: null, indexable: true }
    ],
  };
}

export async function getGovEntities(locale: string): Promise<LocalizedGovEntity[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_GOVS(isAr);
  try {
    const entities = await prisma.govEntity.findMany({
      orderBy: { nameAr: 'asc' },
    });
    if (entities.length === 0) return MOCK_GOVS(isAr);
    return entities.map((g) => ({
      id: g.id,
      name: isAr ? g.nameAr : g.nameEn,
      slug: g.slug,
      requirements: (isAr ? g.requirementsAr : g.requirementsEn) as string[],
      useCases: (isAr ? g.useCasesAr : g.useCasesEn) as string[],
      indexable: g.indexable,
    }));
  } catch (err) {
    return MOCK_GOVS(isAr);
  }
}

export async function getGovEntityBySlug(slug: string, locale: string): Promise<LocalizedGovEntity & { acceptedDocuments: LocalizedDocument[] } | null> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) {
    const gov = MOCK_GOVS(isAr).find(gv => gv.slug === slug);
    return gov ? { ...gov, acceptedDocuments: [] } : null;
  }
  try {
    const g = await prisma.govEntity.findUnique({
      where: { slug },
      include: {
        acceptedDocuments: true,
      },
    });
    if (!g) {
      const gov = MOCK_GOVS(isAr).find(gv => gv.slug === slug);
      return gov ? { ...gov, acceptedDocuments: [] } : null;
    }
    return {
      id: g.id,
      name: isAr ? g.nameAr : g.nameEn,
      slug: g.slug,
      requirements: (isAr ? g.requirementsAr : g.requirementsEn) as string[],
      useCases: (isAr ? g.useCasesAr : g.useCasesEn) as string[],
      indexable: g.indexable,
      acceptedDocuments: g.acceptedDocuments.map((d) => ({
        id: d.id,
        name: isAr ? d.nameAr : d.nameEn,
        slug: d.slug,
        priceEGP: d.priceEGP,
        deliveryHours: d.deliveryHours,
        description: isAr ? d.descriptionAr : d.descriptionEn,
        answerBox: isAr ? d.answerBoxAr : d.answerBoxEn,
        sampleImageUrl: d.sampleImageUrl,
        indexable: d.indexable,
      })),
    };
  } catch (err) {
    const gov = MOCK_GOVS(isAr).find(gv => gv.slug === slug);
    return gov ? { ...gov, acceptedDocuments: [] } : null;
  }
}

export async function getLanguages(locale: string): Promise<LocalizedLanguage[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_LANGS(isAr);
  try {
    const languages = await prisma.language.findMany({
      orderBy: [{ popular: 'desc' }, { nameAr: 'asc' }],
    });
    if (languages.length === 0) return MOCK_LANGS(isAr);
    return languages.map((l) => ({
      id: l.id,
      name: isAr ? l.nameAr : l.nameEn,
      slug: l.slug,
      code: l.code,
      popular: l.popular,
      description: isAr ? l.descriptionAr : l.descriptionEn,
    }));
  } catch (err) {
    return MOCK_LANGS(isAr);
  }
}

export async function getLanguageBySlug(slug: string, locale: string): Promise<LocalizedLanguage | null> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_LANGS(isAr).find(lang => lang.slug === slug) || null;
  try {
    const l = await prisma.language.findUnique({
      where: { slug },
    });
    if (!l) return MOCK_LANGS(isAr).find(lang => lang.slug === slug) || null;
    return {
      id: l.id,
      name: isAr ? l.nameAr : l.nameEn,
      slug: l.slug,
      code: l.code,
      popular: l.popular,
      description: isAr ? l.descriptionAr : l.descriptionEn,
    };
  } catch (err) {
    return MOCK_LANGS(isAr).find(lang => lang.slug === slug) || null;
  }
}

export async function getBranches(locale: string): Promise<LocalizedBranch[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_BRANCHES(isAr);
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { nameAr: 'asc' },
    });
    if (branches.length === 0) return MOCK_BRANCHES(isAr);
    return branches.map((b) => ({
      id: b.id,
      name: isAr ? b.nameAr : b.nameEn,
      slug: b.slug,
      address: isAr ? b.addressAr : b.addressEn,
      phone: b.phone,
      whatsapp: b.whatsapp,
      workingHours: isAr ? b.workingHoursAr : b.workingHoursEn,
      lat: b.lat,
      lng: b.lng,
      photoUrl: b.photoUrl,
      googleMapsUrl: b.googleMapsUrl,
    }));
  } catch (err) {
    return MOCK_BRANCHES(isAr);
  }
}

export async function getTeamMembers(locale: string): Promise<LocalizedTeamMember[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_TEAM(isAr);
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: [{ isLeadership: 'desc' }, { nameAr: 'asc' }],
    });
    if (team.length === 0) return MOCK_TEAM(isAr);
    return team.map((t) => ({
      id: t.id,
      name: isAr ? t.nameAr : t.nameEn,
      title: isAr ? t.titleAr : t.titleEn,
      languagePair: t.languagePair,
      yearsExperience: t.yearsExperience,
      certifications: t.certifications as string[],
      photoUrl: t.photoUrl,
      isLeadership: t.isLeadership,
      bio: isAr ? t.bioAr : t.bioEn,
    }));
  } catch (err) {
    return MOCK_TEAM(isAr);
  }
}

export async function getReviews(locale: string): Promise<LocalizedReview[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_REVIEWS(isAr);
  try {
    const reviews = await prisma.review.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
    });
    if (reviews.length === 0) return MOCK_REVIEWS(isAr);
    return reviews.map((r) => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      text: isAr ? r.textAr : r.textEn,
      serviceType: r.serviceType,
      date: r.date,
      videoUrl: r.videoUrl,
    }));
  } catch (err) {
    return MOCK_REVIEWS(isAr);
  }
}

export async function getBlogPosts(locale: string): Promise<LocalizedBlogPost[]> {
  const isAr = locale === 'ar';
  if (!isDatabaseAvailable()) {
    return ALL_BLOG_POSTS.map((p) => ({
      id: p.id,
      title: isAr ? p.title : (p.titleEn || p.title),
      slug: p.slug,
      excerpt: isAr ? p.excerpt : (p.excerptEn || p.excerpt),
      body: isAr ? p.body : (p.bodyEn || p.body),
      category: isAr ? p.category : (p.categoryEn || p.category),
      featuredImageUrl: p.featuredImageUrl,
      videoUrl: null,
      publishedAt: new Date(p.publishedAt),
      readMinutes: p.readMinutes,
      author: {
        id: p.author.id,
        name: isAr ? p.author.name : (p.author.nameEn || p.author.name),
        title: isAr ? p.author.title : (p.author.titleEn || p.author.title),
        languagePair: 'جميع اللغات',
        yearsExperience: 15,
        certifications: ['مترجم محلف', 'اعتماد جميع السفارات'],
        photoUrl: p.author.photoUrl,
        isLeadership: true,
        bio: isAr ? p.author.bio : (p.author.bioEn || p.author.bio),
      },
    }));
  }
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      include: { author: true },
    });
    if (posts.length > 0) {
      return posts.map((p) => ({
        id: p.id,
        title: isAr ? p.titleAr : (p.titleEn || p.titleAr),
        slug: p.slug,
        excerpt: isAr ? p.excerptAr : (p.excerptEn || p.excerptAr),
        body: isAr ? p.bodyAr : (p.bodyEn || p.bodyAr),
        category: isAr ? p.categoryAr : (p.categoryEn || p.categoryAr),
        featuredImageUrl: p.featuredImageUrl,
        videoUrl: p.videoUrl,
        publishedAt: p.publishedAt,
        readMinutes: p.readMinutes,
        author: {
          id: p.author.id,
          name: isAr ? p.author.nameAr : (p.author.nameEn || p.author.nameAr),
          title: isAr ? p.author.titleAr : (p.author.titleEn || p.author.titleAr),
          languagePair: p.author.languagePair,
          yearsExperience: p.author.yearsExperience,
          certifications: p.author.certifications as string[],
          photoUrl: p.author.photoUrl,
          isLeadership: p.author.isLeadership,
          bio: isAr ? p.author.bioAr : (p.author.bioEn || p.author.bioAr),
        },
      }));
    }
  } catch (err) {
    // Fallback to static audited blog dataset
  }

  return ALL_BLOG_POSTS.map((p) => ({
    id: p.id,
    title: isAr ? p.title : (p.titleEn || p.title),
    slug: p.slug,
    excerpt: isAr ? p.excerpt : (p.excerptEn || p.excerpt),
    body: isAr ? p.body : (p.bodyEn || p.body),
    category: isAr ? p.category : (p.categoryEn || p.category),
    featuredImageUrl: p.featuredImageUrl,
    videoUrl: null,
    publishedAt: new Date(p.publishedAt),
    readMinutes: p.readMinutes,
    author: {
      id: p.author.id,
      name: isAr ? p.author.name : (p.author.nameEn || p.author.name),
      title: isAr ? p.author.title : (p.author.titleEn || p.author.title),
      languagePair: 'جميع اللغات',
      yearsExperience: 15,
      certifications: ['مترجم محلف', 'اعتماد جميع السفارات'],
      photoUrl: p.author.photoUrl,
      isLeadership: true,
      bio: isAr ? p.author.bio : (p.author.bioEn || p.author.bio),
    },
  }));
}

export async function getBlogPostBySlug(slug: string, locale: string): Promise<LocalizedBlogPost | null> {
  const isAr = locale === 'ar';
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {
    decodedSlug = slug;
  }

  if (!isDatabaseAvailable()) {
    const p = ALL_BLOG_POSTS.find((pst) => pst.slug === decodedSlug || pst.slug === slug);
    if (!p) return null;

    return {
      id: p.id,
      title: isAr ? p.title : (p.titleEn || p.title),
      slug: p.slug,
      excerpt: isAr ? p.excerpt : (p.excerptEn || p.excerpt),
      body: isAr ? p.body : (p.bodyEn || p.body),
      category: isAr ? p.category : (p.categoryEn || p.category),
      featuredImageUrl: p.featuredImageUrl,
      videoUrl: null,
      publishedAt: new Date(p.publishedAt),
      readMinutes: p.readMinutes,
      author: {
        id: p.author.id,
        name: isAr ? p.author.name : (p.author.nameEn || p.author.name),
        title: isAr ? p.author.title : (p.author.titleEn || p.author.title),
        languagePair: 'جميع اللغات',
        yearsExperience: 15,
        certifications: ['مترجم محلف', 'اعتماد جميع السفارات'],
        photoUrl: p.author.photoUrl,
        isLeadership: true,
        bio: isAr ? p.author.bio : (p.author.bioEn || p.author.bio),
      },
    };
  }

  try {
    const p = await prisma.blogPost.findUnique({
      where: { slug: decodedSlug },
      include: { author: true },
    });
    if (p && p.published) {
      return {
        id: p.id,
        title: isAr ? p.titleAr : (p.titleEn || p.titleAr),
        slug: p.slug,
        excerpt: isAr ? p.excerptAr : (p.excerptEn || p.excerptAr),
        body: isAr ? p.bodyAr : (p.bodyEn || p.bodyAr),
        category: isAr ? p.categoryAr : (p.categoryEn || p.categoryAr),
        featuredImageUrl: p.featuredImageUrl,
        videoUrl: p.videoUrl,
        publishedAt: p.publishedAt,
        readMinutes: p.readMinutes,
        author: {
          id: p.author.id,
          name: isAr ? p.author.nameAr : (p.author.nameEn || p.author.nameAr),
          title: isAr ? p.author.titleAr : (p.author.titleEn || p.author.titleAr),
          languagePair: p.author.languagePair,
          yearsExperience: p.author.yearsExperience,
          certifications: p.author.certifications as string[],
          photoUrl: p.author.photoUrl,
          isLeadership: p.author.isLeadership,
          bio: isAr ? p.author.bioAr : (p.author.bioEn || p.author.bioAr),
        },
      };
    }
  } catch (err) {
    // Fallback to static audited blog dataset
  }

  const p = ALL_BLOG_POSTS.find((pst) => pst.slug === decodedSlug || pst.slug === slug);
  if (!p) return null;

  return {
    id: p.id,
    title: isAr ? p.title : (p.titleEn || p.title),
    slug: p.slug,
    excerpt: isAr ? p.excerpt : (p.excerptEn || p.excerpt),
    body: isAr ? p.body : (p.bodyEn || p.body),
    category: isAr ? p.category : (p.categoryEn || p.category),
    featuredImageUrl: p.featuredImageUrl,
    videoUrl: null,
    publishedAt: new Date(p.publishedAt),
    readMinutes: p.readMinutes,
    author: {
      id: p.author.id,
      name: isAr ? p.author.name : (p.author.nameEn || p.author.name),
      title: isAr ? p.author.title : (p.author.titleEn || p.author.title),
      languagePair: 'جميع اللغات',
      yearsExperience: 15,
      certifications: ['مترجم محلف', 'اعتماد جميع السفارات'],
      photoUrl: p.author.photoUrl,
      isLeadership: true,
      bio: isAr ? p.author.bio : (p.author.bioEn || p.author.bio),
    },
  };
}

export function getRawBlogPostBySlug(slug: string): BlogPostItem | undefined {
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {
    decodedSlug = slug;
  }
  return ALL_BLOG_POSTS.find((p) => p.slug === decodedSlug || p.slug === slug);
}

export async function getFAQs(
  filterType: 'homepage' | 'service' | 'document' | 'embassy' | 'govEntity' | 'blogPost' | 'language',
  id?: string,
  locale?: string
): Promise<LocalizedFAQ[]> {
  const isAr = !locale || locale === 'ar';
  if (!isDatabaseAvailable()) return MOCK_FAQS(isAr);
  try {
    const whereClause: any = {};
    
    if (filterType === 'homepage') {
      whereClause.homepage = true;
    } else if (filterType === 'service') {
      whereClause.serviceId = id;
    } else if (filterType === 'document') {
      whereClause.documentId = id;
    } else if (filterType === 'embassy') {
      whereClause.embassyId = id;
    } else if (filterType === 'govEntity') {
      whereClause.govEntityId = id;
    } else if (filterType === 'blogPost') {
      whereClause.blogPostId = id;
    } else if (filterType === 'language') {
      whereClause.languageId = id;
    }

    const faqs = await prisma.fAQ.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
    });
    if (faqs.length === 0) return MOCK_FAQS(isAr);
    return faqs.map((f) => ({
      id: f.id,
      question: isAr ? f.questionAr : f.questionEn,
      answer: isAr ? f.answerAr : f.answerEn,
      sortOrder: f.sortOrder,
    }));
  } catch (err) {
    return MOCK_FAQS(isAr);
  }
}
