const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBranches() {
  console.log('Connecting to database to update branches data...');

  const branchesData = [
    {
      id: 'branch-giza-main',
      slug: 'giza-headquarters',
      nameAr: 'الجيزة – المقر الرئيسي',
      nameEn: 'Giza – Head Office',
      addressAr: '1 شارع جامعة القاهرة، مكتب 29، الدور الثامن، أعلى عمر أفندي، الجيزة.',
      addressEn: '1 Cairo University St., Office 29, 8th Floor, Above Omar Effendi, Giza, Egypt.',
      phone: '01062990808',
      whatsapp: '+20 106 299 0808',
      workingHoursAr: 'السبت - الخميس: 9:00 ص - 9:00 م',
      workingHoursEn: 'Saturday - Thursday: 9:00 AM - 9:00 PM',
      lat: 30.0131,
      lng: 31.2089,
      photoUrl: null,
      googleMapsUrl: 'https://maps.google.com/?q=1+Cairo+University+St,+Giza,+Egypt+Globalize+Group'
    },
    {
      id: 'branch-dokki',
      slug: 'dokki-branch',
      nameAr: 'الدقي – الجيزة',
      nameEn: 'Dokki Branch – Giza',
      addressAr: '2 ب شارع عكاشة، الدور الخامس، بجوار مأمورية الشهر العقاري، الدقي، الجيزة.',
      addressEn: '2B Okasha St., 5th Floor, Next to Real Estate Registry Office, Dokki, Giza, Egypt.',
      phone: '01062990808',
      whatsapp: '+20 106 299 0808',
      workingHoursAr: 'السبت - الخميس: 9:00 ص - 9:00 م',
      workingHoursEn: 'Saturday - Thursday: 9:00 AM - 9:00 PM',
      lat: 30.0385,
      lng: 31.2123,
      photoUrl: null,
      googleMapsUrl: 'https://maps.google.com/?q=2B+Okasha+St,+Dokki,+Giza,+Egypt+Globalize+Group'
    },
    {
      id: 'branch-haram',
      slug: 'haram-branch',
      nameAr: 'الهرم – الجيزة',
      nameEn: 'Haram Branch – Giza',
      addressAr: '6 شارع أيوب، متفرع من شارع الهرم، بجوار كايرو مول، الهرم، الجيزة.',
      addressEn: '6 Ayoub St., Off Haram St., Next to Cairo Mall, Haram, Giza, Egypt.',
      phone: '01062990808',
      whatsapp: '+20 106 299 0808',
      workingHoursAr: 'السبت - الخميس: 9:00 ص - 9:00 م',
      workingHoursEn: 'Saturday - Thursday: 9:00 AM - 9:00 PM',
      lat: 29.9986,
      lng: 31.1756,
      photoUrl: null,
      googleMapsUrl: 'https://maps.google.com/?q=6+Ayoub+St,+Haram,+Giza,+Egypt+Globalize+Group'
    },
    {
      id: 'branch-salah-salem',
      slug: 'salah-salem-branch',
      nameAr: 'صلاح سالم – مصر الجديدة (عمارات العبور)',
      nameEn: 'Salah Salem Branch – Heliopolis (Al-Obour Bldgs)',
      addressAr: 'عمارة 31، مكتب 4، عمارات العبور، شارع صلاح سالم، القاهرة.',
      addressEn: 'Building 31, Office 4, Al-Obour Buildings, Salah Salem St., Heliopolis, Cairo, Egypt.',
      phone: '01062990808',
      whatsapp: '+20 106 299 0808',
      workingHoursAr: 'السبت - الخميس: 9:00 ص - 9:00 م',
      workingHoursEn: 'Saturday - Thursday: 9:00 AM - 9:00 PM',
      lat: 30.0732,
      lng: 31.3115,
      photoUrl: null,
      googleMapsUrl: 'https://maps.google.com/?q=Building+31+Al-Obour+Buildings,+Salah+Salem+St,+Cairo,+Egypt+Globalize+Group'
    }
  ];

  // Clear existing branches and re-insert fresh
  await prisma.branch.deleteMany({});

  for (const b of branchesData) {
    await prisma.branch.create({
      data: b
    });
    console.log(`Created branch: ${b.nameAr} (${b.nameEn})`);
  }

  console.log('All 4 branches synchronized into Neon Database successfully!');

  // Update siteSettings addresses
  await prisma.siteSetting.upsert({
    where: { key: 'address_ar' },
    update: { value: '1 شارع جامعة القاهرة، مكتب 29، الدور الثامن، أعلى عمر أفندي، الجيزة' },
    create: { key: 'address_ar', value: '1 شارع جامعة القاهرة، مكتب 29، الدور الثامن، أعلى عمر أفندي، الجيزة' }
  });
  await prisma.siteSetting.upsert({
    where: { key: 'address_en' },
    update: { value: '1 Cairo University St., Office 29, 8th Floor, Above Omar Effendi, Giza, Egypt' },
    create: { key: 'address_en', value: '1 Cairo University St., Office 29, 8th Floor, Above Omar Effendi, Giza, Egypt' }
  });
  console.log('Site settings addresses updated in Neon DB!');
}

updateBranches()
  .catch((e) => {
    console.error('Error updating branches:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
