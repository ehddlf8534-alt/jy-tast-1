
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HeroConfig, AboutConfig, ProcessStep, SiteConfig, TextPosition } from '../types';

interface HomeProps {
  portfolio: any[]; 
  heroes: HeroConfig[];
  about: AboutConfig;
  processSteps: ProcessStep[];
  siteConfig: SiteConfig;
}

const Home: React.FC<HomeProps> = ({ heroes, about, processSteps, siteConfig }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStart = useRef<number | null>(null);

  // Combine all sections into a single array for mapping
  const sections = [
    ...heroes.map((h, i) => ({ type: 'hero', data: h, index: i })),
    { type: 'about', data: about },
    { type: 'process', data: processSteps },
    { type: 'cta', data: siteConfig }
  ];

  const totalSections = sections.length;

  const handleScroll = useCallback((direction: 'next' | 'prev') => {
    if (isScrolling) return;

    if (direction === 'next' && currentIndex < totalSections - 1) {
      setIsScrolling(true);
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setIsScrolling(true);
      setCurrentIndex(prev => prev - 1);
    }

    setTimeout(() => setIsScrolling(false), 1000); // Cooldown to match transition
  }, [currentIndex, isScrolling, totalSections]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 30) return; // Ignore small movements
      handleScroll(e.deltaY > 0 ? 'next' : 'prev');
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') handleScroll('next');
      if (e.key === 'ArrowUp') handleScroll('prev');
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleScroll]);

  // Touch handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) {
      handleScroll(diff > 0 ? 'next' : 'prev');
    }
    touchStart.current = null;
  };

  const getPosStyle = (pos: TextPosition) => ({
    textAlign: pos.align,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: pos.align === 'center' ? 'center' : pos.align === 'right' ? 'flex-end' : 'flex-start',
  });

  const sortedNavItems = [...(siteConfig.navItems || [])]
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-white touch-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Dynamic Slide Container */}
      <div 
        className="w-full h-full transition-transform duration-[1000ms] ease-[cubic-bezier(0.86,0,0.07,1)]"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {sections.map((section, idx) => {
          const isActive = currentIndex === idx;
          
          return (
            <section key={idx} className="relative w-full h-full flex-shrink-0 flex items-center overflow-hidden">
              {section.type === 'hero' && (
                <>
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={(section.data as HeroConfig).imageUrl} 
                      className={`w-full h-full object-cover transition-transform duration-[3000ms] ${isActive ? 'scale-110' : 'scale-100'}`} 
                      alt="Hero" 
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <div className={`relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 ${(section as any).index % 2 === 1 ? 'text-right flex flex-col items-end' : ''}`}>
                    <div className={`max-w-4xl transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                      <span className="inline-block text-[11px] tracking-[0.5em] mb-8 uppercase font-bold text-white/70">{(section.data as HeroConfig).subtitle}</span>
                      <h1 className="text-5xl md:text-9xl font-bold mb-10 serif-display leading-[0.9] tracking-tight uppercase text-white">
                        {(section.data as HeroConfig).title}
                      </h1>
                      <Link to="/portfolio" className="inline-flex items-center justify-center px-12 py-5 text-[11px] font-bold tracking-[0.2em] uppercase bg-white text-black hover:bg-stone-100 transition-all shadow-2xl">GO PORTFOLIO</Link>
                    </div>
                  </div>
                </>
              )}

              {section.type === 'about' && (
                <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  <div className={`lg:col-span-6 transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={getPosStyle((section.data as AboutConfig).titlePos)}>
                    <span className="text-[11px] tracking-[0.4em] uppercase text-stone-300 font-bold mb-6 block">{(section.data as AboutConfig).subtitle}</span>
                    <h2 className="text-4xl md:text-7xl font-bold mb-12 serif-display leading-tight text-stone-900">{(section.data as AboutConfig).title}</h2>
                    <p className="text-stone-400 leading-relaxed text-[17px] font-light max-w-lg mb-12">{(section.data as AboutConfig).description}</p>
                    <Link to={(section.data as AboutConfig).ctaUrl} className="inline-block border border-stone-200 text-stone-900 px-12 py-5 text-[11px] tracking-[0.2em] font-bold uppercase hover:bg-black hover:text-white transition-all">LEARN MORE</Link>
                  </div>
                  <div className="lg:col-span-6 flex gap-8">
                    <img 
                      src={(section.data as AboutConfig).imageUrls[0]} 
                      className={`w-1/2 aspect-[4/6] object-cover transition-all duration-[1500ms] delay-500 shadow-2xl ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} 
                      alt="About 1" 
                    />
                    <img 
                      src={(section.data as AboutConfig).imageUrls[1]} 
                      className={`w-1/2 aspect-[4/6] object-cover mt-20 transition-all duration-[1500ms] delay-700 shadow-2xl ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} 
                      alt="About 2" 
                    />
                  </div>
                </div>
              )}

              {section.type === 'process' && (
                <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
                   <div className={`mb-24 transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={getPosStyle(siteConfig.uiText.processPos)}>
                    <span className="text-[11px] tracking-[0.3em] uppercase text-stone-300 font-bold mb-4 block">{siteConfig.uiText.processSubtitle}</span>
                    <h2 className="text-4xl md:text-6xl font-bold serif-display text-stone-900">{siteConfig.uiText.processTitle}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 border border-stone-100 divide-x divide-stone-100 bg-white">
                    {(section.data as ProcessStep[]).map((p, pIdx) => (
                      <div 
                        key={pIdx} 
                        className={`p-12 hover:bg-stone-50 transition-all duration-700 delay-[${400 + pIdx * 100}ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                      >
                        <span className="text-[11px] tracking-widest text-stone-200 block mb-12 font-bold">{p.step}</span>
                        <h4 className="text-lg font-bold mb-6 serif-display uppercase tracking-widest text-stone-800">{p.title}</h4>
                        <p className="text-[13px] text-stone-400 leading-relaxed font-light">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.type === 'cta' && (
                <div className="w-full h-full flex flex-col bg-stone-50">
                  <div className="flex-grow flex items-center justify-center">
                    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
                      <div className={`transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={getPosStyle(siteConfig.uiText.ctaPos)}>
                        <span className="text-[11px] tracking-[0.4em] mb-8 uppercase text-stone-300 font-bold">{siteConfig.uiText.ctaSubtitle}</span>
                        <h2 className="text-4xl md:text-8xl font-bold mb-16 serif-display leading-[1.1] tracking-tight whitespace-pre-wrap">{siteConfig.uiText.ctaTitle}</h2>
                        <div className="flex flex-col md:flex-row items-center gap-12">
                          <a href={`tel:${siteConfig.phone}`} className="text-4xl md:text-7xl font-bold serif-display hover:text-stone-400 transition-colors tracking-tighter">{siteConfig.phone}</a>
                          <a href={siteConfig.contactUrl} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-20 py-8 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-stone-800 transition-all shadow-2xl">{siteConfig.uiText.ctaButton}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <footer className="bg-white border-t border-stone-200 py-16 px-12">
                    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                      <div>
                        <h2 className="text-lg font-bold tracking-[0.2em] mb-4 serif-display">{siteConfig.companyName}</h2>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">© {new Date().getFullYear()} All rights reserved.</p>
                      </div>
                      <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {sortedNavItems.map(item => (
                          <Link key={item.id} to={item.path} className="hover:text-black transition-colors">{item.label}</Link>
                        ))}
                      </div>
                    </div>
                  </footer>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-6">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="group relative flex items-center justify-end"
          >
            <span className={`mr-4 text-[9px] font-bold uppercase tracking-widest transition-all duration-500 opacity-0 group-hover:opacity-100 ${currentIndex === i ? 'text-stone-900' : 'text-stone-300'}`}>
              {i === 0 ? 'Home' : i === sections.length - 1 ? 'Contact' : `0${i}`}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? 'bg-black scale-150' : 'bg-stone-200 hover:bg-stone-400'}`}></div>
          </button>
        ))}
      </div>

      {/* Scroll Down Hint for first section */}
      {currentIndex === 0 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-stone-400 animate-bounce">
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Discover</span>
          <div className="w-[1px] h-12 bg-stone-200"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
