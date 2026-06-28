import { useRef, useState, useEffect, Children, type ReactNode } from 'react';

interface MobileCarouselProps {
  children: ReactNode;
  /** Tailwind classes for each slide wrapper (width, etc.) */
  slideClassName?: string;
  /** Tailwind gap classes on the track */
  gapClassName?: string;
  /** Negative margin + padding to bleed to section edges */
  bleed?: boolean;
  showDots?: boolean;
  dotClassName?: string;
  activeDotClassName?: string;
  className?: string;
}

export default function MobileCarousel({
  children,
  slideClassName = 'w-[82vw] max-w-[300px]',
  gapClassName = 'gap-4',
  bleed = true,
  showDots = true,
  dotClassName = 'bg-[#E5A93C]/30',
  activeDotClassName = 'bg-[#E5A93C]',
  className = '',
}: MobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length <= 1) return;

    const updateIndex = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      if (!slides.length) return;
      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      slides.forEach((slide, i) => {
        const center = slide.offsetLeft + slide.offsetWidth / 2;
        const dist = Math.abs(scrollCenter - center);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    updateIndex();
    el.addEventListener('scroll', updateIndex, { passive: true });
    return () => el.removeEventListener('scroll', updateIndex);
  }, [items.length]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <div className={className}>
      <div
        ref={scrollRef}
        className={[
          'flex overflow-x-auto snap-x snap-mandatory no-scrollbar',
          bleed ? '-mx-6 px-6' : '',
          gapClassName,
        ].join(' ')}
        aria-roledescription="carousel"
      >
        {items.map((child, i) => (
          <div
            key={i}
            className={`snap-start shrink-0 ${slideClassName}`}
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${items.length}`}
          >
            {child}
          </div>
        ))}
      </div>

      {showDots && items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4" role="tablist" aria-label="Carousel pagination">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={[
                'h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer',
                i === activeIndex ? `w-6 ${activeDotClassName}` : `w-1.5 ${dotClassName}`,
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
