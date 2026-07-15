import { Link } from 'react-router-dom';
import FAQSection from '../components/FAQSection';
import { useSEO, breadcrumbSchema, faqSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

const FAQ_DATA = [
  {
    question: 'What is your Minimum Order Quantity (MOQ)?',
    answer:
      'Our MOQ varies depending on the region and shipping method. For international export orders, the MOQ is 1 Full Container Load (FCL). For domestic orders across India, the general MOQ is 5 Metric Tons (MT). Please note that the minimum order quantity in Tamil Nadu is 16 tons.',
  },
  {
    question: 'Where are your manufacturing facilities located?',
    answer:
      'Our state-of-the-art production facilities are based in Kalladipatti, Nilakottai, Dindigul District, Tamil Nadu, India. Nilakottai is recognized as a prime agricultural and coir production hub of South India, allowing us direct access to premium quality raw materials year-round.',
  },
  {
    question: 'Do you offer private labeling (OEM) and custom packaging?',
    answer:
      'Yes, we specialize in private labeling and custom packaging. We can customize block sizes (e.g., 5kg blocks, 650g briquettes), open-top bags, and grow bags. We also support custom BOPP bag printing, carton designs, and multilingual product labeling to align with your brand.',
  },
  {
    question: 'What quality standards and certifications do you follow?',
    answer:
      'We are ISO 9001:2015 certified and registered with the Coir Board of India. All shipments undergo rigorous testing in our in-house laboratory, and we issue certificates for Electrical Conductivity (EC), pH levels, expansion volume, and moisture content. For exports, we provide standard Phytosanitary and Fumigation Certificates.',
  },
  {
    question: 'Can we request product samples before ordering?',
    answer:
      'Yes! We encourage prospective partners to evaluate our product quality first. We provide sample packs for low EC coco peat blocks, grow bags, and husk chips. Contact our team, and we will arrange sample dispatch to your business location.',
  },
  {
    question: 'What are the payment and shipping terms you support?',
    answer:
      'We offer flexible shipping terms including FOB, CIF, CNF, and CFR to major ports worldwide. Payments are typically handled via LC (Letter of Credit) at sight or TT (Telegraphic Transfer) with a standard advance deposit.',
  },
];

export default function FAQPage() {
  useSEO({
    title: 'FAQ | Coir Products Export Questions — Mariah Coirs',
    description:
      'Find answers to common questions about Mariah Coirs coir products: MOQ, certifications, private labeling, shipping terms, sample requests, and payment options for international and domestic buyers.',
    canonical: `${SITE_URL}/faq`,
    keywords: 'coir products FAQ, coco peat MOQ, coir export questions, coir shipping terms, coir certifications, cocopeat supplier questions',
    jsonLd: [
      faqSchema(FAQ_DATA),
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'FAQ', url: `${SITE_URL}/faq` },
      ]),
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="FAQ page header"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#A0A0A0', marginBottom: '24px' }}
          >
            <Link to="/" style={{ color: '#A0A0A0', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >Home</Link>
            <span>/</span>
            <span style={{ color: '#C99B67' }}>FAQ</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Got Questions?
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            Quick answers on MOQ, certifications, packaging, shipping terms, and ordering from Mariah Coirs.
          </p>
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
