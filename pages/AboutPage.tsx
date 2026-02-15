
import React from 'react';
import { AboutConfig, SiteConfig, TextPosition } from '../types';

interface AboutProps {
  about: AboutConfig;
  siteConfig: SiteConfig;
}

const AboutPage: React.FC<AboutProps> = ({ about, siteConfig }) => {
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
      {/* Hero Header */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden bg-stone-100">
        <img 
          src={about.imageUrls[0]} 
          alt="About Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-[20%]"
        />
        <div className="relative z-10 px-6 w-full max-w-[1400px]" style={getPosStyle(about.titlePos)}>
          <span className="text-[10px] tracking-[0.6em] uppercase text-stone-500 font-bold mb-8 block transition-all">
            {about.subtitle}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold serif-display text-stone-900 tracking-tight uppercase leading-[1.2] max-w-4xl">
            {about.title}
          </h1>
          <div className="mt-10 h-[1px] w-16 bg-stone-900/30"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-32 lg:py-48 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <p className="text-2xl md:text-3xl font-light text-stone-900 leading-relaxed italic serif-body">
                "우리는 화려한 장식보다 머무는 이의 평온을 먼저 생각합니다."
              </p>
              <div className="space-y-8 text-stone-400 leading-loose text-lg font-light">
                <p>{about.description}</p>
                <p>
                  강릉의 자연과 도심이 교차하는 영감을 바탕으로, 우리는 정제된 형태와 본질적인 소재를 통해 
                  단순히 예쁜 공간이 아닌, 삶의 품격이 깊어지는 환경을 설계합니다.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src={about.imageUrls[1]} className="w-full aspect-[4/5] object-cover grayscale-[15%] shadow-2xl" alt="Studio" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-stone-50 -z-10 border border-stone-100"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Points */}
      <section className="py-32 bg-stone-50/50 border-y border-stone-100 mb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="space-y-6">
              <span className="text-4xl font-bold serif-display text-stone-200">01</span>
              <h3 className="text-xl font-bold uppercase tracking-widest serif-display text-stone-800">Essence</h3>
              <p className="text-stone-400 font-light leading-relaxed">
                공간이 가진 본연의 기능을 최우선으로 고려하며, 불필요한 장식을 덜어내고 
                본질에 집중한 디자인을 추구합니다.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-4xl font-bold serif-display text-stone-200">02</span>
              <h3 className="text-xl font-bold uppercase tracking-widest serif-display text-stone-800">Material</h3>
              <p className="text-stone-400 font-light leading-relaxed">
                소재가 가진 고유의 질감과 색채를 탐구하여, 조화로운 균형점을 찾고 
                시간이 흘러도 변치 않는 가치를 선사합니다.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-4xl font-bold serif-display text-stone-200">03</span>
              <h3 className="text-xl font-bold uppercase tracking-widest serif-display text-stone-800">Harmony</h3>
              <p className="text-stone-400 font-light leading-relaxed">
                주변 환경과 머무는 사람, 그리고 공간이 하나로 어우러지는 유기적인 
                관계성을 설계하여 정서적 만족을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
