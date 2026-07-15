import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import ContactSection from '../components/ContactSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

// ─── Social Media Icons ──────────────────────────────────────────
const FacebookIcon = () => <FaFacebookF size={18} />;
const InstagramIcon = () => <FaInstagram size={18} />;
const YoutubeIcon = () => <FaYoutube size={18} />;
const WhatsappIcon = () => <FaWhatsapp size={18} />;



export default function ContactPage() {
  useSEO({
    title: 'Contact Mariah Coirs | Export Enquiries & Bulk Orders',
    description:
      'Contact Mariah Coirs export team for coir product enquiries, bulk pricing, and shipping quotes. Based in Nilakottai, Dindigul District, Tamil Nadu. Responds within 24 hours. FOB, CIF, CNF shipping to 50+ countries.',
    canonical: `${SITE_URL}/contact`,
    keywords: 'contact Mariah Coirs, coir export enquiry, cocopeat bulk order, coir supplier contact, export quote India',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Contact', url: `${SITE_URL}/contact` },
      ]),
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="Contact page header"
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
            <span style={{ color: '#C99B67' }}>Contact</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Get in Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            Contact Our Export Team
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            Whether you're importing from overseas or sourcing in bulk across India — our team responds within 24 hours with pricing, specs, and logistics support.
          </p>
        </div>
      </section>

      <ContactSection />

      {/* Social Media Links Section */}
      <section className="pb-16 sm:pb-24 lg:pb-28" style={{ background: '#F5F1EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-center gap-4">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#C99B67] uppercase text-center">
            Connect with Us
          </span>
          <div className="flex gap-4 items-center justify-center">
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
      </section>
    </div>
  );
}

