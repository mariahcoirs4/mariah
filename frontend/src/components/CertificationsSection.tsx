import { motion } from 'framer-motion';

const CREDENTIALS = [
  { title: 'ISO 9001:2015', type: 'Quality Management', description: 'Quality management practices supporting consistent production and customer requirements.' },
  { title: 'Coir Board Registered', type: 'Industry Registration', description: 'Registered within India’s coir industry ecosystem for responsible manufacturing and trade.' },
  { title: 'Phytosanitary Documentation', type: 'Export Compliance', description: 'Required plant-health documentation can be coordinated for applicable international shipments.' },
  { title: 'Batch Quality Reports', type: 'Shipment Assurance', description: 'EC, pH and moisture test information is prepared for export batches and container shipments.' },
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="relative w-full overflow-hidden bg-[#10100F] py-20 lg:py-28 scroll-mt-20" aria-labelledby="certifications-title">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_15%,rgba(229,169,60,0.12),transparent_38%)]" />
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-[720px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E5A93C]">Quality & Compliance</span>
          <h2 id="certifications-title" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Standards Behind Every Shipment</h2>
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/60">
            Our quality systems, industry registration and export documentation help buyers receive consistent, shipment-ready coir products.
          </p>
        </div>

        <div className="mt-10 lg:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {CREDENTIALS.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#E5A93C]/30 bg-[#E5A93C]/10 text-[#E5A93C] flex items-center justify-center" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7 12 3 3 7-7"/><circle cx="12" cy="12" r="9"/></svg>
              </div>
              <span className="block mt-4 sm:mt-5 text-[10px] sm:text-[10px] font-bold uppercase tracking-wider text-[#E5A93C]">{item.type}</span>
              <h3 className="mt-2 text-base sm:text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-white/55">{item.description}</p>
            </motion.article>
          ))}
        </div>

        <p className="mt-7 text-xs leading-relaxed text-white/40">
          Certificate copies and shipment-specific documents are available to qualified buyers upon request.
        </p>
      </div>
    </section>
  );
}
