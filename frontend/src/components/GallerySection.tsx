import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const GALLERY_IMAGES = [
  { src: '/mariahcoirs/droven_view.jpeg', title: 'Manufacturing Facility' },
  { src: '/mariahcoirs/machine_process.jpeg', title: 'Coir Processing' },
  { src: '/mariahcoirs/process.jpeg', title: 'Washing Process' },
  { src: '/mariahcoirs/mills_top_view.jpeg', title: 'Production Yard' },
  { src: '/mariahcoirs/coco_block_person.jpeg', title: 'Finished Coco Peat Blocks' },
  { src: '/mariahcoirs/package_unit.jpg', title: 'Export Packaging' },
  { src: '/mariahcoirs/block_machine.jpeg', title: 'Block Production' },
  { src: '/mariahcoirs/dry_process.jpeg', title: 'Natural Drying' },
];

const YOUTUBE_VIDEOS = [
  { id: 'y6LWZYxbqUU', title: 'Mariah Coirs production video 1' },
  { id: 'NNAR6sWSnoM', title: 'Mariah Coirs production video 2' },
  { id: 'uJb435zTwek', title: 'Mariah Coirs production video 3' },
  { id: '249tINY_JEY', title: 'Mariah Coirs production video 4' },
];

function YouTubeVideo({ id, title }: { id: string; title: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const visibleRef = useRef(false);

  const command = (func: 'mute' | 'playVideo' | 'pauseVideo') => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      'https://www.youtube.com',
    );
  };

  const startMuted = () => {
    command('mute');
    command('playVideo');
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) startMuted();
      else command('pauseVideo');
    }, { threshold: 0.2 });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    if (!visibleRef.current) return;
    // The iframe API can become ready shortly after the document load event,
    // so retry the muted play command while the player initializes.
    startMuted();
    window.setTimeout(startMuted, 500);
    window.setTimeout(startMuted, 1200);
  };

  return (
    <div ref={wrapperRef} className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_16px_40px_rgba(42,30,18,0.16)]">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&rel=0`}
        title={title}
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleLoad}
      />
    </div>
  );
}

export default function GallerySection() {
  const [activeImage, setActiveImage] = useState<(typeof GALLERY_IMAGES)[number] | null>(null);

  useEffect(() => {
    if (!activeImage) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setActiveImage(null);
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [activeImage]);

  return (
    <section id="gallery" className="w-full bg-[#F7F4EF] py-20 lg:py-28 scroll-mt-20" aria-labelledby="gallery-title">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10 lg:mb-14">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#B9783E]">Inside Mariah Coirs</span>
            <h2 id="gallery-title" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#161616]">
              From Husk to Export
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[150px] sm:auto-rows-[210px] gap-3 sm:gap-4">
          {GALLERY_IMAGES.map((image, index) => (
            <motion.button
              key={image.src}
              type="button"
              onClick={() => setActiveImage(image)}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-2xl text-left cursor-zoom-in ${index === 0 || index === 5 ? 'row-span-2' : ''}`}
              aria-label={`View ${image.title}`}
            >
              <img src={image.src} alt={image.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <span className="absolute left-3 right-3 bottom-3 text-xs sm:text-sm font-semibold text-white">{image.title}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 lg:mt-20 mb-7">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B9783E]">Watch Our Process</span>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[#161616]">Production Videos</h3>
          <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-gray-600">
            See our coir production and facility in action. Videos autoplay silently and can be controlled at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {YOUTUBE_VIDEOS.map(video => (
            <YouTubeVideo key={video.id} {...video} />
          ))}
        </div>

      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 p-4 sm:p-10 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            role="dialog" aria-modal="true" aria-label={activeImage.title}
          >
            <button type="button" onClick={() => setActiveImage(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white text-2xl" aria-label="Close image">×</button>
            <motion.img
              src={activeImage.src} alt={activeImage.title}
              initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={event => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
