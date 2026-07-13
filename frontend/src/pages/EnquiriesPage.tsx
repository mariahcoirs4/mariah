import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';
import { enquiryApi } from '../lib/api';

const SITE_URL = 'https://www.mariahcoirsexport.com';

const PRODUCTS = [
  'Coco Peat Blocks 5kg',
  'Coco Peat Blocks 650g',
  'Low EC Coco Peat',
  'Coir Grow Bags',
  'Husk Chips Grow Media',
  'Coir Pith (Loose)',
  'Open-Top Bags',
  'Custom / Mixed Order',
];

type OrderTab = 'export' | 'domestic';

const TAB_CONFIG = {
  export: {
    label: 'Export Order',
    companyPlaceholder: 'GreenGrow BV',
    locationLabel: 'COUNTRY *',
    locationPlaceholder: 'Netherlands',
    phonePlaceholder: '+31 6 12345678',
    submitLabel: 'Request Export Quote',
  },
  domestic: {
    label: 'Indian Bulk Order',
    companyPlaceholder: 'Agro Traders',
    locationLabel: 'STATE *',
    locationPlaceholder: 'Karnataka',
    phonePlaceholder: '+91 98400 12345',
    submitLabel: 'Request Bulk Pricing',
  },
} as const;

// ─── Social Media Icons ──────────────────────────────────────────
const FacebookIcon = () => <FaFacebookF size={18} />;
const InstagramIcon = () => <FaInstagram size={18} />;
const YoutubeIcon = () => <FaYoutube size={18} />;
const WhatsappIcon = () => <FaWhatsapp size={18} />;




