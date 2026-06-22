/**
 * Seed script — inserts the 10 default Mariah Coirs products into the database.
 * Run with:  npx ts-node --transpile-only src/seed.ts
 */

import { prisma } from './config/prisma';

const products = [
  {
    name: 'Coco Peat Blocks 5kg',
    sku: 'MC-COCO-001',
    category: 'Cocopeat',
    moq: '1 × 20ft FCL',
    status: 'Published',
    description:
      'Premium compressed coco peat blocks — ideal for nurseries, hydroponic growers and greenhouse farming worldwide.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'EC',    value: '< 0.5 mS/cm' },
      { label: 'pH',    value: '5.8 – 6.5'   },
      { label: 'Ratio', value: '5:1 compress' },
    ]),
  },
  {
    name: 'Low EC Coco Peat Blocks',
    sku: 'MC-COCO-002',
    category: 'Cocopeat',
    moq: '1 × 20ft FCL',
    status: 'Published',
    description:
      'Washed and buffered for superior electrical conductivity — perfect for propagation and modern soilless crops.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'EC',       value: '< 0.3 mS/cm' },
      { label: 'pH',       value: '5.8 – 6.2'   },
      { label: 'Moisture', value: '< 15%'        },
    ]),
  },
  {
    name: 'High EC Coco Peat Blocks',
    sku: 'MC-COCO-003',
    category: 'Cocopeat',
    moq: '1 × 20ft FCL',
    status: 'Published',
    description:
      'Concentrated nutrient-retaining substrate for substrate and soil-climate agriculture applications.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'EC',       value: '> 1.5 mS/cm' },
      { label: 'pH',       value: '6.0 – 6.8'   },
      { label: 'Water HC', value: '≥ 750 ml/L'  },
    ]),
  },
  {
    name: 'Coco Peat Briquettes',
    sku: 'MC-COCO-004',
    category: 'Cocopeat',
    moq: '5,000 pcs / order',
    status: 'Published',
    description:
      'Compact mini-briquettes for nurseries, hobby growers and small commercial operations. Retail-pack ready.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'Weight',    value: '650 g'     },
      { label: 'Expansion', value: '≥ 10 L'    },
      { label: 'pH',        value: '5.8 – 6.5' },
    ]),
  },
  {
    name: 'Coir Pith Blocks',
    sku: 'MC-COCO-005',
    category: 'Cocopeat',
    moq: '1 × 20ft FCL',
    status: 'Published',
    description:
      'Fine-grade pith blocks for soil amendment, mulching and organic farming applications worldwide.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'EC',       value: '< 1.0 mS/cm' },
      { label: 'pH',       value: '5.7 – 6.4'   },
      { label: 'Moisture', value: '< 20%'        },
    ]),
  },
  {
    name: 'Coconut Coir Fibre',
    sku: 'MC-FIBRE-001',
    category: 'Coir Fibre',
    moq: '1 × 20ft FCL',
    status: 'Published',
    description:
      'Long-strand coconut fibre extracted from mature husks — used in erosion control, geotextiles and horticulture.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'Length',   value: '15 – 35 cm'  },
      { label: 'Moisture', value: '< 20%'        },
      { label: 'Colour',   value: 'Brown / Gold' },
    ]),
  },
  {
    name: 'Coir Fibre Bales',
    sku: 'MC-FIBRE-002',
    category: 'Coir Fibre',
    moq: '1 × 40ft FCL',
    status: 'Published',
    description:
      'Machine-pressed bales for bulk export. Ideal for mattress, brush, and geotextile manufacturing industries.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'Weight',  value: '100 – 120 kg' },
      { label: 'Density', value: '105 kg/m³'    },
      { label: 'Grade',   value: 'Brown Fibre'  },
    ]),
  },
  {
    name: 'Coconut Husk Chips',
    sku: 'MC-GROW-001',
    category: 'Grow Media',
    moq: '1 × 20ft FCL',
    status: 'Published',
    description:
      'Chunky coir husk chips with excellent aeration — the preferred substrate for orchids and tropical plants.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'Chip Size', value: '8 – 18 mm'   },
      { label: 'EC',        value: '< 0.8 mS/cm' },
      { label: 'pH',        value: '5.8 – 6.8'   },
    ]),
  },
  {
    name: 'Coir Grow Media Bags',
    sku: 'MC-GROW-002',
    category: 'Grow Media',
    moq: '1 × 40ft FCL',
    status: 'Published',
    description:
      'Ready-to-use grow slabs and bags engineered for high-wire tomato, cucumber and pepper production systems.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'Size',     value: '100×15×10 cm' },
      { label: 'EC',       value: '< 0.5 mS/cm'  },
      { label: 'Porosity', value: '≥ 95%'         },
    ]),
  },
  {
    name: 'Custom Export Packaging',
    sku: 'MC-CUSTOM-001',
    category: 'Custom',
    moq: '1 × 20ft FCL',
    status: 'Published',
    description:
      'White-label and OEM packing solutions for international distributors. Bulk, retail, and private-label options.',
    images: JSON.stringify([]),
    specs: JSON.stringify([
      { label: 'MOQ',      value: '1 × 20ft FCL'  },
      { label: 'Label',    value: 'Custom / OEM'   },
      { label: 'Shipping', value: 'Ex-Works / FOB' },
    ]),
  },
];

async function main() {
  console.log('🌱 Seeding products...\n');

  let inserted = 0;
  let skipped  = 0;

  for (const p of products) {
    try {
      await prisma.product.create({ data: p });
      console.log(`  ✅ Created: ${p.name} (${p.sku})`);
      inserted++;
    } catch (err: any) {
      // Unique constraint on SKU — already exists, skip silently
      if (err?.code === 'P2002') {
        console.log(`  ⏭  Skipped (already exists): ${p.name} (${p.sku})`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`\n✔ Done — ${inserted} inserted, ${skipped} skipped.\n`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
