import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function NotFoundPage() {
  useSEO({
    title: '404 - Page Not Found | Mariah Coirs',
    description: 'The page you are looking for does not exist. Browse our premium coco peat catalog or contact our export team.',
    noIndex: true, // Crucial so search engines do not index 404 pages
  });

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F5F1EB' }}>
      {/* Spacer to push content past header */}
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <div 
            className="text-8xl font-black mb-6" 
            style={{ color: '#C99B67', textShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            404
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
            Mariah Coirs manufactures premium coco peat and coir export products from Nilakottai, Tamil Nadu.
          </p>

          {/* Quick Links for Crawlers and Users */}
          <div className="w-full flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200"
              style={{
                background: '#0F0A04',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              Go to Home Page
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm text-gray-800 border transition-all duration-200 hover:bg-black/5"
              style={{
                background: '#FFFFFF',
                borderColor: 'rgba(0,0,0,0.12)',
              }}
            >
              View Products
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            Need immediate assistance? 
            <Link to="/contact" className="ml-1 font-semibold text-[#C99B67] hover:underline">
              Contact our export desk
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
