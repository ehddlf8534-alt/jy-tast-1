
import React from 'react';
import { SiteConfig, TextPosition } from '../types';

interface LocationPageProps {
  siteConfig: SiteConfig;
}

const LocationPage: React.FC<LocationPageProps> = ({ siteConfig }) => {
  const isExternalCta = siteConfig.uiText.locationCtaUrl.startsWith('http');
  
  const getPosStyle = (pos: TextPosition) => ({
    textAlign: pos.align,
    marginTop: `${pos.marginTop}px`,
    marginBottom: `${pos.marginBottom}px`,
    marginLeft: `${pos.marginLeft}px`,
    marginRight: `${pos.marginRight}px`,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: pos.align === 'center' ? 'center' : pos.align === 'right' ? 'flex-end' : 'flex-start',
  });

  return (
    <div className="bg-white pt-20 animate-in fade-in duration-700">
      {/* Page Title Section */}
      <section className="py-24 md:py-32 border-b border-stone-100 bg-stone-50 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div style={getPosStyle(siteConfig.uiText.locationPos)}>
            <span className="text-[11px] tracking-[0.5em] uppercase text-stone-400 font-bold mb-4 block">
              {siteConfig.uiText.locationSubtitle}
            </span>
            <h1 className="text-5xl md:text-8xl font-bold serif-display tracking-tighter uppercase leading-none">
              {siteConfig.uiText.locationTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[50vh] md:h-[70vh] relative grayscale contrast-110 hover:grayscale-0 transition-all duration-1000 border-b border-stone-100">
        <iframe 
          src={siteConfig.mapEmbedUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>
      </section>

      {/* Info Section */}
      <section className="py-32 lg:py-48 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 items-start">
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 border-b border-stone-100 pb-4 mb-8">Address</h3>
              <p className="text-lg text-stone-900 font-light leading-relaxed">
                {siteConfig.address}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 border-b border-stone-100 pb-4 mb-8">Contact</h3>
              <p className="text-lg text-stone-900 font-light leading-relaxed">
                T. {siteConfig.phone}<br />
                E. {siteConfig.email}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 border-b border-stone-100 pb-4 mb-8">Hours</h3>
              <p className="text-lg text-stone-900 font-light leading-relaxed whitespace-pre-line">
                {siteConfig.businessHours}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-400 border-b border-stone-100 pb-4 mb-8">Directions</h3>
              <div className="flex flex-col space-y-3">
                {siteConfig.naverMapUrl && (
                  <a 
                    href={siteConfig.naverMapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-stone-200 px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all"
                  >
                    Naver Map
                  </a>
                )}
                {siteConfig.kakaoMapUrl && (
                  <a 
                    href={siteConfig.kakaoMapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-stone-200 px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all"
                  >
                    Kakao Map
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-stone-50 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold serif-display mb-8 uppercase tracking-tight text-stone-900">
            {siteConfig.uiText.locationCtaTitle}
          </h2>
          <p className="text-stone-500 font-light mb-12 whitespace-pre-line">
            {siteConfig.uiText.locationCtaDescription}
          </p>
          <a 
            href={siteConfig.uiText.locationCtaUrl} 
            target={isExternalCta ? "_blank" : undefined}
            rel={isExternalCta ? "noopener noreferrer" : undefined}
            className="inline-block bg-black text-white px-16 py-6 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-stone-800 transition-all shadow-xl"
          >
            {siteConfig.uiText.locationCtaButton}
          </a>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;
