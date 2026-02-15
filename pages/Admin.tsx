
import React, { useState, useEffect } from 'react';
import { PortfolioItem, Category, HeroConfig, AboutConfig, ProcessStep, SiteConfig, Alignment, NavItem, TextPosition } from '../types';
import { ADMIN_PASSWORD } from '../constants';

interface AdminProps {
  portfolio: PortfolioItem[];
  onUpdate: (newPortfolio: PortfolioItem[]) => void;
  heroes: HeroConfig[];
  onUpdateHeroes: (newHeroes: HeroConfig[]) => void;
  about: AboutConfig;
  onUpdateAbout: (newAbout: AboutConfig) => void;
  processSteps: ProcessStep[];
  onUpdateProcess: (newProcess: ProcessStep[]) => void;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (newSite: SiteConfig) => void;
}

type AdminTab = 'portfolio' | 'heroes' | 'about' | 'process' | 'site' | 'location' | 'navigation' | 'style' | 'layout';

const Admin: React.FC<AdminProps> = ({ 
  portfolio, onUpdate, 
  heroes, onUpdateHeroes, 
  about, onUpdateAbout,
  processSteps, onUpdateProcess,
  siteConfig, onUpdateSiteConfig
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<AdminTab>('portfolio');
  
  // Local states for editing
  const [localAbout, setLocalAbout] = useState<AboutConfig>(about);
  const [localProcessSteps, setLocalProcessSteps] = useState<ProcessStep[]>(processSteps);
  const [localSiteConfig, setLocalSiteConfig] = useState<SiteConfig>(siteConfig);
  
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
  const [editingHero, setEditingHero] = useState<Partial<HeroConfig> | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Sync local state when props change (e.g. on initial load)
  useEffect(() => {
    setLocalAbout(about);
    setLocalProcessSteps(processSteps);
    setLocalSiteConfig(siteConfig);
  }, [about, processSteps, siteConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert('비밀번호가 틀렸습니다.');
  };

  const handleImageUpload = (files: FileList | null, callback: (url: string) => void) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => callback(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleApplyChanges = () => {
    if (tab === 'about') onUpdateAbout(localAbout);
    if (tab === 'process') onUpdateProcess(localProcessSteps);
    if (['site', 'location', 'navigation', 'style', 'layout'].includes(tab)) onUpdateSiteConfig(localSiteConfig);
    
    alert('수정 사항이 성공적으로 반영되었습니다.');
  };

  // --- Handlers ---
  const handleSavePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const finalItem = {
      ...editingItem,
      id: editingItem.id || Date.now().toString(),
      keywords: typeof editingItem.keywords === 'string' ? (editingItem.keywords as string).split(',').map(s => s.trim()) : (editingItem.keywords || []),
      imageUrls: editingItem.imageUrls || []
    } as PortfolioItem;
    if (editingItem.id) onUpdate(portfolio.map(item => item.id === editingItem.id ? finalItem : item));
    else onUpdate([...portfolio, finalItem]);
    setEditingItem(null);
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHero) return;
    const finalHero = { ...editingHero, id: editingHero.id || Date.now() } as HeroConfig;
    if (editingHero.id) onUpdateHeroes(heroes.map(h => h.id === editingHero.id ? finalHero : h));
    else onUpdateHeroes([...heroes, finalHero]);
    setEditingHero(null);
  };

  const updateProcessStep = (id: string, updates: Partial<ProcessStep>) => {
    setLocalProcessSteps(localProcessSteps.map(ps => ps.id === id ? { ...ps, ...updates } : ps));
  };

  const updateNavItem = (id: string, updates: Partial<NavItem>) => {
    setLocalSiteConfig({ ...localSiteConfig, navItems: localSiteConfig.navItems.map(item => item.id === id ? { ...item, ...updates } : item) });
  };
  
  const addNavItem = () => {
    const newId = Date.now().toString();
    setLocalSiteConfig({ ...localSiteConfig, navItems: [...localSiteConfig.navItems, { id: newId, label: 'New Menu', path: '/', visible: true, order: localSiteConfig.navItems.length + 1 }] });
  };
  
  const removeNavItem = (id: string) => {
    if (confirm('삭제하시겠습니까?')) setLocalSiteConfig({ ...localSiteConfig, navItems: localSiteConfig.navItems.filter(i => i.id !== id) });
  };

  const updateGenericPosition = (key: string, field: keyof TextPosition, value: any) => {
    if (key.startsWith('about.')) {
      setLocalAbout({ ...localAbout, titlePos: { ...localAbout.titlePos, [field]: value } });
    } else {
      setLocalSiteConfig({
        ...localSiteConfig,
        uiText: {
          ...localSiteConfig.uiText,
          [key as keyof SiteConfig['uiText']]: { 
            ...(localSiteConfig.uiText[key as keyof SiteConfig['uiText']] as unknown as TextPosition), 
            [field]: value 
          }
        }
      });
    }
  };

  // DropZone Logic
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent, callback: (url: string) => void) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files, callback);
  };

  const ImageUploadZone = ({ label, callback, currentUrl }: { label: string, callback: (url: string) => void, currentUrl?: string }) => (
    <div 
      onDragOver={onDragOver} 
      onDragLeave={onDragLeave} 
      onDrop={(e) => onDrop(e, callback)}
      className={`border-2 border-dashed p-10 text-center transition-all ${isDragging ? 'border-black bg-stone-100 scale-[0.98]' : 'border-stone-200 bg-stone-50'}`}
    >
      {currentUrl ? (
        <img src={currentUrl} className="max-h-40 mx-auto mb-4 object-contain shadow-md" alt="Preview" />
      ) : (
        <div className="mb-4 text-stone-300">
           <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      )}
      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <p className="text-[10px] text-stone-300 mb-4 italic">이미지 파일을 이곳에 드래그하여 놓거나 클릭하여 선택하세요.</p>
      <label className="inline-block bg-white border border-stone-200 px-6 py-2 text-[10px] font-bold uppercase cursor-pointer hover:bg-black hover:text-white transition-all">
        파일 선택
        <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e.target.files, callback)} />
      </label>
    </div>
  );

  const PositionControl = ({ label, targetKey }: { label: string, targetKey: string }) => {
    const pos = targetKey.startsWith('about.') 
      ? localAbout.titlePos 
      : (localSiteConfig.uiText[targetKey as keyof SiteConfig['uiText']] as unknown as TextPosition);
    return (
      <div className="p-8 border bg-stone-50 space-y-6 mb-8 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2">{label} Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase">Alignment</label>
            <div className="flex bg-white border p-1 rounded w-fit">
              {(['left', 'center', 'right'] as Alignment[]).map(a => (
                <button key={a} type="button" onClick={() => updateGenericPosition(targetKey, 'align', a)} className={`px-4 py-2 text-[9px] uppercase font-bold transition-all ${pos.align === a ? 'bg-black text-white' : 'text-stone-400'}`}>{a}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['marginTop', 'marginBottom', 'marginLeft', 'marginRight'].map(f => (
              <div key={f}>
                <label className="text-[10px] font-bold text-stone-400 uppercase block mb-1">{f.replace('margin', '')} Offset</label>
                <input type="number" className="w-full border p-2 text-xs" value={(pos as any)[f]} onChange={e => updateGenericPosition(targetKey, f as any, Number(e.target.value))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center serif-display uppercase tracking-widest">Admin Control</h2>
          <input type="password" placeholder="Password" className="w-full border p-4 mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest text-xs">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen flex flex-col">
      <div className="flex flex-wrap gap-4 md:gap-8 justify-center mb-16 border-b pb-6 overflow-x-auto whitespace-nowrap">
        {(['portfolio', 'heroes', 'about', 'process', 'site', 'location', 'navigation', 'style', 'layout'] as AdminTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`text-[10px] font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${tab === t ? 'border-black text-black' : 'border-transparent text-stone-300'}`}>{t}</button>
        ))}
      </div>

      <div className="flex-grow pb-32">
        {tab === 'portfolio' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold serif-display uppercase">Portfolio Gallery</h2>
              <button onClick={() => setEditingItem({ category: '주거 인테리어', title: '', imageUrls: [] })} className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest">+ Add Project</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {portfolio.map(item => (
                <div key={item.id} className="border p-4 bg-white shadow-sm">
                  <img src={item.imageUrls[0]} className="aspect-square object-cover mb-4" />
                  <h3 className="font-bold text-xs mb-4 uppercase">{item.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(item)} className="flex-1 border py-2 text-[9px] font-bold uppercase">Edit</button>
                    <button onClick={() => onUpdate(portfolio.filter(p => p.id !== item.id))} className="flex-1 bg-stone-50 py-2 text-[9px] font-bold text-stone-300">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'heroes' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold serif-display uppercase">Hero Slides</h2>
              <button onClick={() => setEditingHero({ title: '', imageUrl: '' })} className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest">+ Add Hero</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {heroes.map(hero => (
                <div key={hero.id} className="border p-6 bg-white flex gap-6">
                  <img src={hero.imageUrl} className="w-32 h-32 object-cover" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold serif-display mb-2">{hero.title}</h3>
                    <div className="flex gap-4">
                      <button onClick={() => setEditingHero(hero)} className="text-[10px] font-bold uppercase border-b border-black">Edit</button>
                      <button onClick={() => onUpdateHeroes(heroes.filter(h => h.id !== hero.id))} className="text-[10px] font-bold uppercase border-b border-red-500 text-red-500">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'about' && (
          <div className="bg-white border p-12 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold serif-display uppercase border-b pb-4">About Studio Config</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Home Button Label</label>
                  <input className="w-full border-b py-2 text-sm" value={localAbout.ctaLabel} onChange={e => setLocalAbout({...localAbout, ctaLabel: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Home Button URL</label>
                  <input className="w-full border-b py-2 text-sm font-mono" value={localAbout.ctaUrl} onChange={e => setLocalAbout({...localAbout, ctaUrl: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">About Philosophy Title</label>
                <input className="w-full border-b py-2 text-xl font-bold" value={localAbout.title} onChange={e => setLocalAbout({...localAbout, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">About Description</label>
                <textarea className="w-full border p-4 text-sm h-32" value={localAbout.description} onChange={e => setLocalAbout({...localAbout, description: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {tab === 'process' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold serif-display uppercase border-b pb-4 mb-10">Process Steps</h2>
            {localProcessSteps.map((step) => (
              <div key={step.id} className="p-8 border bg-stone-50 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-2">
                  <input className="w-full border-b bg-transparent font-bold py-1" value={step.step} onChange={e => updateProcessStep(step.id, { step: e.target.value })} />
                </div>
                <div className="md:col-span-4">
                  <input className="w-full border-b bg-transparent font-bold py-1" value={step.title} onChange={e => updateProcessStep(step.id, { title: e.target.value })} />
                </div>
                <div className="md:col-span-6">
                  <input className="w-full border-b bg-transparent text-sm py-1" value={step.description} onChange={e => updateProcessStep(step.id, { description: e.target.value })} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'site' && (
          <div className="bg-white border p-12 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold serif-display uppercase border-b pb-4">General Site Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Phone</label>
                <input className="w-full border-b py-2 text-lg font-bold" value={localSiteConfig.phone} onChange={e => setLocalSiteConfig({...localSiteConfig, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Email</label>
                <input className="w-full border-b py-2 text-lg" value={localSiteConfig.email} onChange={e => setLocalSiteConfig({...localSiteConfig, email: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Address</label>
                <input className="w-full border-b py-2 text-lg" value={localSiteConfig.address} onChange={e => setLocalSiteConfig({...localSiteConfig, address: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Footer Description</label>
                <textarea className="w-full border p-4 text-sm h-24" value={localSiteConfig.footerAbout} onChange={e => setLocalSiteConfig({...localSiteConfig, footerAbout: e.target.value})} />
              </div>
            </div>

            {/* Added: Global CTA (Home Footer) Content Editor */}
            <div className="pt-12 border-t space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-black"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900">Global CTA (Home Page Footer)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">CTA Main Title (가치 있는 일상을...)</label>
                  <textarea 
                    className="w-full border p-4 text-xl font-bold serif-display leading-tight h-32 focus:border-black outline-none" 
                    placeholder="가치 있는 일상을\n지금 시작하세요."
                    value={localSiteConfig.uiText.ctaTitle} 
                    onChange={e => setLocalSiteConfig({...localSiteConfig, uiText: {...localSiteConfig.uiText, ctaTitle: e.target.value}})} 
                  />
                  <p className="text-[10px] text-stone-300 mt-2 italic">Enter 키를 입력하여 줄바꿈을 할 수 있습니다.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">CTA Subtitle</label>
                  <input 
                    className="w-full border-b py-2 text-sm focus:border-black outline-none" 
                    value={localSiteConfig.uiText.ctaSubtitle} 
                    onChange={e => setLocalSiteConfig({...localSiteConfig, uiText: {...localSiteConfig.uiText, ctaSubtitle: e.target.value}})} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">CTA Button Text</label>
                  <input 
                    className="w-full border-b py-2 text-sm focus:border-black outline-none" 
                    value={localSiteConfig.uiText.ctaButton} 
                    onChange={e => setLocalSiteConfig({...localSiteConfig, uiText: {...localSiteConfig.uiText, ctaButton: e.target.value}})} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'location' && (
          <div className="bg-white border p-12 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold serif-display uppercase border-b pb-4">Location Config</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Google Map Embed URL (src)</label>
                <textarea className="w-full border p-4 text-xs h-24 font-mono" value={localSiteConfig.mapEmbedUrl} onChange={e => setLocalSiteConfig({...localSiteConfig, mapEmbedUrl: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Naver Map Link</label>
                  <input className="w-full border-b py-2 text-xs" value={localSiteConfig.naverMapUrl} onChange={e => setLocalSiteConfig({...localSiteConfig, naverMapUrl: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Kakao Map Link</label>
                  <input className="w-full border-b py-2 text-xs" value={localSiteConfig.kakaoMapUrl} onChange={e => setLocalSiteConfig({...localSiteConfig, kakaoMapUrl: e.target.value})} />
                </div>
              </div>
              <div className="pt-8 border-t space-y-4">
                <label className="block text-[10px] font-bold text-stone-400 uppercase">Page Footer CTA Config</label>
                <div className="grid grid-cols-2 gap-8">
                  <div><input className="w-full border-b py-2 text-sm" placeholder="Title" value={localSiteConfig.uiText.locationCtaTitle} onChange={e => setLocalSiteConfig({...localSiteConfig, uiText: {...localSiteConfig.uiText, locationCtaTitle: e.target.value}})} /></div>
                  <div><input className="w-full border-b py-2 text-sm" placeholder="Button Link" value={localSiteConfig.uiText.locationCtaUrl} onChange={e => setLocalSiteConfig({...localSiteConfig, uiText: {...localSiteConfig.uiText, locationCtaUrl: e.target.value}})} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'navigation' && (
          <div className="bg-white border p-12 max-w-4xl mx-auto space-y-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold serif-display uppercase">Navigation Items</h2>
              <button onClick={addNavItem} className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase">+ Add Item</button>
            </div>
            <div className="space-y-4">
              {localSiteConfig.navItems.sort((a,b) => a.order - b.order).map(item => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 p-6 border bg-stone-50 group hover:border-black transition-all">
                  <div className="flex flex-col items-center">
                    <button onClick={() => updateNavItem(item.id, { order: item.order - 1 })} className="text-[10px]">▲</button>
                    <span className="text-[10px] font-bold">{item.order}</span>
                    <button onClick={() => updateNavItem(item.id, { order: item.order + 1 })} className="text-[10px]">▼</button>
                  </div>
                  <div className="flex-grow grid grid-cols-2 gap-4 w-full">
                    <input className="w-full border-b bg-transparent font-bold" value={item.label} onChange={e => updateNavItem(item.id, { label: e.target.value })} />
                    <input className="w-full border-b bg-transparent text-xs" value={item.path} onChange={e => updateNavItem(item.id, { path: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={item.visible} onChange={e => updateNavItem(item.id, { visible: e.target.checked })} />
                      <span className="text-[9px] font-bold uppercase">Visible</span>
                    </label>
                    <button onClick={() => removeNavItem(item.id)} className="text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'style' && (
          <div className="bg-white border p-12 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold serif-display uppercase border-b pb-4">Logo & Styles</h2>
            <div className="space-y-10">
              <div className="space-y-6">
                <label className="block text-[10px] font-bold text-stone-400 uppercase">Corporate Logo Config</label>
                <ImageUploadZone 
                  label="Logo Image" 
                  currentUrl={localSiteConfig.logoUrl} 
                  callback={url => setLocalSiteConfig({...localSiteConfig, logoUrl: url})} 
                />
                
                <div className="p-6 border bg-stone-50 rounded space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Logo Size (Height)</label>
                    <span className="text-xs font-bold font-mono">{localSiteConfig.logoSize || 40}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-black" 
                    value={localSiteConfig.logoSize || 40} 
                    onChange={e => setLocalSiteConfig({...localSiteConfig, logoSize: Number(e.target.value)})} 
                  />
                  <div className="flex justify-between text-[9px] text-stone-300 uppercase">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <button onClick={() => setLocalSiteConfig({...localSiteConfig, logoUrl: ''})} className="text-red-500 text-[10px] font-bold uppercase border-b border-red-500">Delete Logo</button>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Company Name</label>
                <input className="w-full border-b py-2 text-2xl font-bold serif-display focus:border-black outline-none" value={localSiteConfig.companyName} onChange={e => setLocalSiteConfig({...localSiteConfig, companyName: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {tab === 'layout' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold serif-display uppercase border-b pb-4 mb-8">Layout Coordinate Manager</h2>
            <PositionControl label="Home: Portfolio Title" targetKey="portfolioPos" />
            <PositionControl label="Home: About Title" targetKey="about.titlePos" />
            <PositionControl label="Home: Process Title" targetKey="processPos" />
            <PositionControl label="Home: Global CTA Title" targetKey="ctaPos" />
            <PositionControl label="Location: Page Header" targetKey="locationPos" />
          </div>
        )}

        {/* Floating Apply Button for Config Tabs */}
        {!['portfolio', 'heroes'].includes(tab) && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <button 
              onClick={handleApplyChanges}
              className="bg-black text-white px-12 py-5 rounded-full text-[13px] font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-stone-800 transition-all flex items-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              수정 내역 반영하기
            </button>
          </div>
        )}
      </div>

      {/* Modals for Portfolio & Heroes - these have their own save buttons */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSavePortfolio} className="bg-white p-10 rounded-sm max-w-4xl w-full my-8">
            <h2 className="text-2xl font-bold mb-10 serif-display border-b pb-4 uppercase tracking-widest text-stone-900">Project Editor</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-12 space-y-6">
                <ImageUploadZone 
                  label="Add Image (Drag & Drop)" 
                  callback={url => {
                    setEditingItem(prev => ({ ...prev, imageUrls: [...(prev?.imageUrls || []), url] }));
                  }} 
                />
                
                <div className="flex items-center gap-4">
                  <input className="flex-grow border p-3 text-sm" placeholder="Or enter Image URL..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} />
                  <button type="button" onClick={() => { if(newImageUrl) { setEditingItem(prev => ({ ...prev, imageUrls: [...(prev?.imageUrls || []), newImageUrl] })); setNewImageUrl(''); } }} className="bg-black text-white px-8 py-3 text-xs font-bold uppercase shrink-0">Add URL</button>
                </div>

                <div className="grid grid-cols-5 gap-4 mt-4 overflow-x-auto p-4 border bg-stone-50">
                  {editingItem.imageUrls?.map((url, i) => (
                    <div key={i} className="relative aspect-square group">
                      <img src={url} className="w-full h-full object-cover border bg-white shadow-sm" />
                      <button 
                        type="button" 
                        onClick={() => setEditingItem(prev => ({ ...prev, imageUrls: prev?.imageUrls?.filter((_, idx) => idx !== i) }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(!editingItem.imageUrls || editingItem.imageUrls.length === 0) && (
                    <div className="col-span-5 py-8 text-center text-stone-300 text-xs italic">등록된 이미지가 없습니다.</div>
                  )}
                </div>
              </div>
              <div className="md:col-span-8">
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2">Project Title</label>
                <input required className="w-full border-b py-3 text-xl font-bold uppercase" placeholder="Title" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
              </div>
            </div>
            <div className="flex space-x-4 mt-12">
              <button type="button" onClick={() => setEditingItem(null)} className="flex-1 border p-5 text-[11px] font-bold uppercase">Cancel</button>
              <button type="submit" className="flex-1 bg-black text-white p-5 text-[11px] font-bold uppercase">Save Project</button>
            </div>
          </form>
        </div>
      )}

      {editingHero && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSaveHero} className="bg-white p-10 rounded-sm max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-10 serif-display border-b pb-4 uppercase tracking-widest">Hero Editor</h2>
            <div className="space-y-8">
              <ImageUploadZone 
                label="Hero Background Image" 
                currentUrl={editingHero.imageUrl}
                callback={url => setEditingHero({...editingHero, imageUrl: url})} 
              />
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-stone-400 uppercase">Title & URL</label>
                <input required className="w-full border-b py-3 font-mono text-xs" placeholder="Or paste Image URL here" value={editingHero.imageUrl} onChange={e => setEditingHero({...editingHero, imageUrl: e.target.value})} />
                <input required className="w-full border-b py-3 text-xl font-bold" placeholder="Hero Title" value={editingHero.title} onChange={e => setEditingHero({...editingHero, title: e.target.value})} />
              </div>
            </div>
            <div className="flex space-x-4 mt-12">
              <button type="button" onClick={() => setEditingHero(null)} className="flex-1 border p-5 text-[11px] font-bold uppercase">Cancel</button>
              <button type="submit" className="flex-1 bg-black text-white p-5 text-[11px] font-bold uppercase">Save Hero</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
