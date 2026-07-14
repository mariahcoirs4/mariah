import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productApi, getUploadUrl } from '../lib/api';
import type { ApiProduct } from '../lib/api';
import { useModal } from '../context/ModalContext';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

const P = {
  bg: '#F7F4EF',
  card: '#FFFFFF',
  dark: '#0F0A04',
  muted: '#6B5840',
  accent: '#B87038',
  border: 'rgba(0,0,0,0.07)',
  lightAccent: '#F5EAD8',
};

// Helpers for URL slugification and name normalization
function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Category static content definitions
const categoryStaticContent: Record<
  string,
  { title: string; subtitle: string; content: string; keySpecs: { label: string; value: string }[] }
> = {
  'Cocopeat': {
    title: 'Horticultural Grade Coco Peat Substrates',
    subtitle: 'Premium growing medium with high water retention and air porosity.',
    content: 'Our cocopeat is washed, buffered, and meticulously processed in our Pollachi facility. It provides an ideal root environment for high-value agricultural and horticultural crops. With excellent water retention capacity, high aeration, and structural stability, it prevents soil compaction and encourages robust root growth. We maintain rigorous quality control to guarantee low electrical conductivity (EC) and optimal pH balance. Additionally, our processing includes thermal drying options, automated sieving to remove excess fine dust, and compaction into sturdy 5kg blocks designed for easy shipping and rehydration. Our cocopeat complies fully with NPPO quarantine and phytosanitary rules to ensure zero weeds and zero pathogen introduction.',
    keySpecs: [
      { label: 'Water Holding Capacity', value: '75% - 80% (v/v)' },
      { label: 'Air Filled Porosity', value: '10% - 15% (v/v)' },
      { label: 'PH Range', value: '5.8 to 6.8 (ideal for nutrient uptake)' },
      { label: 'EC Level', value: 'Low EC (< 0.5 mS/cm - washed & buffered)' },
      { label: 'Expansion Volume', value: '15 Liters per Kg of compressed material' },
      { label: 'Weed & Pathogen Control', value: '100% Heat-treated & Lab-verified sterile' },
    ],
  },
  'Coir Fibre': {
    title: 'High-Tensile Organic Coir Fiber',
    subtitle: 'Natural, resilient coconut fiber for industrial and agricultural applications.',
    content: 'Mariah Coirs exports golden-brown coir fiber extracted from mature coconut husks. Processed using modern decorticating machinery, our fiber retains high tensile strength, natural resilience, and resistance to fungal decay. It is widely used in soil erosion control blankets (geotextiles), automotive upholstery, premium mattress filling, and brush manufacturing. Our extraction methods separate long bristles from fine dust efficiently, ensuring we ship clean bales with minimal impurities. Every batch is hydraulically compressed into compact bales wrapped in strong polypropylene bindings to withstand overseas oceanic transit.',
    keySpecs: [
      { label: 'Fiber Length', value: '10cm to 25cm (bristle grade)' },
      { label: 'Moisture Content', value: 'Below 15% (prevents mildew formation)' },
      { label: 'Impurity Level', value: 'Under 2% (minimal dust and pith residue)' },
      { label: 'Bale Weight', value: '100 - 120 kg (packed in heavy-duty straps)' },
      { label: 'Color Grade', value: 'Natural Golden Brown / White Husk Fibre' },
      { label: 'Salt Content', value: 'Extremely Low (washed with freshwater)' },
    ],
  },
  'Geotextiles': {
    title: 'Biodegradable Coir Geotextiles & Erosion Control Nets',
    subtitle: 'High-durability organic mesh netting for soil stabilization and slope protection.',
    content: 'Our woven coir geotextile mats provide an eco-friendly solution for soil conservation, slope stabilization, and landscaping. Made from 100% natural, hand-spun coir yarn, these biodegradable nets degrade slowly over 3 to 5 years, allowing vegetation to establish roots. They have high tensile strength and can withstand heavy water flows without tearing. Engineered to match global civil construction specifications, they absorb moisture, prevent surface runoffs, and shield young roots from harsh solar rays. Available in various mesh sizes and weights to fit custom engineering requirements.',
    keySpecs: [
      { label: 'Tensile Strength', value: 'High (Dry & Wet - engineered weave)' },
      { label: 'Lifespan', value: '3 to 5 years (slow organic degradation)' },
      { label: 'Mesh Sizes', value: 'Standard 400g/m² to 900g/m² density' },
      { label: 'Eco-Friendliness', value: '100% Biodegradable & safe for local flora/fauna' },
      { label: 'Roll Widths', value: '1 Meter to 4 Meters standard' },
      { label: 'Erosion Protection', value: 'Handles slopes up to 45 degrees' },
    ],
  },
  'Chips mixed Cocopeat blocks': {
    title: 'Aerated Coco Husk Chips & Peat Blends',
    subtitle: 'Perfect drainage and aeration mix for orchid propagation and berry growers.',
    content: 'This premium substrate combines washed coco peat with crushed coconut husk chips to maximize drainage and airflow. The chunky husk chips create micro-pockets of air within the medium, preventing over-watering and root rot. It is highly recommended for orchids, bromeliads, hydroponic berry cultivation, and pot-plant propagation. By balancing capillary water retention with high aeration, it encourages rapid root branching. Our mix is thoroughly washed to flush out natural sodium and potassium salts, resulting in a clean grow medium ready for liquid fertilization.',
    keySpecs: [
      { label: 'Husk Chip Ratio', value: 'Custom blends (typically 30% to 70%)' },
      { label: 'Drainage Capacity', value: 'Excellent (high percolation rate)' },
      { label: 'Expansion Volume', value: '15L to 18L per kg of compressed block' },
      { label: 'EC Level', value: 'Low EC (< 0.8 mS/cm - optimized for root safety)' },
      { label: 'Chip Size Range', value: '8mm to 16mm crushed husk pieces' },
      { label: 'pH Balance', value: '5.7 - 6.5 (stable buffer zone)' },
    ],
  },
  'Grow bags': {
    title: 'Precision Hydroponic Grow Slabs & Bags',
    subtitle: 'Ready-to-use professional grow bags for greenhouse cultivation.',
    content: 'Our coir grow media bags are engineered for high-wire crops like tomatoes, cucumbers, capsicums, and strawberries. Co-extruded in UV-stabilized white-on-black polythene bags, they are pre-cut with planting, drip, and drainage holes. They save labor costs and ensure uniform crop development throughout the growing season. The inner black layer absorbs heat while the outer white layer reflects excess sunlight, maintaining stable root zone temperatures. The interior coco peat substrate is customized to match the crop growth stages, featuring either high-drainage chip mixtures or high-retention fine peat layers.',
    keySpecs: [
      { label: 'UV Stability', value: 'Up to 3 Years Warranty in high-solar zones' },
      { label: 'Peat/Chip Ratio', value: 'Customizable Blends (e.g., 70:30 peat/chip)' },
      { label: 'Packaging', value: 'Co-extruded LDPE bags (double sealed)' },
      { label: 'Pre-cuts', value: 'Planting/Drip holes fully customizable per order' },
      { label: 'Volume Capacity', value: 'Standard 15L to 30L growing capacity' },
      { label: 'Phytosanitary Cert', value: 'Certified free from weed seeds and nematodes' },
    ],
  },
  'Custom': {
    title: 'Custom OEM Sourcing & White-Label Packaging',
    subtitle: 'Bespoke coir solutions tailored to global agricultural distributors.',
    content: 'For large-scale agricultural distributors and retail garden brands, we offer comprehensive OEM packaging. From customized print graphics on bags and boxes to custom-sized briquettes, discs, and grow media specifications, we handle everything from design to container loading at our factory in Tamil Nadu. Our logistics team secures competitive ocean freight quotes and manages full customs documentation, export clearances, and phytosanitary verification.',
    keySpecs: [
      { label: 'MOQ Requirement', value: '1 x 20ft FCL minimum order size' },
      { label: 'Private Labeling', value: 'Full BOPP color printing with custom branding' },
      { label: 'Palletization', value: 'Stretch-wrapped standard ISPM-15 wooden pallets' },
      { label: 'Quality Guarantee', value: 'Third-party inspection verified (SGS or equivalent)' },
      { label: 'Design Support', value: 'Complimentary retail layout and artwork verification' },
      { label: 'Custom Sizing', value: 'Briquettes, blocks, discs, or custom slabs' },
    ],
  },
};

