
import { PortfolioItem, HeroConfig, AboutConfig, ProcessStep, SiteConfig, NavItem, TextPosition } from './types';

const DEFAULT_POS: TextPosition = { align: 'left', marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 };
const CENTER_POS: TextPosition = { align: 'center', marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 };

export const INITIAL_NAV: NavItem[] = [
  { id: '1', label: 'Portfolio', path: '/portfolio', visible: true, order: 1 },
  { id: '2', label: 'About', path: '/about', visible: true, order: 2 },
  { id: '3', label: 'Location', path: '/location', visible: true, order: 3 },
  { id: '4', label: 'Admin', path: '/admin', visible: true, order: 4 },
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    category: '주거 인테리어',
    title: '강남구 도곡동 렉슬 34평',
    type: '아파트',
    size: '34평',
    keywords: ['미니멀', '따뜻한 톤', '수납 극대화'],
    imageUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200'
    ],
    description: '공간의 개방감을 확보하고 실용적인 수납을 더한 미니멀 디자인'
  }
];

export const INITIAL_HEROES: HeroConfig[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
    title: 'DESIGNING ESSENCE.',
    subtitle: 'Architectural Interior Studio',
    description: ''
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000',
    title: 'MATERIAL ARCHIVE.',
    subtitle: 'The Aesthetic Balance',
    description: ''
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000',
    title: 'PURE COMFORT.',
    subtitle: 'Timeless Living',
    description: ''
  }
];

export const INITIAL_ABOUT: AboutConfig = {
  title: '본질에 집중한 가치를 설계합니다',
  subtitle: 'Our Philosophy',
  description: 'JYDESIGN은 화려함보다 머무는 이의 평온을 먼저 생각합니다. 강릉의 자연과 도심이 어우러지는 영감을 통해 정제된 형태와 소재로 삶의 품격을 높입니다.',
  imageUrls: [
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'
  ],
  ctaLabel: 'Studio Philosophy',
  ctaUrl: '/about',
  titlePos: DEFAULT_POS
};

export const INITIAL_PROCESS: ProcessStep[] = [
  { id: '1', step: '01', title: 'Inquiry', description: '공간에 대한 첫 대화' },
  { id: '2', step: '02', title: 'Analysis', description: '현장 실측 및 구조 파악' },
  { id: '3', step: '03', title: 'Design', description: '3D 모델링 및 시각화' },
  { id: '4', step: '04', title: 'Build', description: '고품격 책임 시공' },
  { id: '5', step: '05', title: 'Legacy', description: '사후 케어 시스템' }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  companyName: "JYDESIGN",
  logoUrl: "",
  logoSize: 40,
  themeColor: "#1c1917",
  fontSerif: "'Cinzel', serif",
  fontSans: "'Pretendard', sans-serif",
  address: "강원 강릉시 포남동 630-3",
  email: "ehddlf2021@naver.com",
  phone: "010-6350-2016",
  footerAbout: "우리는 공간이 가진 본연의 가치를 탐구합니다.\n강릉을 거점으로 건축적 미학을 제안합니다.",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.433434190747!2d128.89047747633215!3d37.77821037253765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3561f0ac68a05f31%3A0xc660d2e8b0b5d8d0!2z6rCV7JuQ7Yq567OE7J6Q7LmY64-EIOqwleyneeyLnCDtm6zrgqTrj5kgNjMwLTM!5e0!3m2!1sko!2skr!4v1740500000000!5m2!1sko!2skr",
  naverMapUrl: "https://map.naver.com/p/search/%EC%A7%84%EC%9A%A9%EB%8C%80%EB%A6%AC%EC%A0%90/place/1557198098?c=15.00,0,0,0,dh&placePath=/home?from=map&fromPanelNum=2&timestamp=202602091118&locale=ko&svcName=map_pcv5&searchText=%EC%A7%84%EC%9A%A9%EB%8C%80%EB%A6%AC%EC%A0%90",
  kakaoMapUrl: "https://place.map.kakao.com/328108904",
  businessHours: "Mon - Fri : 10:00 - 18:00\nSat - Sun : Closed",
  contactUrl: "https://naver.me/F05jG73M",
  navItems: INITIAL_NAV,
  social: {
    instagram: "https://instagram.com",
    naverBlog: "https://blog.naver.com",
    pinterest: "https://pinterest.com",
    youtube: "https://youtube.com"
  },
  uiText: {
    portfolioSubtitle: "Portfolio Archive",
    portfolioTitle: "Selected Works",
    portfolioPos: DEFAULT_POS,
    processSubtitle: "Design Process",
    processTitle: "CRAFTING SPACES",
    processPos: CENTER_POS,
    locationSubtitle: "Location",
    locationTitle: "VISIT STUDIO",
    locationPos: CENTER_POS,
    locationCtaTitle: "Need a consultation?",
    locationCtaDescription: "방문 전 사전 예약을 부탁드립니다. 최상의 서비스를 약속합니다.",
    locationCtaButton: "Book an Appointment",
    locationCtaUrl: "https://naver.me/F05jG73M",
    ctaSubtitle: "Inquiry & Consultation",
    ctaTitle: "가치 있는 일상을\n지금 시작하세요.",
    ctaButton: "상담문의",
    ctaPos: CENTER_POS,
  }
};

export const ADMIN_PASSWORD = "1111";
