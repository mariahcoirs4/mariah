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
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_15%,rgba(201,155,103,0.12),transparent_38%)]" />
      <div className="relative max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-[720px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D8A166]">Quality & Compliance</span>
          <h2 id="certifications-title" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Standards Behind Every Shipment</h2>
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/60">
            Our quality systems, industry registration and export documentation help buyers receive consistent, shipment-ready coir products.
          </p>
        </div>

        <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDENTIALS.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:p-7"
            >
              <div className="w-11 h-11 rounded-full border border-[#D8A166]/40 bg-[#D8A166]/10 text-[#D8A166] flex items-center justify-center" aria-hidden="true">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7 12 3 3 7-7"/><circle cx="12" cy="12" r="9"/></svg>
              </div>
              <span className="block mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8A166]">{item.type}</span>
              <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{item.description}</p>
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
