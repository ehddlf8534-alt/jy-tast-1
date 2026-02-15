
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Portfolio from './pages/Portfolio';
import AboutPage from './pages/AboutPage';
import LocationPage from './pages/LocationPage';
import { INITIAL_PORTFOLIO, INITIAL_HEROES, INITIAL_ABOUT, INITIAL_PROCESS, INITIAL_SITE_CONFIG } from './constants';
import { PortfolioItem, HeroConfig, AboutConfig, ProcessStep, SiteConfig } from './types';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [heroes, setHeroes] = useState<HeroConfig[]>([]);
  const [about, setAbout] = useState<AboutConfig>(INITIAL_ABOUT);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio_data');
    setPortfolio(savedPortfolio ? JSON.parse(savedPortfolio) : INITIAL_PORTFOLIO);

    const savedHeroes = localStorage.getItem('hero_config');
    setHeroes(savedHeroes ? JSON.parse(savedHeroes) : INITIAL_HEROES);

    const savedAbout = localStorage.getItem('about_config');
    setAbout(savedAbout ? JSON.parse(savedAbout) : INITIAL_ABOUT);

    const savedProcess = localStorage.getItem('process_config');
    setProcessSteps(savedProcess ? JSON.parse(savedProcess) : INITIAL_PROCESS);

    const savedSite = localStorage.getItem('site_config');
    if (savedSite) {
      setSiteConfig(JSON.parse(savedSite));
    } else {
      setSiteConfig(INITIAL_SITE_CONFIG);
    }
    
    if (!isHomePage) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isHomePage]);

  useEffect(() => {
    const styleId = 'dynamic-site-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root {
        --theme-color: ${siteConfig.themeColor || '#1c1917'};
      }
      .serif-display {
        font-family: ${siteConfig.fontSerif}, serif !important;
      }
      body, .sans-font {
        font-family: ${siteConfig.fontSans}, sans-serif !important;
      }
      .bg-theme { background-color: var(--theme-color) !important; }
      .text-theme { color: var(--theme-color) !important; }
      .border-theme { border-color: var(--theme-color) !important; }
      ${isHomePage ? 'body { overflow: hidden !important; }' : ''}
    `;
  }, [siteConfig.themeColor, siteConfig.fontSerif, siteConfig.fontSans, isHomePage]);

  const sortedNavItems = useMemo(() => {
    return [...(siteConfig.navItems || [])]
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order);
  }, [siteConfig.navItems]);

  const updatePortfolio = (data: PortfolioItem[]) => {
    setPortfolio(data);
    localStorage.setItem('portfolio_data', JSON.stringify(data));
  };

  const updateHeroes = (data: HeroConfig[]) => {
    setHeroes(data);
    localStorage.setItem('hero_config', JSON.stringify(data));
  };

  const updateAbout = (data: AboutConfig) => {
    setAbout(data);
    localStorage.setItem('about_config', JSON.stringify(data));
  };

  const updateProcess = (data: ProcessStep[]) => {
    setProcessSteps(data);
    localStorage.setItem('process_config', JSON.stringify(data));
  };

  const updateSiteConfig = (data: SiteConfig) => {
    setSiteConfig(data);
    localStorage.setItem('site_config', JSON.stringify(data));
  };

  return (
    <div className={`min-h-screen flex flex-col relative bg-white ${isHomePage ? 'h-screen overflow-hidden' : ''}`}>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 transition-transform duration-500 ${isHomePage ? 'translate-y-0' : ''}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link to="/" className="h-full flex items-center">
            {siteConfig.logoUrl ? (
              <img 
                src={siteConfig.logoUrl} 
                alt={siteConfig.companyName} 
                style={{ height: `${siteConfig.logoSize || 40}px` }} 
                className="w-auto object-contain" 
              />
            ) : (
              <span className="text-2xl font-bold tracking-[0.2em] text-stone-900 serif-display">{siteConfig.companyName}</span>
            )}
          </Link>
          
          <div className="hidden lg:flex items-center space-x-10 text-[11px] tracking-[0.2em] font-bold text-stone-400 uppercase">
            {sortedNavItems.map(item => (
              <Link key={item.id} to={item.path} className={`hover:text-stone-900 transition-colors line-draw ${pathname === item.path ? 'text-stone-900' : ''}`}>{item.label}</Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <a href={`tel:${siteConfig.phone}`} className="text-[13px] font-bold tracking-wider text-stone-900 hover:text-stone-600 transition-colors">T. {siteConfig.phone}</a>
            <a href={siteConfig.contactUrl} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 py-2.5 text-[11px] tracking-widest hover:opacity-80 transition-all uppercase font-bold">{siteConfig.uiText.ctaButton}</a>
          </div>
        </div>
      </nav>

      <main className={`flex-grow ${isHomePage ? 'h-screen' : ''}`}>
        <Routes>
          <Route path="/" element={<Home portfolio={portfolio} heroes={heroes} about={about} processSteps={processSteps} siteConfig={siteConfig} />} />
          <Route path="/portfolio" element={<Portfolio portfolio={portfolio} siteConfig={siteConfig} />} />
          <Route path="/about" element={<AboutPage about={about} siteConfig={siteConfig} />} />
          <Route path="/location" element={<LocationPage siteConfig={siteConfig} />} />
          <Route path="/admin" element={<Admin 
            portfolio={portfolio} onUpdate={updatePortfolio} 
            heroes={heroes} onUpdateHeroes={updateHeroes} 
            about={about} onUpdateAbout={updateAbout}
            processSteps={processSteps} onUpdateProcess={updateProcess}
            siteConfig={siteConfig} onUpdateSiteConfig={updateSiteConfig}
          />} />
        </Routes>
      </main>

      {!isHomePage && (
        <footer className="bg-stone-50 border-t border-stone-200 pt-24 pb-32 md:pb-24 px-6 lg:px-12">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
              <div className="md:col-span-4">
                <h2 className="text-2xl font-bold tracking-[0.25em] mb-10 serif-display">{siteConfig.companyName}</h2>
                <p className="text-[13px] leading-relaxed text-stone-500 max-w-sm font-light mb-8 whitespace-pre-wrap">{siteConfig.footerAbout}</p>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-[11px] tracking-[0.2em] font-bold text-stone-900 mb-8 uppercase">Contact Info</h3>
                <div className="space-y-4 text-[13px] text-stone-500 font-light">
                  <p>T. <span className="text-stone-900 font-normal">{siteConfig.phone}</span></p>
                  <p>E. <span className="text-stone-900 font-normal">{siteConfig.email}</span></p>
                  <p>A. <span className="text-stone-900 font-normal">{siteConfig.address}</span></p>
                </div>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-[11px] tracking-[0.2em] font-bold text-stone-900 mb-8 uppercase">Quick Links</h3>
                <ul className="grid grid-cols-2 gap-4 text-[13px] text-stone-500 font-light uppercase tracking-wider">
                  {sortedNavItems.map(item => (
                    <li key={item.id}>
                      <Link to={item.path} className="hover:text-stone-900 transition-colors">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-24 pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.1em] text-stone-400 uppercase">
              <p>© {new Date().getFullYear()} {siteConfig.companyName} Studio. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
