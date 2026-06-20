import { useState, useMemo, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import type { Variants } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────
type FilterKey = 'all' | 'coco-blocks' | 'grow-media' | 'coir-fibre' | 'custom';

interface Spec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: FilterKey[];
  specs: Spec[];
}

// ─── Filter Pills ─────────────────────────────────────────────────
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',         label: 'All Products' },
  { key: 'coco-blocks', label: 'Coco Blocks'  },
  { key: 'grow-media',  label: 'Grow Media'   },
  { key: 'coir-fibre',  label: 'Coir Fibre'   },
  { key: 'custom',      label: 'Custom'        },
];

// ─── Product Catalogue ────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 'coco-peat-block-5kg',
    name: 'Coco Peat Blocks 5kg',
    description:
      'Premium compressed coco peat blocks — ideal for nurseries, hydroponic growers and greenhouse farming worldwide.',
    image: '/mariahcoirs/coco_block.jpeg',
    category: ['coco-blocks', 'grow-media'],
    specs: [
      { label: 'EC',    value: '< 0.5 mS/cm' },
      { label: 'pH',    value: '5.8 – 6.5'   },
      { label: 'Ratio', value: '5:1 compress' },
    ],
  },
  {
    id: 'low-ec-coco-peat',
    name: 'Low EC Coco Peat Blocks',
    description:
      'Washed and buffered for superior electrical conductivity — perfect for propagation and modern soilless crops.',
    image: '/mariahcoirs/coco_husk_cutted.jpg',
    category: ['coco-blocks'],
    specs: [
      { label: 'EC',       value: '< 0.3 mS/cm' },
      { label: 'pH',       value: '5.8 – 6.2'   },
      { label: 'Moisture', value: '< 15%'        },
    ],
  },
  {
    id: 'high-ec-coco-peat',
    name: 'High EC Coco Peat Blocks',
    description:
      'Concentrated nutrient-retaining substrate for substrate and soil-climate agriculture applications.',
    image: '/mariahcoirs/coco_husk.jpg',
    category: ['coco-blocks'],
    specs: [
      { label: 'EC',       value: '> 1.5 mS/cm' },
      { label: 'pH',       value: '6.0 – 6.8'   },
      { label: 'Water HC', value: '≥ 750 ml/L'  },
    ],
  },
  {
    id: 'coco-peat-briquettes',
    name: 'Coco Peat Briquettes',
    description:
      'Compact mini-briquettes for nurseries, hobby growers and small commercial operations. Retail-pack ready.',
    image: '/mariahcoirs/coco_block_person.jpeg',
    category: ['coco-blocks', 'custom'],
    specs: [
      { label: 'Weight',    value: '650 g'        },
      { label: 'Expansion', value: '≥ 10 L'       },
      { label: 'pH',        value: '5.8 – 6.5'    },
    ],
  },
  {
    id: 'coir-pith-blocks',
    name: 'Coir Pith Blocks',
    description:
      'Fine-grade pith blocks for soil amendment, mulching and organic farming applications worldwide.',
    image: '/mariahcoirs/block_machine.jpeg',
    category: ['coco-blocks', 'grow-media'],
    specs: [
      { label: 'EC',        value: '< 1.0 mS/cm' },
      { label: 'pH',        value: '5.7 – 6.4'   },
      { label: 'Moisture',  value: '< 20%'        },
    ],
  },
  {
    id: 'coconut-fibre',
    name: 'Coconut Coir Fibre',
    description:
      'Long-strand coconut fibre extracted from mature husks — used in erosion control, geotextiles and horticulture.',
    image: '/mariahcoirs/process.jpeg',
    category: ['coir-fibre'],
    specs: [
      { label: 'Length',   value: '15 – 35 cm'  },
      { label: 'Moisture', value: '< 20%'        },
      { label: 'Colour',   value: 'Brown / Gold' },
    ],
  },
  {
    id: 'coir-fibre-bales',
    name: 'Coir Fibre Bales',
    description:
      'Machine-pressed bales for bulk export. Ideal for mattress, brush, and geotextile manufacturing industries.',
    image: '/mariahcoirs/machine_process.jpeg',
    category: ['coir-fibre'],
    specs: [
      { label: 'Weight',  value: '100 – 120 kg' },
      { label: 'Density', value: '105 kg/m³'    },
      { label: 'Grade',   value: 'Brown Fibre'  },
    ],
  },
  {
    id: 'husk-chips',
    name: 'Coconut Husk Chips',
    description:
      'Chunky coir husk chips with excellent aeration — the preferred substrate for orchids and tropical plants.',
    image: '/mariahcoirs/dry_process.jpeg',
    category: ['grow-media'],
    specs: [
      { label: 'Chip Size', value: '8 – 18 mm'   },
      { label: 'EC',        value: '< 0.8 mS/cm' },
      { label: 'pH',        value: '5.8 – 6.8'   },
    ],
  },
  {
    id: 'coir-grow-bags',
    name: 'Coir Grow Media Bags',
    description:
      'Ready-to-use grow slabs and bags engineered for high-wire tomato, cucumber and pepper production systems.',
    image: '/mariahcoirs/bed.jpeg',
    category: ['grow-media'],
    specs: [
      { label: 'Size',     value: '100×15×10 cm' },
      { label: 'EC',       value: '< 0.5 mS/cm'  },
      { label: 'Porosity', value: '≥ 95%'         },
    ],
  },
  {
    id: 'custom-export-packaging',
    name: 'Custom Export Packaging',
    description:
      'White-label and OEM packing solutions for international distributors. Bulk, retail, and private-label options.',
    image: '/mariahcoirs/package_unit.jpg',
    category: ['custom'],
    specs: [
      { label: 'MOQ',      value: '1×20ft FCL'   },
      { label: 'Label',    value: 'Custom / OEM'  },
      { label: 'Shipping', value: 'Ex-Works / FOB' },
    ],
  },
];

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Animation Variants ───────────────────────────────────────────
const sectionFade: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_CUBIC } },
};

