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
  const blogSeeds = [
    {
      title: 'Low-EC Coco Peat: What Export Buyers Actually Test',
      slug: 'low-ec-coco-peat-export-tests',
      metaTitle: 'Low-EC Coco Peat Export Tests | Mariah Coirs',
      metaDescription: 'A practical guide to EC, pH, moisture, and compression testing for export-grade coco peat and coir pith products.',
      focusKeywords: 'low EC coco peat, export quality tests, coco peat EC, coir pith testing',
      shortDescription: 'Understand the exact quality checkpoints buyers use when approving low-EC coco peat for greenhouse and hydroponic programs.',
      category: 'Quality Control',
      tags: 'cocopeat, EC testing, pH, quality control, export',
      authorName: 'Ananya Iyer',
      authorRole: 'Quality & Lab Lead',
      authorBio: 'Ananya manages wash, buffer, and testing protocols for export-grade coco peat. She focuses on repeatable quality checks that growers can trust.',
      featuredImage: '/mariahcoirs/raw_material.jpeg',
      featuredImageAlt: 'Workers preparing raw coconut material for low-EC coco peat processing',
      canonicalUrl: 'https://www.mariahcoirsexport.com/blog/low-ec-coco-peat-export-tests',
      publishedAt: new Date('2026-06-24T09:00:00.000Z'),
      isPublished: true,
      content: `# Low-EC Coco Peat: What Export Buyers Actually Test

Buyers rarely approve coco peat because of a single spec sheet line. They look for consistency across **EC, pH, moisture, compression ratio, and particle structure**. A batch that looks perfect on paper can still fail if the wash cycle, buffering, or packaging is not controlled.

## 1. Electrical Conductivity matters first

EC reveals how much soluble salt remains in the substrate. For sensitive crops, buyers often want:

- low EC under 0.5 mS/cm after hydration
- predictable readings from bag to bag
- a clean lab report tied to the batch number

## 2. pH and buffering need to match the crop

Most greenhouse crops perform well in a slightly acidic range. The right buffering process keeps the root zone stable after the grower rehydrates the block or grow bag.

> A good coco peat supplier does not just lower the EC. They make the reading repeatable after compression, transport, and hydration.

## 3. Moisture content affects shipping and storage

Buyers watch moisture because it changes weight, storage behavior, and the shelf life of the product. Too dry and dust increases. Too wet and the product can deform in the container.

## 4. The final approval checklist

Export buyers usually want:

1. batch-level COA or lab sheet
2. moisture and expansion data
3. compression ratio and dimensions
4. packaging photos and pallet configuration
5. a consistent point of contact for re-orders

When these five checkpoints stay stable, repeat orders usually follow quickly.`,
    },
    {
      title: 'How Coir Fibre Improves Water Management in Greenhouse Beds',
      slug: 'coir-fibre-water-management-greenhouse-beds',
      metaTitle: 'Coir Fibre Water Management in Greenhouse Beds | Mariah Coirs',
      metaDescription: 'Learn how coir fibre and coir pith improve water distribution, root aeration, and crop uniformity inside modern greenhouse beds.',
      focusKeywords: 'coir fibre water management, greenhouse beds, root aeration, coir fibre',
      shortDescription: 'Coir fibre is more than filler material. It shapes the water profile of greenhouse beds and keeps roots supplied with oxygen.',
      category: 'Greenhouse Growing',
      tags: 'coir fibre, greenhouse, water management, root zone, crop uniformity',
      authorName: 'Rohan Menon',
      authorRole: 'Agronomy Specialist',
      authorBio: 'Rohan advises greenhouse growers on substrate structure, irrigation timing, and root-zone performance across tropical and temperate crops.',
      featuredImage: '/mariahcoirs/coir_group.jpeg',
      featuredImageAlt: 'Coir fibre bundles ready for substrate blending',
      canonicalUrl: 'https://www.mariahcoirsexport.com/blog/coir-fibre-water-management-greenhouse-beds',
      publishedAt: new Date('2026-06-11T08:30:00.000Z'),
      isPublished: true,
      content: `# How Coir Fibre Improves Water Management in Greenhouse Beds

Coir fibre gives greenhouse substrates a structure that holds water while still leaving room for air. That balance matters because roots do not grow well in a medium that is permanently saturated.

## Why the fibre fraction matters

Long fibres improve the physical structure of the bed by creating channels that let excess water drain while the finer fraction holds moisture for later use.

### Practical outcomes for growers

- better drainage after heavy irrigation
- more oxygen available at the root zone
- fewer swings between dry and saturated media

## Matching fibre with coco peat

The best blends are not the same for every crop. Tomatoes, cucumbers, strawberries, and peppers all respond differently to substrate density and water-holding capacity.

## Irrigation gets easier when the substrate is stable

When the media has a predictable structure, growers can program irrigation more accurately and reduce waste. That often leads to more even fruit set and a cleaner harvest window.

## What to ask your supplier

Before you place a container order, ask for:

1. fibre length range
2. dust percentage
3. moisture target
4. recommended mix ratio with coco peat
5. packing density

Those five details determine how the bed behaves once it reaches the greenhouse.`,
    },
    {
      title: 'Inside a Modern Coir Plant: From Husk to Compression Block',
      slug: 'modern-coir-plant-husk-to-compression-block',
      metaTitle: 'Inside a Modern Coir Plant | Mariah Coirs',
      metaDescription: 'A step-by-step look at how coconut husk becomes washed, dried, screened, and compressed into export-ready coir blocks.',
      focusKeywords: 'modern coir plant, coconut husk processing, coir block production, export ready coir',
      shortDescription: 'See how raw coconut husk moves through cutting, washing, drying, screening, and compression before it is packed for export.',
      category: 'Processing',
      tags: 'processing, coir blocks, coconut husk, compression, manufacturing',
      authorName: 'Mariah Coirs Research Desk',
      authorRole: 'Process Engineering Team',
      authorBio: 'The research desk documents production flow, machine settings, and packing standards used across the Mariah Coirs facility.',
      featuredImage: '/mariahcoirs/process.jpeg',
      featuredImageAlt: 'Industrial coir processing line inside a modern plant',
      canonicalUrl: 'https://www.mariahcoirsexport.com/blog/modern-coir-plant-husk-to-compression-block',
      publishedAt: new Date('2026-05-29T09:15:00.000Z'),
      isPublished: true,
      content: `# Inside a Modern Coir Plant: From Husk to Compression Block

People often imagine coir production as a simple drying operation. In practice, the workflow is closer to a controlled manufacturing line where each stage affects the next.

## Step 1: Raw material reception

The process begins with sorted husk arriving at the yard. Material quality, moisture level, and contamination are checked before the batch is accepted.

## Step 2: Cutting and separation

The husk is cut so the fibre and pith can be separated efficiently. This stage determines how much dust, fibre, and chip fraction end up in the final blend.

## Step 3: Washing and drying

The washed material is dried to a controlled moisture level. If the product dries unevenly, compression performance and expansion ratio become inconsistent.

## Step 4: Screening and blending

Screening removes oversize material while blending creates the texture the grower expects. The goal is consistency, not just volume.

## Step 5: Compression and packing

The final block must be dense enough for export but still expand properly on hydration. Packaging and palletization then protect the product during transit.

## Why this matters to buyers

The plant process is what makes the lab report believable. When the workflow is repeatable, buyers can plan storage, irrigation, and crop cycles with much more confidence.`,
    },
    {
      title: 'Choosing the Right Grow Bag Density for Tomatoes, Cucumbers, and Strawberries',
      slug: 'choosing-right-grow-bag-density',
      metaTitle: 'Choosing Grow Bag Density | Mariah Coirs',
      metaDescription: 'A grower-focused guide to choosing coir grow bag density and volume for tomato, cucumber, and strawberry production.',
      focusKeywords: 'grow bag density, coir grow bags, tomatoes, cucumbers, strawberries',
      shortDescription: 'Grow bag density changes irrigation behavior, root spread, and crop stability. Here is how to select the right range.',
      category: 'Hydroponics',
      tags: 'grow bags, hydroponics, tomatoes, cucumbers, strawberries',
      authorName: 'Meera Suresh',
      authorRole: 'Hydroponic Systems Advisor',
      authorBio: 'Meera works with protected-cultivation growers to tune substrate density, irrigation frequency, and root-zone performance.',
      featuredImage: '/mariahcoirs/package_unit.jpg',
      featuredImageAlt: 'Packed coir grow bags prepared for greenhouse shipment',
      canonicalUrl: 'https://www.mariahcoirsexport.com/blog/choosing-right-grow-bag-density',
      publishedAt: new Date('2026-05-18T07:45:00.000Z'),
      isPublished: true,
      content: `# Choosing the Right Grow Bag Density for Tomatoes, Cucumbers, and Strawberries

Grow bag density is not just a manufacturing number. It changes how quickly water moves, how much air stays in the root zone, and how reliably the crop responds to fertigation.

## Tomatoes

Tomato crops usually prefer a stable medium with enough structure to support a long season. A medium-density bag often gives the best balance between drainage and moisture reserve.

## Cucumbers

Cucumber roots are fast and responsive. They need a media that drains cleanly after each irrigation pulse so the root zone does not stay saturated.

## Strawberries

Strawberry production demands precision. A low-salt, consistent bag with balanced water retention helps berries stay uniform through the season.

## A simple selection rule

When comparing products, ask three questions:

1. How fast does the bag rehydrate?
2. How much water stays available after drainage?
3. Does the density remain stable across the entire pallet?

If the answers are consistent, irrigation planning becomes much easier and crop variation drops.

## Closing note

The right grow bag is the one that matches the crop, climate, and irrigation strategy. Density is the starting point, not the final decision.`,
    },
    {
      title: 'Export Checklist for Cocopeat Shipments: Moisture, Compression, and Documentation',
      slug: 'export-checklist-cocopeat-shipments',
      metaTitle: 'Cocopeat Export Checklist | Mariah Coirs',
      metaDescription: 'A practical checklist covering moisture, compression, pallet patterns, labeling, and documents for cocopeat export shipments.',
      focusKeywords: 'cocopeat export checklist, moisture control, pallet documentation, compressed blocks',
      shortDescription: 'Use this checklist to reduce delays, protect quality, and keep your cocopeat containers export-ready from day one.',
      category: 'Export Logistics',
      tags: 'export, documentation, moisture, compression, shipping',
      authorName: 'Karthik Raj',
      authorRole: 'Export Operations Manager',
      authorBio: 'Karthik coordinates container bookings, packing rules, and documentation so every export batch leaves the port correctly prepared.',
      featuredImage: '/mariahcoirs/machine_pack.jpg',
      featuredImageAlt: 'Packed cocopeat products loaded for export shipment',
      canonicalUrl: 'https://www.mariahcoirsexport.com/blog/export-checklist-cocopeat-shipments',
      publishedAt: new Date('2026-04-30T10:00:00.000Z'),
      isPublished: true,
      content: `# Export Checklist for Cocopeat Shipments: Moisture, Compression, and Documentation

The export side of cocopeat is where many shipments lose time. Delays usually come from small details such as moisture drift, pallet labeling, or missing batch paperwork.

## Before the truck arrives

- confirm final moisture target
- verify block or bag count against the order
- check that each pallet is labeled with the correct batch and product code

## During packing

Compression should stay consistent throughout the container. If one pallet expands differently from the others, the buyer will notice immediately.

## Documentation buyers expect

Most buyers want:

1. commercial invoice
2. packing list
3. certificate of origin
4. product specification sheet
5. lab or batch report

## Container loading tips

Keep the load pattern balanced and make sure moisture-sensitive packs are not exposed to condensation. Small gaps, proper pallet wrap, and clean stacking all matter.

## Final review before dispatch

The final sign-off should answer one question: would you be comfortable opening this container in front of the customer? If the answer is yes, the shipment is ready.`,
    },
  ];

  for (const blog of blogSeeds) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      create: blog,
      update: blog,
    });
  }
  console.log('✅ Sample blogs seeded (5 posts upserted)');

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
