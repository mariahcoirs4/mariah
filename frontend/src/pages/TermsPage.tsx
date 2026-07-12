import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

const PROSE_STYLE: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: 1.85,
  color: '#374151',
  maxWidth: '760px',
  margin: '0 auto',
};

const H2_STYLE: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 800,
  color: '#111111',
  margin: '2.5rem 0 1rem',
  letterSpacing: '-0.02em',
};

export default function TermsPage() {
  useSEO({
    title: 'Terms & Conditions | Mariah Coirs',
    description: 'Review the Terms and Conditions governing use of the Mariah Coirs website and purchase of coir products. Includes payment terms, shipping conditions, and limitation of liability.',
    canonical: `${SITE_URL}/terms`,
    noIndex: false,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Hero */}
      <section style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#A0A0A0', marginBottom: '24px' }}>
            <Link to="/" style={{ color: '#A0A0A0', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >Home</Link>
            <span>/</span>
            <span style={{ color: '#C99B67' }}>Terms &amp; Conditions</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: '14px', color: '#667085', marginTop: '12px' }}>Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <main style={{ padding: '60px 24px 80px' }}>
        <div style={PROSE_STYLE}>
          <p>By accessing or using the Mariah Coirs website and submitting an enquiry or order, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>

          <h2 style={H2_STYLE}>1. General</h2>
          <p>These Terms govern your use of the Mariah Coirs website at <a href="https://www.mariahcoirsexport.com" style={{ color: '#C99B67' }}>www.mariahcoirsexport.com</a> and any commercial relationship established through enquiry forms or direct communication.</p>

          <h2 style={H2_STYLE}>2. Product Information</h2>
          <p>Product specifications, images, and descriptions provided on this website are for informational purposes. Actual product dimensions, EC values, pH levels, and moisture content may be confirmed through our quality certificates issued at the time of shipment.</p>

          <h2 style={H2_STYLE}>3. Orders and Pricing</h2>
          <p>All pricing is subject to change without notice and is provided as a quotation only until a formal purchase order and payment terms are agreed in writing. Prices are quoted FOB, CIF, CNF, or CFR as mutually agreed.</p>

          <h2 style={H2_STYLE}>4. Payment Terms</h2>
          <p>Standard payment is accepted via Letter of Credit (LC) at sight or Telegraphic Transfer (TT). A confirmed advance deposit may be required before production begins. Specific payment terms will be outlined in the formal quotation or proforma invoice.</p>

          <h2 style={H2_STYLE}>5. Shipping and Delivery</h2>
          <p>Estimated dispatch and delivery timelines are provided in good faith and may vary due to production schedules, port conditions, and shipping carrier availability. Risk of loss passes to the buyer in accordance with the agreed Incoterms.</p>

          <h2 style={H2_STYLE}>6. Quality Claims</h2>
          <p>Any quality claims must be submitted in writing within 14 days of receipt of goods, accompanied by photographic evidence and independent laboratory reports where applicable. Claims submitted after this period may not be accepted.</p>

          <h2 style={H2_STYLE}>7. Limitation of Liability</h2>
          <p>Mariah Coirs' total liability for any claim arising out of a transaction shall not exceed the invoice value of the goods in question. We are not liable for indirect, incidental, or consequential damages.</p>

          <h2 style={H2_STYLE}>8. Intellectual Property</h2>
          <p>All content on this website, including logos, images, and text, is the property of Mariah Coirs and may not be reproduced or redistributed without written permission.</p>

          <h2 style={H2_STYLE}>9. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dindigul District, Tamil Nadu.</p>

          <h2 style={H2_STYLE}>10. Contact</h2>
          <p>For any questions about these Terms, contact us at:<br /><strong>Mariah Coirs Pvt. Ltd.</strong><br />206-13B Krishnapuram Road, Kalladipatti,<br />Nilakottai, Dindigul District, Tamil Nadu — 624 201, India<br />Email: <a href="mailto:exports@mariahcoirsexport.com" style={{ color: '#C99B67' }}>exports@mariahcoirsexport.com</a></p>
        </div>
      </main>
    </div>
  );
}