const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 36, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: EASE_CUBIC, delay: i * 0.07 },
  }),
  exit: { opacity: 0, scale: 0.95, y: -12, transition: { duration: 0.28, ease: 'easeIn' } },
};

// ─── Product Card ─────────────────────────────────────────────────
function ProductCard({
  product,
  index,
  reduce,
}: {
  product: Product;
  index: number;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      layout
      key={product.id}
      custom={index}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      onHoverStart={() => !reduce && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduce ? {} : { y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="flex flex-col overflow-hidden"
      style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: hovered ? '1.5px solid rgba(200,140,50,0.45)' : '1.5px solid rgba(0,0,0,0.07)',
        boxShadow: hovered
          ? '0 20px 48px rgba(0,0,0,0.13), 0 6px 16px rgba(185,120,45,0.14)'
          : '0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      aria-label={product.name}
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: '200px', borderRadius: '16px 16px 0 0' }}
      >
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={hovered && !reduce ? { scale: 1.08 } : { scale: 1.0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />
        {/* Category chip overlay */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#7A5020',
            }}
          >
            Export Ready
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Name */}
        <h3
          className="font-bold leading-snug"
          style={{ fontSize: '1rem', color: '#0F0A04', letterSpacing: '-0.01em' }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          className="mt-2 leading-relaxed line-clamp-2"
          style={{ fontSize: '0.8rem', color: '#6B5840' }}
        >
          {product.description}
        </p>

        {/* Specs */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {product.specs.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: '#A07840' }}
              >
                {label}:
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ color: '#3C2C18' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Buttons ── */}
        <div className="mt-5 flex gap-2.5">
          {/* Primary — dark */}
          <motion.a
            href="#quote"
            whileHover={reduce ? {} : { scale: 1.03 }}
            whileTap={reduce ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label={`Request quote for ${product.name}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-[10px] rounded-xl font-bold text-[12px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            style={{
              background: '#0F0A04',
              boxShadow: '0 3px 12px rgba(0,0,0,0.22)',
            }}
          >
            Request Quote
          </motion.a>

          {/* Secondary — outline */}
          <motion.a
            href={`#product-${product.id}`}
            whileHover={reduce ? {} : { scale: 1.03, background: '#F5F0E8' }}
            whileTap={reduce ? {} : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label={`View details for ${product.name}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-[10px] rounded-xl font-semibold text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(0,0,0,0.12)',
              color: '#3C2C18',
            }}
          >
            View Details
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Section ─────────────────────────────────────────────────
export default function ProductsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const sectionRef   = useRef<HTMLElement>(null);
  const isInView     = useInView(sectionRef, { once: true, amount: 0.08 });
  const shouldReduce = useReducedMotion();

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category.includes(activeFilter));
  }, [activeFilter]);

  return (
    <section
      id="products"
      ref={sectionRef}
      aria-label="Mariah Coirs Export Product Catalogue"
      className="w-full"
      style={{ background: '#F7F4EF' }}
    >
      {/* ── Top accent ── */}
      <div
        className="w-full h-px"
        style={{ background: 'rgba(0,0,0,0.07)' }}
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">

        {/* ══════════════════════════════════════════
            HEADER ROW
        ══════════════════════════════════════════ */}
        <motion.div
          variants={shouldReduce ? {} : sectionFade}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
        >
          {/* Left — label + heading */}
          <div>
            <span
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] mb-3"
              style={{ color: '#A07840' }}
            >
              <span
                className="w-5 h-px"
                style={{ background: '#C98438' }}
                aria-hidden="true"
              />
              Product Catalog
            </span>
            <h2
              className="font-black tracking-tight"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                color: '#0F0A04',
                lineHeight: '1.08',
                letterSpacing: '-0.02em',
              }}
            >
              Premium Export Products
            </h2>
          </div>

          {/* Right — filter pills */}
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter products by category"
          >
            {FILTERS.map(({ key, label }) => {
              const isActive = activeFilter === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  whileHover={shouldReduce ? {} : { scale: 1.04 }}
                  whileTap={shouldReduce ? {} : { scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  aria-pressed={isActive}
                  className="relative px-4 py-2 rounded-full text-[12px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  style={{
                    background: isActive ? '#0F0A04' : 'rgba(0,0,0,0.05)',
                    color:      isActive ? '#FFFFFF' : '#5A4830',
                    border:     isActive ? '1.5px solid transparent' : '1.5px solid rgba(0,0,0,0.09)',
                    transition: 'background 0.22s ease, color 0.22s ease',
                  }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="active-filter-bg"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ background: '#0F0A04' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Results count ── */}
        <motion.p
          key={activeFilter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-[12px] font-medium"
          style={{ color: '#9A8060' }}
          aria-live="polite"
        >
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {activeFilter !== 'all' ? ` in "${FILTERS.find(f => f.key === activeFilter)?.label}"` : ''}
        </motion.p>

        {/* ══════════════════════════════════════════
            PRODUCT GRID
        ══════════════════════════════════════════ */}
        <motion.div layout>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeFilter}
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  reduce={!!shouldReduce}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ══════════════════════════════════════════
            BOTTOM CTA BANNER
        ══════════════════════════════════════════ */}
        <motion.div
          variants={shouldReduce ? {} : {
            hidden:  { opacity: 0, y: 32 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
          }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7 rounded-2xl"
          style={{
            background: 'linear-gradient(105deg, #1C1208 0%, #2E1E0A 100%)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          }}
        >
          <div className="flex flex-col text-center sm:text-left">
            <span
              className="font-black text-white"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', letterSpacing: '-0.015em' }}
            >
              Need a custom product or bulk order?
            </span>
            <span
              className="mt-1 text-[13px] font-medium"
              style={{ color: 'rgba(255,255,255,0.58)' }}
            >
              Factory-direct pricing &middot; Custom packaging &middot; 20ft &amp; 40ft FCL shipping
            </span>
          </div>

          <div className="flex gap-3 shrink-0">
            <motion.a
              href="#quote"
              whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-label="Get a custom export quote"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              style={{
                background: 'linear-gradient(135deg, #D9A56A 0%, #B87038 100%)',
                color: '#160D03',
                boxShadow: '0 4px 20px rgba(185,110,50,0.45)',
              }}
            >
              Get Custom Quote
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 8 13 8"/><polyline points="9 4 13 8 9 12"/>
              </svg>
            </motion.a>

            <motion.a
              href="#about"
              whileHover={shouldReduce ? {} : { scale: 1.04 }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              aria-label="Learn about Mariah Coirs facility"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[13px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.20)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              Our Facility
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
