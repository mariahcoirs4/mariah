import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ModalProvider } from './context/ModalContext'
import BulkPricingModal from './components/BulkPricingModal'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ProductsSection from './components/ProductsSection'
import WhyChooseSection from './components/WhyChooseSection'
import IndustriesSection from './components/IndustriesSection'
import ProcessSection from './components/ProcessSection'
import GallerySection from './components/GallerySection'
import CertificationsSection from './components/CertificationsSection'
// import GlobalNetworkSection from './components/GlobalNetworkSection'
import DomesticSupplySection from './components/DomesticSupplySection'
import FAQSection from './components/FAQSection'
import ContactSection from './components/ContactSection'
import BlogListing from './pages/BlogListing'
import BlogDetail from './pages/BlogDetail'
import AdminPortal from './pages/AdminPortal'
import FloatingActions from './components/FloatingActions'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// ─── SEO Pages ───────────────────────────────────────────────────
import AboutPage from './pages/AboutPage'
import ProductsPage from './pages/ProductsPage'
import FAQPage from './pages/FAQPage'
import CertificationsPage from './pages/CertificationsPage'
import ContactPage from './pages/ContactPage'
import ExportProcessPage from './pages/ExportProcessPage'
import IndustriesPage from './pages/IndustriesPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import SitemapPage from './pages/SitemapPage'
import GalleryPage from './pages/GalleryPage'

import { useSEO, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from './hooks/useSEO'

const SITE_URL = 'https://www.mariahcoirsexport.com'

// ─── Landing Page (all sections) ─────────────────────────────────
function LandingPage() {
  useSEO({
    title: 'Mariah Coirs | Premium Coir Products Exporter from India',
    description:
      "India's premier manufacturer and exporter of premium coco peat blocks, coir fiber, grow bags, husk chips, and coir briquettes. ISO 9001:2015 certified. Supplying 50+ countries since 2009. Factory in Pollachi, Tamil Nadu.",
    canonical: `${SITE_URL}/`,
    keywords:
      'coco peat exporter India, coir products manufacturer, cocopeat blocks, coir fiber supplier, grow bags exporter, coir pith, husk chips, Pollachi coir, Tamil Nadu coir exporter, ISO certified coir',
    jsonLd: [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
  })

  return (
    <>
      <BulkPricingModal />
      <Navbar />
      <main className="pb-[calc(72px+env(safe-area-inset-bottom,0px))] md:pb-0">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <WhyChooseSection />
        <IndustriesSection />
        <ProcessSection />
        <GallerySection />
        <CertificationsSection />
        {/* <GlobalNetworkSection /> */}
        <DomesticSupplySection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}

// ─── Public Layout (Navbar + Footer wrapper) ──────────────────────
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BulkPricingModal />
      <Navbar />
      {children}
      <Footer />
      <FloatingActions />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ModalProvider>
        <Routes>
          {/* Home */}
          <Route path="/" element={<LandingPage />} />

          {/* Blog */}
          <Route path="/blogs" element={<PublicLayout><BlogListing /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />

          {/* SEO Pages */}
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          <Route path="/certifications" element={<PublicLayout><CertificationsPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/export-process" element={<PublicLayout><ExportProcessPage /></PublicLayout>} />
          <Route path="/industries" element={<PublicLayout><IndustriesPage /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />

          {/* Legal & Utility */}
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
          <Route path="/sitemap" element={<PublicLayout><SitemapPage /></PublicLayout>} />

          {/* Admin — not indexed */}
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  )
}

export default App