// ─── Input Component ──────────────────────────────────────────────
function Field({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: '#667085',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          border: `1px solid ${focused ? '#C99B67' : '#E4E7EC'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '14px',
          color: '#111111',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: focused ? '0 0 0 3px rgba(201, 155, 103, 0.15)' : 'none',
          background: '#FFFFFF',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

// ─── Select Component ─────────────────────────────────────────────
function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  defaultText,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  defaultText: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: '#667085',
        }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          border: `1px solid ${focused ? '#C99B67' : '#E4E7EC'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          paddingRight: '32px',
          fontSize: '14px',
          color: value ? '#111111' : '#A0A0A0',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: focused ? '0 0 0 3px rgba(201, 155, 103, 0.15)' : 'none',
          background: '#FFFFFF',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' stroke='%23667085' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M19 9l-7 7-7-7' stroke-linecap='round' stroke-linejoin='round'></path></svg>")`,
          backgroundPosition: 'right 12px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '16px 16px',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <option value="" disabled>{defaultText}</option>
        {options.map(opt => (
          <option key={opt} value={opt} style={{ color: '#111111' }}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Textarea Component ───────────────────────────────────────────
function TextAreaField({
  label,
  id,
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: '#667085',
        }}
      >
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={rows}
        style={{
          width: '100%',
          border: `1px solid ${focused ? '#C99B67' : '#E4E7EC'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '14px',
          color: '#111111',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: focused ? '0 0 0 3px rgba(201, 155, 103, 0.15)' : 'none',
          background: '#FFFFFF',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
    </div>
  );
}

export default function EnquiriesPage() {
  useSEO({
    title: 'Enquiry | Mariah Coirs — Request Bulk Pricing & Export Quotations',
    description:
      'Submit your import and domestic bulk coco peat or coir product enquiries. Receive detailed FOB/CIF pricing, packing specifications, and lead times within 24 hours.',
    canonical: `${SITE_URL}/enquiries`,
    keywords:
      'coir enquiries, coco peat bulk price, export quote request, coir block quotation, import coir India, Mariah Coirs quotation',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Enquiries', url: `${SITE_URL}/enquiries` },
      ]),
    ],
  });

  const shouldReduce = useReducedMotion();

  // Tab State
  const [activeTab, setActiveTab] = useState<OrderTab>('export');

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [product, setProduct] = useState('');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const resetForm = useCallback(() => {
    setName('');
    setCompany('');
    setLocation('');
    setEmail('');
    setPhone('');
    setProduct('');
    setMessage('');
  }, []);

  const switchTab = (tab: OrderTab) => {
    setActiveTab(tab);
    setLocation(''); // reset location state since it toggles Country / State
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Basic validation
    if (!name.trim()) return setSubmitError('Please enter your full name.');
    if (!company.trim()) return setSubmitError('Please enter your company name.');
    if (!location.trim()) return setSubmitError(activeTab === 'export' ? 'Please enter your country.' : 'Please enter your state.');
    if (!email.trim() || !email.includes('@')) return setSubmitError('Please enter a valid email address.');
    if (!product) return setSubmitError('Please select a product interest.');
    if (message.trim().length < 5) return setSubmitError('Enquiry message must be at least 5 characters long.');

    setSubmitting(true);
    try {
      await enquiryApi.submit({
        name: name.trim(),
        email: email.trim(),
        companyName: company.trim(),
        phone: phone.trim() || undefined,
        country: location.trim(),
        productInterested: product,
        message: message.trim(),
        sourcePage: activeTab === 'export' ? 'Enquiries Page - Export Quote' : 'Enquiries Page - Indian Bulk Supply',
      });
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message ?? 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cfg = TAB_CONFIG[activeTab];

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      {/* Top offset for Navbar */}
      <div style={{ height: '100px' }} aria-hidden="true" />

      {/* Page Hero Header */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="Enquiries page header"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              fontSize: '13px',
              color: '#A0A0A0',
              marginBottom: '24px',
            }}
          >
            <Link
              to="/"
              style={{ color: '#A0A0A0', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >
              Home
            </Link>
            <span>/</span>
            <span style={{ color: '#C99B67' }}>Enquiries</span>
          </nav>

          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#C99B67',
              marginBottom: '16px',
            }}
          >
            Partnership & Supply
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            Request a Bulk Quote
          </h1>
          <p style={{ fontSize: '18px', color: '#8E8E93', maxWidth: '650px', lineHeight: 1.7 }}>
            Looking to import premium coir products or arrange regular domestic supply? Fill out our structured enquiry form below. Our export desk responds with detailed quotation matrices within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Grid Area */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          
          {/* ════════════════════════════════════════
              LEFT COLUMN — Info and Guides
          ════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C99B67] uppercase block mb-3">
                Export Process Details
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-tight mb-4">
                Global Shipments & Logistics Setup
              </h2>
              <p className="text-[15px] text-[#667085] leading-relaxed">
                Mariah Coirs handles shipping and documentation to 50+ countries. We ensure our materials comply with customs regulations and phytosanitary controls worldwide.
              </p>
            </div>

            {/* List of Details */}
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Order Volumes & MOQ',
                  desc: 'Export shipments are standard in 20ft or 40ft High Cube FCLs (Full Container Loads). Customized packaging or mixed container orders can be arranged upon requests.',
                  icon: '📦',
                },
                {
                  title: 'Certificates Offered',
                  desc: 'All consignments are supplied with Coir Board Registration, Phytosanitary Certificates, Fumigation Certificates, and Country of Origin Documentation as standard.',
                  icon: '📜',
                },
                {
                  title: 'Trade & Shipping Terms',
                  desc: 'We support standard FOB (Free On Board) Tuticorin/Cochin ports, CIF (Cost, Insurance & Freight), and CFR (Cost and Freight) destinations depending on client convenience.',
                  icon: '🌐',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white/50 p-5 rounded-2xl border border-black/5">
                  <div className="w-10 h-10 rounded-xl bg-[#C99B67]/10 flex items-center justify-center text-lg shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111111] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[13.5px] text-[#667085] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Helpline / Quick Contact */}
            <div className="bg-[#111111] text-white p-6 rounded-2xl relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30"
                style={{ background: 'radial-gradient(circle, #C99B67 0%, transparent 70%)' }}
              />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C99B67] uppercase block mb-2">
                Urgent Consultation
              </span>
              <h4 className="text-lg font-bold mb-2">Need a Custom Blend or Specification?</h4>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Connect with our technical product advisors directly on WhatsApp to coordinate customized EC levels, fiber ratios, or private label packaging.
              </p>
              <a
                href="https://wa.me/919677641979?text=Hello%20Mariah%20Coirs%20Export%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C99B67] hover:bg-[#b08453] text-[#111111] font-bold text-xs py-2.5 px-5 rounded-lg transition-colors duration-200"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN — Embedded Form
          ════════════════════════════════════════ */}
          <div className="lg:col-span-7 w-full max-w-[580px] lg:max-w-none mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-black/5">
              {submitted ? (
                /* Success screen */
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5"
                    style={{ background: 'rgba(201,155,103,0.1)' }}
                  >
                    ✅
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
                    Enquiry Received Successfully!
                  </h3>
                  <p style={{ color: '#667085', marginTop: '12px', fontSize: '14px', lineHeight: 1.65, maxWidth: '380px' }}>
                    Thank you, <strong>{name}</strong>. A response summary has been logged. Our export managers will reach out to <strong>{email}</strong> within 24 hours with custom FOB quotes and specifications sheets.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-[320px]">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        resetForm();
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        background: '#111111',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#222222')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#111111')}
                    >
                      Submit Another Request
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* The Enquiry Form */
                <>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#C99B67] uppercase block mb-1">
                    {activeTab === 'export' ? 'INTERNATIONAL ORDER' : 'DOMESTIC BULK SUPPLY'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight leading-tight mb-2">
                    Request Pricing Details
                  </h3>
                  <p className="text-[13px] text-[#667085] mb-6">
                    Toggle your supply zone below to show custom fields for shipping coordinates.
                  </p>

                  {/* Tab Switcher */}
                  <div
                    className="grid grid-cols-2 gap-1 mb-6"
                    style={{
                      background: '#F9FAFB',
                      border: '1px solid #E4E7EC',
                      borderRadius: '10px',
                      padding: '3px',
                    }}
                  >
                    {(['export', 'domestic'] as OrderTab[]).map(tab => {
                      const isActive = activeTab === tab;
                      const tCfg = TAB_CONFIG[tab];
                      return (
                        <motion.button
                          key={tab}
                          type="button"
                          onClick={() => switchTab(tab)}
                          whileTap={shouldReduce ? {} : { scale: 0.98 }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isActive ? '#111111' : 'transparent',
                            color: isActive ? '#FFFFFF' : '#667085',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit',
                          }}
                        >
                          {tCfg.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Form fields */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        id="enquiry-name"
                        label="Full Name *"
                        placeholder="John Smith"
                        value={name}
                        onChange={setName}
                      />
                      <Field
                        id="enquiry-company"
                        label="Company Name *"
                        placeholder={cfg.companyPlaceholder}
                        value={company}
                        onChange={setCompany}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`enquiry-loc-${activeTab}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="w-full"
                        >
                          <Field
                            id="enquiry-location"
                            label={cfg.locationLabel}
                            placeholder={cfg.locationPlaceholder}
                            value={location}
                            onChange={setLocation}
                          />
                        </motion.div>
                      </AnimatePresence>
                      <Field
                        id="enquiry-email"
                        label="Email Address *"
                        type="email"
                        placeholder="your@company.com"
                        value={email}
                        onChange={setEmail}
                      />
                    </div>

                    <div>
                      <Field
                        id="enquiry-phone"
                        label="WhatsApp / Contact Number"
                        type="tel"
                        placeholder={cfg.phonePlaceholder}
                        value={phone}
                        onChange={setPhone}
                      />
                    </div>

                    <div>
                      <SelectField
                        id="enquiry-product"
                        label="Product Interest *"
                        value={product}
                        onChange={setProduct}
                        options={PRODUCTS}
                        defaultText="Select product to enquire"
                      />
                    </div>

                    <div>
                      <TextAreaField
                        id="enquiry-message"
                        label="Detailed Enquiry Message *"
                        placeholder="Specify requirements, estimated tonnage/volume, packing specifications, or destination ports..."
                        value={message}
                        onChange={setMessage}
                        rows={4}
                      />
                    </div>

                    {submitError && (
                      <div
                        style={{
                          color: '#DC2626',
                          background: '#FEF2F2',
                          border: '1px solid #FECACA',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                      >
                        {submitError}
                      </div>
                    )}

                    <motion.button
                      id="enquiry-submit-btn"
                      type="submit"
                      disabled={submitting}
                      whileHover={submitting || shouldReduce ? {} : { scale: 1.01, y: -1 }}
                      whileTap={submitting || shouldReduce ? {} : { scale: 0.99 }}
                      style={{
                        width: '100%',
                        background: submitting ? '#666666' : '#C99B67',
                        color: '#111111',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '14px 20px',
                        fontSize: '14.5px',
                        gap: '8px',
                        transition: 'background 0.2s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <span>{cfg.submitLabel}</span>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>

            {/* Social Media Links below the form card */}
            <div className="mt-8 flex flex-col items-center sm:items-start gap-4">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C99B67] uppercase">
                Connect with Us
              </span>
              <div className="flex gap-4 items-center">
                <motion.a
                  href="https://www.facebook.com/MariahCoirsExport"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: '#1877F2' }}
                  aria-label="Visit our Facebook page"
                >
                  <FacebookIcon />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/mariahcoirsexport/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                  aria-label="Visit our Instagram page"
                >
                  <InstagramIcon />
                </motion.a>
                <motion.a
                  href="https://www.youtube.com/@MariahCoirsExport"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: '#FF0000' }}
                  aria-label="Visit our YouTube channel"
                >
                  <YoutubeIcon />
                </motion.a>
                <motion.a
                  href="https://wa.me/919677641979?text=Hello%20Mariah%20Coirs%20Export%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: '#25D366' }}
                  aria-label="Chat with us on WhatsApp"
                >
                  <WhatsappIcon />
                </motion.a>
              </div>
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}
