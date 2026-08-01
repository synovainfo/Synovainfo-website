import { prisma } from './src/lib/prisma';

async function fixDbSections() {
  const sections = [
    'hero',
    'trust-bar',
    'transformation-showcase',
    'services',
    'industries',
    'process',
    'why-synova',
    'technologies',
    'case-studies',
    'testimonials',
    'stats',
    'insights',
    'about',
    'core-values',
    'careers',
    'clients',
    'cta',
    'contact'
  ];

  for (let i = 0; i < sections.length; i++) {
    const sectionType = sections[i];
    
    // Upsert section to ensure it exists and is visible
    const existing = await prisma.homepageSection.findFirst({
      where: { sectionType }
    });

    if (existing) {
      await prisma.homepageSection.update({
        where: { id: existing.id },
        data: { order: i, isVisible: true }
      });
    } else {
      await prisma.homepageSection.create({
        data: {
          title: sectionType,
          sectionType,
          order: i,
          isVisible: true,
          content: {},
          settings: {}
        }
      });
    }
  }

  // Delete any sections not in this list
  await prisma.homepageSection.deleteMany({
    where: { sectionType: { notIn: sections } }
  });

  console.log("DB sections fixed successfully!");
}

fixDbSections().catch(console.error).finally(() => prisma.$disconnect());
