import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';
import { useModal } from '../context/ModalContext';

// ─── Image & Video Placeholders ─────────────────────────────────────
// Easy to swap variables for user's Google Drive image/video links
const IMAGES = {
  moistureTesting: 'https://ik.imagekit.io/26fkxjtlf/Qualitycontrol/Qualitycontrol1.jpg', // lab digital moisture test
  ecTesting: 'https://ik.imagekit.io/26fkxjtlf/Qualitycontrol/Qualityconrol2.jpg', // water/chemical conductivity test
  phTesting: 'https://ik.imagekit.io/26fkxjtlf/Qualitycontrol/quality%20control%203.jpg', // pH lab verification
  densityTesting: 'https://ik.imagekit.io/26fkxjtlf/Qualitycontrol/Qualitycontrol4.jpg', // block weighing & physical check
  videoDemoThumb: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=80', // live lab batch testing video cover
};

const VIDEOS = {
  labTestingUrl: 'https://ik.imagekit.io/26fkxjtlf/Qualitycontrol/qualitycontrol5.mp4', // live video demo
};

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function QualityControlPage() {
  const { openModal } = useModal();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState<{ src: string; title: string; description: string; detail: string } | null>(null);
  const SITE_URL = 'https://www.mariahcoirsexport.com';

  useSEO({
    title: 'Quality Assurance & Laboratory Testing Standards | Mariah Coirs',
    description:
      'Rigorous testing for moisture, EC levels, pH levels, and physical density. Explore our B2B batch inspection checks, certifications, and sun-drying supervisor protocol for consistent premium coco peat exports.',
    canonical: `${SITE_URL}/quality-control`,
    keywords: 'coir quality control, coco peat testing, electrical conductivity coir, pH coco peat, coir moisture meter, Dindigul coco peat exporter, sun-drying supervision, certificate approval',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Quality Control', url: `${SITE_URL}/quality-control` },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header spacer */}
      <div className="h-[100px]" aria-hidden="true" />

      {/* ─── HERO BANNER ────────────────────────────────────────────── */}
      <section 
        className="relative overflow-hidden bg-[#102A1D] text-white py-20 px-6 sm:px-12"
        aria-label="Quality Control Hero"
      >
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C97B38]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto flex flex-col items-start">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50 mb-8">
            <Link to="/" className="hover:text-[#E5A93C] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#E5A93C]">Quality Control</span>
          </nav>

          <span className="inline-block text-[11px] font-extrabold uppercase tracking-[4px] text-[#E5A93C] mb-4">
            Industrial Excellence
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mb-6">
            Uncompromising Quality Control &amp; Testing Standards
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed mb-10">
            Every batch of Mariah Coir is rigorously tested for moisture, EC levels, pH, and physical density before export, guaranteeing absolute uniformity and consistency for global horticulturists.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#testing-grid"
              className="px-8 py-4 bg-[#E5A93C] hover:bg-[#c99532] text-[#102A1D] font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Testing Standards
            </a>
            <a
              href="/mariahcoirs/sample-spec-sheet.pdf" // Placeholder link
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border border-white/30 hover:border-white text-white font-semibold rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
            >
              <span>Download Quality Spec Sheet</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── TESTING GRID SECTION ───────────────────────────────────── */}
      <section id="testing-grid" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[3px] text-[#C97B38] uppercase">Standard Lab Protocols</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A1D] tracking-tight mt-2 mb-4">
            Verified Physical &amp; Chemical Testing
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We operate a strict batch control workflow with regular laboratory testing. Select a quality standard card below to view details and standard metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Moisture Testing */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div 
              className="relative h-[360px] overflow-hidden bg-gray-50 cursor-pointer group"
              onClick={() => setActiveModalImage({
                src: IMAGES.moistureTesting,
                title: "Digital Moisture Testing",
                description: "Moisture is monitored inside the yard and prior to compression using calibrated digital pin meters. Low moisture levels ensure blocks do not degrade or form mold during long-duration sea container shipping.",
                detail: "Standard < 15% - Sun-dried & oven-verified batch validation"
              })}
            >
              <img 
                src={IMAGES.moistureTesting} 
                alt="Digital Moisture Testing" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <span className="absolute top-4 right-4 bg-[#102A1D] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Standard &lt; 15%
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#102A1D] mb-2">Digital Moisture Testing</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Moisture is monitored inside the yard and prior to compression using calibrated digital pin meters. Low moisture levels ensure blocks do not degrade or form mold during long-duration sea container shipping.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <svg className="w-4 h-4 text-[#C97B38]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Sun-dried &amp; oven-verified batch validation</span>
              </div>
            </div>
          </div>

          {/* Card 2: Electrical Conductivity (EC) */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div 
              className="relative h-[360px] overflow-hidden bg-gray-50 cursor-pointer group"
              onClick={() => setActiveModalImage({
                src: IMAGES.ecTesting,
                title: "Electrical Conductivity (EC)",
                description: "Using a standard 1:1.5 volume dilution method, our lab verifies salt indexes. Minimizing electrical conductivity protects sensitive roots from chemical burns and ensures optimal fertilizer absorption.",
                detail: "Low EC < 0.5 mS/cm - Triple-washed in fresh deep-bore well water"
              })}
            >
              <img 
                src={IMAGES.ecTesting} 
                alt="Electrical Conductivity (EC) Testing" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <span className="absolute top-4 right-4 bg-[#C97B38] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Low EC &lt; 0.5 mS/cm
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#102A1D] mb-2">Electrical Conductivity (EC)</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Using a standard 1:1.5 volume dilution method, our lab verifies salt indexes. Minimizing electrical conductivity protects sensitive roots from chemical burns and ensures optimal fertilizer absorption.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <svg className="w-4 h-4 text-[#C97B38]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Triple-washed in fresh deep-bore well water</span>
              </div>
            </div>
          </div>

          {/* Card 3: pH Level Verification */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div 
              className="relative h-[360px] overflow-hidden bg-gray-50 cursor-pointer group"
              onClick={() => setActiveModalImage({
                src: IMAGES.phTesting,
                title: "pH Level Verification",
                description: "Frequent dilution testing confirms that the coco coir remains in the ideal slightly acidic range of 5.5 to 6.5. This pH window optimizes nutrient bioavailability (nitrogen, phosphorus, iron) for hydroponics.",
                detail: "pH 5.5 - 6.5 - Calibrated digital benchtop probes"
              })}
            >
              <img 
                src={IMAGES.phTesting} 
                alt="pH Level Verification" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <span className="absolute top-4 right-4 bg-[#102A1D] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                pH 5.5 - 6.5
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#102A1D] mb-2">pH Level Verification</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Frequent dilution testing confirms that the coco coir remains in the ideal slightly acidic range of 5.5 to 6.5. This pH window optimizes nutrient bioavailability (nitrogen, phosphorus, iron) for hydroponics.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <svg className="w-4 h-4 text-[#C97B38]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Calibrated digital benchtop probes</span>
              </div>
            </div>
          </div>

          {/* Card 4: Weight & Density Checks */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div 
              className="relative h-[360px] overflow-hidden bg-gray-50 cursor-pointer group"
              onClick={() => setActiveModalImage({
                src: IMAGES.densityTesting,
                title: "Weight & Compression Density",
                description: "We monitor the physical dimensions and dry weight of every compressed block. Precision hydraulic pressing ensures the required volume expansion (minimum 75 Liters of yield per 5kg block) is met.",
                detail: "5kg / Briquette Accuracy - Automated rejection scale systems"
              })}
            >
              <img 
                src={IMAGES.densityTesting} 
                alt="Weight & Compression Density Checks" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <span className="absolute top-4 right-4 bg-[#C97B38] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                5kg / Briquette Accuracy
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#102A1D] mb-2">Weight &amp; Compression Density</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                We monitor the physical dimensions and dry weight of every compressed block. Precision hydraulic pressing ensures the required volume expansion (minimum 75 Liters of yield per 5kg block) is met.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <svg className="w-4 h-4 text-[#C97B38]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Automated rejection scale systems</span>
              </div>
            </div>
          </div>

          {/* Card 5: Video Demonstration */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1 md:col-span-2 lg:col-span-2 flex flex-col md:flex-row">
            <div className="relative w-full md:w-[45%] h-56 md:h-auto overflow-hidden bg-gray-950 group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
              <video 
                src={VIDEOS.labTestingUrl} 
                preload="metadata"
                muted
                playsInline
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 opacity-80" 
              />
              <div className="absolute inset-0 bg-[#102A1D]/20 group-hover:bg-[#102A1D]/10 transition-colors" />
              {/* Play Button Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#E5A93C] text-[#102A1D] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                  <polygon points="5 3 19 12 5 21" />
                </svg>
              </div>
              <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded">
                Live Video Check
              </span>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C97B38] mb-1.5 block">
                  Video Demonstration
                </span>
                <h3 className="text-xl font-bold text-[#102A1D] mb-3">Live Laboratory Testing Walkthrough</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Watch our laboratory technicians execute standard moisture checks, electrical conductivity washing calibrations, and core density testing processes live inside the Mariah production plant.
                </p>
              </div>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="w-fit text-sm font-bold text-[#C97B38] hover:text-[#b0672b] flex items-center gap-2 group cursor-pointer"
              >
                <span>Launch Video Player</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─── PROCESS & TIMELINE ─────────────────────────────────────── */}
      <section className="bg-[#102A1D] text-white py-24 px-6 sm:px-12 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C97B38]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold tracking-[3px] text-[#E5A93C] uppercase">QC Timeline</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-4">
              Our 4-Phase Quality Protocol
            </h2>
            <p className="text-white/70">
              We monitor quality from the incoming raw material to the final container locking, ensuring every exported batch meets certified specification metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Timeline line (desktop) */}
            <div className="hidden lg:block absolute top-[52px] left-[5%] right-[5%] h-[1.5px] bg-white/10 z-0" />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-start">
              <div className="w-16 h-16 rounded-full bg-[#1b3e2b] border-2 border-[#E5A93C] text-[#E5A93C] font-extrabold text-xl flex items-center justify-center shadow-lg mb-6">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Raw Material Inspection</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Pith is sourced exclusively from selected local coir yards. We check for aging consistency (minimum 6 months) and verify fibre contents before accepting raw loads.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-start">
              <div className="w-16 h-16 rounded-full bg-[#1b3e2b] border-2 border-[#E5A93C] text-[#E5A93C] font-extrabold text-xl flex items-center justify-center shadow-lg mb-6">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Washing &amp; Sun-Drying</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Pith is spread out on clean concrete yards to dry. Our sun-drying supervisors track cloud cover and wind, turning the pith dynamically to maintain even drying.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-start">
              <div className="w-16 h-16 rounded-full bg-[#1b3e2b] border-2 border-[#E5A93C] text-[#E5A93C] font-extrabold text-xl flex items-center justify-center shadow-lg mb-6">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Moisture &amp; Pin Checks</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Prior to feeding hydraulic compression presses, batch samples are tested using moisture meters and pin density gauges to ensure standard packing ratios are satisfied.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-start">
              <div className="w-16 h-16 rounded-full bg-[#1b3e2b] border-2 border-[#E5A93C] text-[#E5A93C] font-extrabold text-xl flex items-center justify-center shadow-lg mb-6">
                04
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pre-Shipment Inspection</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                A final laboratory report is compiled for the complete batch. Phytosanitary certificates and final batch approval documents are issued prior to container dispatch.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── BOTTOM CALL TO ACTION ──────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 bg-[#F8F6F3]">
        <div className="max-w-[960px] mx-auto bg-gradient-to-br from-[#102A1D] to-[#163a28] rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#C97B38]/5 backdrop-blur-[1px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-[3px] text-[#E5A93C] uppercase mb-4 block">B2B Samples &amp; Reports</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
              Need Custom Batch Testing or Lab Reports?
            </h2>
            <p className="text-white/70 mb-10 leading-relaxed">
              We provide free batch laboratory test reports and physical samples to verified global importers and distribution organizations. Select your specifications below.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => openModal('export')}
                className="px-8 py-4 bg-[#E5A93C] hover:bg-[#c99532] text-[#102A1D] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Request Batch Samples
              </button>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                Contact Laboratory Office
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VIDEO MODAL DIALOG ─────────────────────────────────────── */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ ease: EASE_CUBIC, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[800px] bg-[#102A1D] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="text-white font-bold tracking-tight">Live Lab Batch Testing Walkthrough</h3>
                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg cursor-pointer"
                  aria-label="Close video modal"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Video Content */}
              <div className="relative aspect-video bg-black">
                {/* Standard video element with dynamic variable path */}
                <video 
                  src={VIDEOS.labTestingUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Footer text */}
              <div className="px-6 py-4 bg-[#0d2218] text-xs text-white/50 leading-relaxed">
                <span className="font-semibold text-[#E5A93C] uppercase block mb-1">Testing Protocol Demonstration</span>
                This video walks through the electrical conductivity calibration checks, weight density verifications, and final pre-shipment phytosanitary procedures conducted at the Nilakottai Factory.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── IMAGE MODAL DIALOG ─────────────────────────────────────── */}
      <AnimatePresence>
        {activeModalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ ease: EASE_CUBIC, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[800px] bg-[#102A1D] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="text-white font-bold tracking-tight">{activeModalImage.title}</h3>
                <button 
                  onClick={() => setActiveModalImage(null)}
                  className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg cursor-pointer"
                  aria-label="Close image modal"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image Content */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <img 
                  src={activeModalImage.src}
                  alt={activeModalImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Footer text */}
              <div className="px-6 py-4 bg-[#0d2218] text-xs text-white/50 leading-relaxed">
                <span className="font-semibold text-[#E5A93C] uppercase block mb-1">{activeModalImage.detail}</span>
                {activeModalImage.description}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
