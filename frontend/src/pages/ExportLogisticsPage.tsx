import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema, faqSchema } from '../hooks/useSEO';
import { useModal } from '../context/ModalContext';

// ─── Image & Video Placeholders ─────────────────────────────────────
// Easy to swap variables for user's Google Drive image/video links
const IMAGES = {
  warehouseStorage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', // warehouses & systematic blocks
  palletization: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80', // pallets & shrink wrap packing
  containerStuffing: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80', // container stuffing loading
  dispatchThumb: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=800&q=80', // dispatch truck departure
};

const VIDEOS = {
  dispatchVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // sample mp4, easily swappable
};

const FAQS = [
  {
    question: 'How many tons fit in a 40ft High Cube container?',
    answer: 'A standard 40ft High Cube (HC) container can hold up to 26 metric tons (MT) of compressed coir blocks. For palletized loading, it accommodates approximately 22 to 24 MT, depending on the block configuration (5kg blocks vs. smaller briquettes) and packaging requirements.',
  },
  {
    question: 'How do you protect coir blocks from moisture during ocean transport?',
    answer: 'Every container is lined with a heavy-duty inner moisture barrier seal (container dry liners). We also place high-absorption silica gel desiccants inside the cargo area and secure the pallets with multi-layered UV-stabilized stretch wraps to prevent condensation during transport through varying climate zones.',
  },
  {
    question: 'Can you provide photos/videos of our specific container being loaded?',
    answer: 'Yes, absolutely. As part of our standard dispatch protocol, we provide B2B clients with a complete loading report. This includes high-definition photographs and video recordings showing the tare-weight scale, block count validation, shrink-wrapping details, pallet arrangement, and the final shipping container door-locking seal number.',
  },
];

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ExportLogisticsPage() {
  const { openModal } = useModal();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const SITE_URL = 'https://www.mariahcoirsexport.com';

  useSEO({
    title: 'Factory, Bulk Storage & Export Logistics Operations | Mariah Coirs',
    description:
      'Explore Mariah Coirs’ container dispatch capacities, warehousing scale, palletization systems, and ocean shipping moisture barrier protection protocols for reliable monthly bulk coir shipments.',
    canonical: `${SITE_URL}/export-logistics`,
    keywords: 'coir export logistics, 40ft container coir capacity, coir palletization, coco peat storage warehouse, Tuticorin sea port coir, container dry liner, coir block shipping, Chennai coir exporter',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Factory & Logistics', url: `${SITE_URL}/export-logistics` },
      ]),
      faqSchema(FAQS),
    ],
  });

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header spacer */}
      <div className="h-[100px]" aria-hidden="true" />

      {/* ─── HERO BANNER ────────────────────────────────────────────── */}
      <section 
        className="relative overflow-hidden bg-[#102A1D] text-white py-20 px-6 sm:px-12"
        aria-label="Export Logistics Hero"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C97B38]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto flex flex-col items-start">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50 mb-8">
            <Link to="/" className="hover:text-[#E5A93C] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#E5A93C]">Export Logistics</span>
          </nav>

          <span className="inline-block text-[11px] font-extrabold uppercase tracking-[4px] text-[#E5A93C] mb-4">
            Global Fulfillment Infrastructure
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mb-6">
            Large-Scale Storage &amp; Global Dispatch Operations
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed mb-10">
            Mariah Coirs is equipped to handle bulk container volume with precision block packing, heavy-duty palletization, and advanced moisture-protected transit seals.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#gallery-logistics"
              className="px-8 py-4 bg-[#E5A93C] hover:bg-[#c99532] text-[#102A1D] font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              View Dispatch Operations
            </a>
            <button
              onClick={() => openModal('export')}
              className="px-8 py-4 bg-transparent border border-white/30 hover:border-white text-white font-semibold rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Inquire Container Capacity</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ─── OPERATIONS GALLERY ──────────────────────────────────────── */}
      <section id="gallery-logistics" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[3px] text-[#C97B38] uppercase">Visual Walkthrough</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A1D] tracking-tight mt-2 mb-4">
            Inside Our Factory &amp; Loading Operations
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Take a visual tour through our dedicated warehousing storage corridors, automated block stacking configurations, container stuffing bays, and global port dispatch runs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Slot 1: Warehouse Storage */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md group">
            <div className="relative h-64 bg-gray-200 overflow-hidden">
              <img 
                src={IMAGES.warehouseStorage} 
                alt="Warehouse Storage" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-[#102A1D] text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                  Capacity
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  Warehouse Storage &amp; Systematic Block Stacking
                </h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-500 text-xs leading-relaxed">
                Our dry indoor storage facility stores up to 2,500 metric tons of compressed coir blocks, isolated from dirt and humidity to guarantee clean, dry products.
              </p>
            </div>
          </div>

          {/* Slot 2: Palletization & Wrap */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md group">
            <div className="relative h-64 bg-gray-200 overflow-hidden">
              <img 
                src={IMAGES.palletization} 
                alt="Palletization & Wrap" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-[#C97B38] text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                  Protection
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  Palletization &amp; Shrink-Wrap Protection
                </h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-500 text-xs leading-relaxed">
                Standard B2B cargo is placed on heat-treated wooden pallets, secured with cardboard corner guards, and wrapped in heavy-duty weatherproof stretch film.
              </p>
            </div>
          </div>

          {/* Slot 3: Container Stuffing */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md group">
            <div className="relative h-64 bg-gray-200 overflow-hidden">
              <img 
                src={IMAGES.containerStuffing} 
                alt="Direct Container Stuffing" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-[#102A1D] text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                  Loading
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  Direct Container Stuffing &amp; Truck Loading
                </h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-500 text-xs leading-relaxed">
                With a loading platform directly connected to the warehouse floor, our team stuffs containers efficiently, preventing exposure to rain or direct sunshine.
              </p>
            </div>
          </div>

          {/* Slot 4: Video Container Dispatch */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md group">
            <div 
              className="relative h-64 bg-gray-900 overflow-hidden cursor-pointer"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <img 
                src={IMAGES.dispatchThumb} 
                alt="Live Container Dispatch Video" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" 
              />
              <div className="absolute inset-0 bg-[#102A1D]/30 group-hover:bg-[#102A1D]/15 transition-colors" />
              
              {/* Play Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#E5A93C] text-[#102A1D] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                  <polygon points="5 3 19 12 5 21" />
                </svg>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="bg-black/60 text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                  Live Dispatch
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  Loading &amp; Dispatch Process Demonstration
                </h3>
              </div>
            </div>
            <div className="p-5 flex flex-col justify-between h-[90px]">
              <p className="text-gray-500 text-xs leading-relaxed">
                Watch container loading runs, double checking weight sheets, moisture levels, and seal attachments live.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── KEY LOGISTICS SPECS ────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 sm:px-12 border-y border-gray-100">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-[3px] text-[#C97B38] uppercase">Container dispatch capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A1D] tracking-tight mt-2 mb-4">
              Fulfillment Infrastructure Metrics
            </h2>
            <p className="text-gray-600">
              We focus on speed, durability, and bulk consistency to keep global agribusinesses running smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Spec Card 1 */}
            <div className="p-8 bg-[#F8F6F3] rounded-2xl border border-gray-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#102A1D] rounded-xl flex items-center justify-center text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#102A1D]">Bulk Packaging Options</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose from customized B2B formats: palletized stacking with corner support, naked blocks stuffed directly for maximum container volume, or single-block shrink wraps.
              </p>
            </div>

            {/* Spec Card 2 */}
            <div className="p-8 bg-[#F8F6F3] rounded-2xl border border-gray-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#102A1D] rounded-xl flex items-center justify-center text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="text-xs font-bold text-[#C97B38] tracking-wider uppercase -mb-2">FAST DISPATCH</div>
              <h3 className="text-lg font-bold text-[#102A1D]">Sea Port Readiness</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Conveniently situated near major South Indian logistics gateways (Tuticorin Sea Port is 190 km away; Chennai Sea Port is 440 km away), ensuring fast export runs.
              </p>
            </div>

            {/* Spec Card 3 */}
            <div className="p-8 bg-[#F8F6F3] rounded-2xl border border-gray-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#102A1D] rounded-xl flex items-center justify-center text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#102A1D]">Moisture Barrier Seal</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Heavy desiccants combined with premium protective container liners isolate shipments from condensation, high humidity, and temperature variations at sea.
              </p>
            </div>

            {/* Spec Card 4 */}
            <div className="p-8 bg-[#F8F6F3] rounded-2xl border border-gray-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#102A1D] rounded-xl flex items-center justify-center text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="text-xs font-bold text-[#C97B38] tracking-wider uppercase -mb-2">1,000+ MT / MO</div>
              <h3 className="text-lg font-bold text-[#102A1D]">High Capacity Output</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                With reliable monthly manufacturing capacity, we maintain continuous shipment runs to support large greenhouses and commercial distribution networks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FAQ ACCORDION SECTION ──────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 max-w-[960px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[3px] text-[#C97B38] uppercase">Common Inquiries</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A1D] tracking-tight mt-2 mb-4">
            Operations &amp; Logistics FAQ
          </h2>
          <p className="text-gray-600">
            Frequently asked questions from global importers, distributors, and farm operators concerning bulk container shipping.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div 
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 font-bold text-[#102A1D] hover:text-[#C97B38] transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <span className={`w-8 h-8 rounded-full bg-[#F8F6F3] text-[#102A1D] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#C97B38] text-white' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_CUBIC }}
                    >
                      <div className="px-8 pb-6 text-sm sm:text-base text-gray-600 border-t border-gray-50/50 pt-4 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── BOTTOM CALL TO ACTION ──────────────────────────────────── */}
      <section className="py-24 px-6 sm:px-12 bg-[#F8F6F3]">
        <div className="max-w-[960px] mx-auto bg-gradient-to-br from-[#102A1D] to-[#163a28] rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#C97B38]/5 backdrop-blur-[1px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-[3px] text-[#E5A93C] uppercase mb-4 block">Ocean Transit Schedules</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
              Ready to Lock In Container Allocations?
            </h2>
            <p className="text-white/70 mb-10 leading-relaxed">
              We accept contracts for custom size layouts, palletized loads, and monthly container volume reserves. Secure your logistics pipeline with us today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => openModal('export')}
                className="px-8 py-4 bg-[#E5A93C] hover:bg-[#c99532] text-[#102A1D] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Inquire Container Capacity
              </button>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/50 text-white font-semibold rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                Request Port Schedules
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
                <h3 className="text-white font-bold tracking-tight">Live Container Dispatch Walkthrough</h3>
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
                  src={VIDEOS.dispatchVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Footer text */}
              <div className="px-6 py-4 bg-[#0d2218] text-xs text-white/50 leading-relaxed">
                <span className="font-semibold text-[#E5A93C] uppercase block mb-1">Loading Protocol Demonstration</span>
                This video shows the pallet securement, desiccants dispersion, moisture barrier liners installation, direct stuffing loading, and locking inspection conducted at our loading platforms.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
