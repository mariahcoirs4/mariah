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

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy | Mariah Coirs',
    description: 'Read Mariah Coirs\' privacy policy — how we collect, use, and protect personal information submitted through our website and export enquiry forms.',
    canonical: `${SITE_URL}/privacy`,
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
            <span style={{ color: '#C99B67' }}>Privacy Policy</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '14px', color: '#667085', marginTop: '12px' }}>Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <main style={{ padding: '60px 24px 80px' }}>
        <div style={PROSE_STYLE}>
          <p>Mariah Coirs ("we", "our", or "us") is committed to protecting the personal information you share with us. This Privacy Policy explains what data we collect, how we use it, and how we safeguard it.</p>

          <h2 style={H2_STYLE}>1. Information We Collect</h2>
          <p>We collect personal information you voluntarily provide when you:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Submit an export or domestic enquiry form</li>
            <li style={{ marginBottom: '0.5rem' }}>Request a product sample or bulk pricing quote</li>
            <li style={{ marginBottom: '0.5rem' }}>Contact us by email or phone</li>
          </ul>
          <p>The information we collect may include your name, company name, email address, phone number, country, and the nature of your enquiry.</p>

          <h2 style={H2_STYLE}>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Respond to your enquiry and provide product pricing or logistics information</li>
            <li style={{ marginBottom: '0.5rem' }}>Improve the quality of our products and services</li>
            <li style={{ marginBottom: '0.5rem' }}>Maintain internal records for business operations</li>
          </ul>
          <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

          <h2 style={H2_STYLE}>3. Data Retention</h2>
          <p>We retain enquiry data for a reasonable period necessary to fulfill your request and comply with applicable business and legal requirements. You may contact us at any time to request deletion of your data.</p>

          <h2 style={H2_STYLE}>4. Cookies</h2>
          <p>Our website may use essential cookies required for site functionality. We do not use tracking cookies for advertising purposes. Third-party analytics tools, if used, process data in accordance with their own privacy policies.</p>

          <h2 style={H2_STYLE}>5. Security</h2>
          <p>We implement commercially reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is completely secure.</p>

          <h2 style={H2_STYLE}>6. Your Rights</h2>
          <p>You have the right to access, correct, or request deletion of the personal information we hold about you. To exercise these rights, please contact us at <a href="mailto:exports@mariahcoirsexport.com" style={{ color: '#C99B67' }}>exports@mariahcoirsexport.com</a>.</p>

          <h2 style={H2_STYLE}>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised date. Continued use of the site after any changes constitutes acceptance of the updated policy.</p>

          <h2 style={H2_STYLE}>8. Contact Us</h2>
          <p>If you have questions or concerns about this policy, please contact us:</p>
          <p><strong>Mariah Coirs Pvt. Ltd.</strong><br />Pollachi, Tamil Nadu — 642 002, India<br />Email: <a href="mailto:exports@mariahcoirsexport.com" style={{ color: '#C99B67' }}>exports@mariahcoirsexport.com</a></p>
        </div>
      </main>
    </div>
  );
}
