import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ── Seed Admin ──────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@mariahcoirs.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'AdminMariah2026!';

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPw = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({ data: { email: adminEmail, password: hashedPw } });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // ── Seed Sample Blogs ───────────────────────────────────────────
  const blogCount = await prisma.blog.count();
  if (blogCount === 0) {
    await prisma.blog.createMany({
      data: [
        {
          title: 'Benefits of Coco Peat for Hydroponics',
          slug: 'benefits-of-coco-peat-for-hydroponics',
          metaTitle: 'Coco Peat for Hydroponics | Mariah Coirs',
          metaDescription: 'Discover why coco peat is the preferred growing medium for hydroponic farmers worldwide. Learn about its benefits, EC levels, and ideal applications.',
          shortDescription: 'Coco peat is the ideal growing medium for hydroponic systems, offering superior water retention, excellent aeration, and sustainable sourcing.',
          content: `<h2>Why Coco Peat is the Preferred Growing Medium</h2>
<p>Coco peat (also called coir pith) has become the go-to growing medium for hydroponic growers worldwide. Sourced from the fibrous husks of coconuts, it offers a sustainable, renewable alternative to peat moss or rockwool.</p>

<h3>Key Benefits</h3>
<ul>
<li><strong>Superior Water Retention</strong> – Holds 8-9 times its weight in water while maintaining excellent drainage.</li>
<li><strong>Ideal pH Range</strong> – Naturally buffered between 5.5 and 6.5, perfect for most crops.</li>
<li><strong>Excellent Aeration</strong> – High air-filled porosity promotes healthy root development.</li>
<li><strong>Biodegradable &amp; Sustainable</strong> – 100% natural and eco-friendly.</li>
<li><strong>Low EC Availability</strong> – Buffered and washed coco peat is ready for sensitive crops like strawberries and herbs.</li>
</ul>

<h3>Mariah Coirs Low EC Coco Peat</h3>
<p>Our export-grade low EC coco peat is triple-washed and buffer-treated to ensure EC levels below 0.5 mS/cm. This makes it suitable for the most demanding hydroponic operations in Europe, North America, and Australia.</p>`,
          isPublished: true,
        },
        {
          title: 'Understanding EC and pH in Coco Peat Products',
          slug: 'understanding-ec-and-ph-in-coco-peat',
          metaTitle: 'EC and pH in Coco Peat | Mariah Coirs Export',
          metaDescription: 'Understand how EC and pH values in coco peat affect plant growth and why proper washing and buffering is critical for export-grade products.',
          shortDescription: 'Learn why EC and pH measurements are critical quality indicators in coco peat exports, and how Mariah Coirs maintains world-class quality standards.',
          content: `<h2>EC and pH: The Quality Markers of Coco Peat</h2>
<p>When sourcing coco peat for commercial growing, two parameters matter most: Electrical Conductivity (EC) and pH. These directly influence nutrient availability and plant health.</p>

<h3>What is EC in Coco Peat?</h3>
<p>EC measures the salt content in the growing medium. High EC indicates excess salts that can block nutrient uptake. Premium export-grade coco peat should have EC below 1.0 mS/cm, ideally below 0.5 for sensitive crops.</p>

<h3>Our Multi-Cycle Washing Process</h3>
<p>At Mariah Coirs, all export-grade coco peat undergoes a rigorous 3-cycle washing process followed by lab testing. Each batch is certified with a physical analysis report including EC, pH, and moisture content.</p>`,
          isPublished: true,
        },
        {
          title: 'Coir Grow Bags for Greenhouse Horticulture',
          slug: 'coir-grow-bags-greenhouse-horticulture',
          metaTitle: 'Coir Grow Bags for Greenhouse | Mariah Coirs',
          metaDescription: 'Premium coir grow bags for greenhouse tomatoes, cucumbers, and peppers. Learn how to select the right density and volume for your crop.',
          shortDescription: 'Explore our range of premium coir grow bags engineered for high-yield greenhouse production of tomatoes, cucumbers, peppers, and berries.',
          content: `<h2>Coir Grow Bags: The Greenhouse Standard</h2>
<p>Coir grow bags have replaced rockwool as the preferred growing substrate in high-tech greenhouse operations across Europe, North America, and Australia. Their superior drainage, reusability, and organic certification make them ideal for modern agriculture.</p>

<h3>Why Choose Mariah Coirs Grow Bags?</h3>
<p>Our grow bags are manufactured from premium, triple-washed coir pith with controlled density and air-filled porosity. Each bag is filled to consistent weights and sealed under strict quality control.</p>`,
          isPublished: false,
        },
      ],
    });
    console.log('✅ Sample blogs seeded (3 posts)');
  } else {
    console.log(`ℹ️  Blogs already seeded (${blogCount} exist)`);
  }

  // ── Seed Sample Enquiries ───────────────────────────────────────
  const enquiryCount = await prisma.enquiry.count();
  if (enquiryCount === 0) {
    await prisma.enquiry.createMany({
      data: [
        {
          name: 'John Smith',
          companyName: 'GreenGrow BV',
          email: 'john@greengrow.nl',
          phone: '+31 6 12345678',
          country: 'Netherlands',
          productInterested: 'Coco Peat Blocks 5kg',
          quantity: '2 × 40ft FCL',
          message: 'We are looking for a reliable supplier of low EC coco peat. Please share your latest price list and lab reports.',
          sourcePage: 'Products Page',
        },
        {
          name: 'Maria Garcia',
          companyName: 'HortiWorld Spain',
          email: 'maria@hortiworld.es',
          phone: '+34 612 345678',
          country: 'Spain',
          productInterested: 'Coir Grow Bags',
          quantity: '500 bags per month',
          message: 'Interested in coir grow bags for our greenhouse tomato operation. Need minimum 500 units/month.',
          sourcePage: 'Contact Form',
        },
      ],
    });
    console.log('✅ Sample enquiries seeded (2 entries)');
  } else {
    console.log(`ℹ️  Enquiries already seeded (${enquiryCount} exist)`);
  }

  console.log('\n🌱 Seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