const defaultStaticContent = {
  title: 'Export-Quality Coir & Coco Peat Products',
  subtitle: 'Sustainably manufactured in India and exported worldwide.',
  content: 'All Mariah Coirs products are manufactured under strict ISO 9001:2015 quality standards. We procure organic raw coconut husks directly from local farms in Pollachi and Nilakottai, processing them without harmful chemical additives. Our modern facilities ensure that every shipment conforms to international phytosanitary regulations. We conduct strict laboratory analysis on moisture, salt levels (EC), acidity (pH), and weed seeds on every single container before it leaves our loading docks.',
  keySpecs: [
    { label: 'Origin', value: 'Pollachi / Nilakottai, Tamil Nadu, India' },
    { label: 'Certification', value: 'ISO 9001:2015, Coir Board India Registration' },
    { label: 'Eco-Friendliness', value: '100% Biodegradable, Organic & Renewable source' },
    { label: 'Shipping Formats', value: 'FCL & LCL worldwide (FOB, CIF, CFR, CNF)' },
    { label: 'Quality Audit', value: 'In-house laboratory check per batch' },
    { label: 'Phytosanitary Policy', value: 'Heat treatment & fumigation certification issued' },
  ],
};

function getImageSrc(img: string | undefined): string {
  if (!img) return '';
  if (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:')) return img;
  return getUploadUrl(img);
}

export default function ProductDetail() {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const { openModal } = useModal();

  useEffect(() => {
    if (!nameOrId) return;
    setLoading(true);
    setError('');
    setProduct(null);

    productApi.getAll()
      .then((res) => {
        setAllProducts(res.data);
        const targetNormalized = normalizeName(nameOrId);
        
        // 1. Match by normalized name
        let found = res.data.find(p => normalizeName(p.name) === targetNormalized);
        
        // 2. Fallback: match by numeric ID
        if (!found && !isNaN(Number(nameOrId))) {
          const targetId = Number(nameOrId);
          found = res.data.find(p => p.id === targetId);
        }
        
        if (found) {
          setProduct(found);
          if (found.images && found.images.length > 0) {
            setSelectedImage(found.images[0]);
          }
        } else {
          setError('Product not found.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Error loading products.');
      })
      .finally(() => setLoading(false));
  }, [nameOrId]);

  const staticInfo = useMemo(() => {
    if (!product) return defaultStaticContent;
    return categoryStaticContent[product.category] || defaultStaticContent;
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 3);
  }, [allProducts, product]);

  useSEO({
    title: product ? `${product.name} | Mariah Coirs` : 'Product Catalog | Mariah Coirs',
    description: product ? product.description : 'Premium coir export products from Mariah Coirs.',
    canonical: product ? `${SITE_URL}/product/${slugify(product.name)}` : `${SITE_URL}/products`,
    jsonLd: product
      ? [
          ORGANIZATION_SCHEMA,
          breadcrumbSchema([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Products', url: `${SITE_URL}/products` },
            { name: product.name, url: `${SITE_URL}/product/${slugify(product.name)}` },
          ]),
        ]
      : [],
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: P.bg, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `3px solid ${P.lightAccent}`, borderTopColor: P.accent, animation: 'spin 0.85s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: P.bg, display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '40px 28px', borderRadius: '28px', border: `1.5px solid ${P.border}`, background: P.card, boxShadow: '0 28px 60px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📦</span>
          <h1 style={{ margin: 0, fontSize: '24px', color: P.dark, fontWeight: 800 }}>Product Not Found</h1>
          <p style={{ margin: '12px 0 0', color: P.muted, lineHeight: 1.7 }}>{error || 'This product is currently unavailable.'}</p>
          <Link to="/products" style={{ display: 'inline-flex', marginTop: '22px', padding: '12px 24px', borderRadius: '12px', background: P.dark, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: P.bg }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Hero Header */}
      <section style={{ background: '#0A0A0A', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#A0A0A0', marginBottom: '16px' }} aria-label="Breadcrumb">
            <Link to="/" style={{ color: '#A0A0A0', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/products" style={{ color: '#A0A0A0', textDecoration: 'none' }}>Products</Link>
            <span>/</span>
            <span style={{ color: '#C99B67' }}>{product.name}</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '12px' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
            {product.name}
          </h1>
          {product.sku && (
            <p style={{ color: '#A0A0A0', fontSize: '14px', margin: '8px 0 0' }}>
              SKU: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{product.sku}</span>
            </p>
          )}
        </div>
      </section>

      {/* Main Grid */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }} className="product-grid">
          
          {/* Admin Provided Content Section */}
          <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="admin-product-details">
            {/* Image Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  height: '420px',
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: `1.5px solid ${P.border}`,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedImage ? (
                  <img
                    src={getImageSrc(selectedImage)}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '80px' }}>📦</span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '12px',
                        border: selectedImage === img ? `2px solid ${P.accent}` : `1px solid ${P.border}`,
                        overflow: 'hidden',
                        padding: 0,
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <img src={getImageSrc(img)} alt={`${product.name} gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: P.dark, margin: '0 0 12px' }}>Product Overview</h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: P.muted, margin: 0 }}>
                  {product.description}
                </p>
              </div>

              {/* Specs & MOQ */}
              <div style={{ background: '#FFFFFF', border: `1.5px solid ${P.border}`, borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: P.dark, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Specifications
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {product.moq && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: `1px solid ${P.border}` }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: P.muted }}>Minimum Order Quantity (MOQ)</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: P.dark }}>{product.moq}</span>
                    </div>
                  )}

                  {product.specs && product.specs.length > 0 ? (
                    product.specs.map((spec, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          paddingBottom: index === product.specs.length - 1 ? 0 : '12px',
                          borderBottom: index === product.specs.length - 1 ? 'none' : `1px solid ${P.border}`,
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 600, color: P.muted }}>{spec.label}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: P.dark }}>{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: 0, fontSize: '13px', color: P.muted, fontStyle: 'italic' }}>No additional specifications provided.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <button
                  onClick={() => openModal('export')}
                  style={{
                    flex: 1,
                    background: P.dark,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '16px 24px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1E1408')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = P.dark)}
                >
                  Request Quote
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr style={{ border: 'none', borderTop: `1px solid ${P.border}`, margin: '16px 0' }} />

          {/* Category-Specific Static Content Section */}
          <section
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: `1.5px solid ${P.border}`,
              padding: '36px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '32px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
            }}
            className="static-category-content"
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: P.accent }}>
                Production Standards
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: P.dark, margin: '8px 0 12px' }}>
                {staticInfo.title}
              </h2>
              <p style={{ fontSize: '15px', fontWeight: 600, color: P.muted, margin: '0 0 16px', lineHeight: 1.5 }}>
                {staticInfo.subtitle}
              </p>
              <p style={{ fontSize: '15px', color: '#4A3D2F', lineHeight: 1.8, margin: 0 }}>
                {staticInfo.content}
              </p>
            </div>

            <div style={{ background: '#FAF8F4', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: P.dark, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Standard Quality Benchmarks
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {staticInfo.keySpecs.map((spec, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: P.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{spec.label}</span>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: P.dark }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section style={{ marginTop: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: P.accent }}>
                  Related Items
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: P.dark, margin: '6px 0 0' }}>
                  More from {product.category}
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                {relatedProducts.map((p) => {
                  const relatedFirstImage = p.images?.[0];
                  return (
                    <Link
                      key={p.id}
                      to={`/product/${slugify(p.name)}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: `1.5px solid ${P.border}`,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(185, 120, 45, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                      }}
                    >
                      <div style={{ height: '180px', background: '#FAF8F4', overflow: 'hidden' }}>
                        {relatedFirstImage ? (
                          <img src={getImageSrc(relatedFirstImage)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>📦</div>
                        )}
                      </div>
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: P.dark, margin: 0 }}>{p.name}</h3>
                        <p style={{ fontSize: '13px', color: P.muted, margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px', lineHeight: 1.4 }}>
                          {p.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .product-grid {
            gap: 64px !important;
          }
          .admin-product-details {
            grid-template-columns: 1fr 1fr !important;
          }
          .static-category-content {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
        }
      `}</style>
    </div>
  );
}

