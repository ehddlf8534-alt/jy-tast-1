
import React, { useState, useMemo } from 'react';
import { PortfolioItem, Category, SiteConfig } from '../types';

// Added missing interface PortfolioProps
interface PortfolioProps {
  portfolio: PortfolioItem[];
  siteConfig: SiteConfig;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, siteConfig }) => {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const filteredItems = useMemo(() => {
    return filter === 'ALL' 
      ? portfolio 
      : portfolio.filter(item => item.category === filter);
  }, [portfolio, filter]);

  const openAlbum = (project: PortfolioItem) => {
    setSelectedProject(project);
    setCurrentImgIdx(0);
    document.body.style.overflow = 'hidden';
  };

  const closeAlbum = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-white pt-20 animate-in fade-in duration-700">
      <section className="py-32 bg-stone-50 border-b border-stone-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[11px] tracking-[0.3em] uppercase text-stone-300 font-bold mb-4 block">Archive</span>
              <h1 className="text-5xl md:text-8xl font-bold serif-display tracking-tighter uppercase leading-none text-stone-900">Our<br/>Portfolio</h1>
              <p className="mt-8 text-stone-400 font-light leading-relaxed">
                각기 다른 삶의 방식과 취향을 담아낸 JYDESIGN의 프로젝트 아카이브입니다. 본질에 집중한 미학적 가치를 경험해보세요.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8 text-[11px] tracking-[0.2em] uppercase font-bold text-stone-300">
              {['ALL', '주거 인테리어', '상업 인테리어', '부분 리모델링'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`line-draw pb-1 transition-colors ${
                    filter === cat ? 'text-stone-900' : 'hover:text-stone-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredItems.map((item) => (
              <div key={item.id} className="group cursor-pointer" onClick={() => openAlbum(item)}>
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-8">
                  <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-[10px] tracking-widest text-stone-300 uppercase font-bold">
                    <span>{item.category}</span>
                    <span className="w-4 h-[1px] bg-stone-100"></span>
                    <span>{item.size}</span>
                  </div>
                  <h3 className="text-2xl font-bold serif-display tracking-tight text-stone-900 group-hover:text-stone-500 transition-colors">{item.title}</h3>
                  <p className="text-[13px] text-stone-400 font-light line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-60 text-center">
              <p className="text-stone-300 italic serif-body text-xl">선택하신 카테고리에 프로젝트가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Album Modal - Brighter Backdrop */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <button onClick={closeAlbum} className="absolute top-8 right-8 text-stone-900 z-[110] hover:opacity-50 transition-opacity">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="relative w-full max-w-6xl px-12 h-[75vh] flex items-center justify-center">
            <img src={selectedProject.imageUrls[currentImgIdx]} className="max-h-full max-w-full object-contain shadow-2xl animate-in zoom-in duration-500" alt="Detail" />
            {selectedProject.imageUrls.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev === 0 ? selectedProject.imageUrls.length - 1 : prev - 1)); }} className="absolute left-4 text-stone-400 hover:text-stone-900 transition-colors">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev === selectedProject.imageUrls.length - 1 ? 0 : prev + 1)); }} className="absolute right-4 text-stone-400 hover:text-stone-900 transition-colors">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
          <div className="mt-8 text-center text-stone-900 px-6">
            <h3 className="text-2xl font-bold serif-display mb-2">{selectedProject.title}</h3>
            <p className="text-stone-300 text-sm tracking-widest uppercase">{selectedProject.category} / {currentImgIdx + 1} OF {selectedProject.imageUrls.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
