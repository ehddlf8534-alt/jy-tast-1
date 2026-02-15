
export type Category = '주거 인테리어' | '상업 인테리어' | '부분 리모델링';
export type Alignment = 'left' | 'center' | 'right';

export interface TextPosition {
  align: Alignment;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  visible: boolean;
  order: number;
}

export interface PortfolioItem {
  id: string;
  category: Category;
  title: string;
  type: string;
  size: string;
  keywords: string[];
  imageUrls: string[];
  description: string;
}

export interface HeroConfig {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface AboutConfig {
  title: string;
  subtitle: string;
  description: string;
  imageUrls: string[];
  ctaLabel: string;
  ctaUrl: string;
  titlePos: TextPosition;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface SocialLinks {
  instagram: string;
  naverBlog: string;
  pinterest: string;
  youtube: string;
}

export interface SiteConfig {
  companyName: string;
  logoUrl?: string;
  logoSize?: number; // Added: Height in pixels
  themeColor: string;
  fontSerif: string;
  fontSans: string;
  address: string;
  email: string;
  phone: string;
  mapEmbedUrl: string;
  naverMapUrl: string;
  kakaoMapUrl: string;
  businessHours: string;
  contactUrl: string;
  footerAbout: string;
  navItems: NavItem[];
  social: SocialLinks;
  uiText: {
    portfolioSubtitle: string;
    portfolioTitle: string;
    portfolioPos: TextPosition;
    processSubtitle: string;
    processTitle: string;
    processPos: TextPosition;
    locationSubtitle: string;
    locationTitle: string;
    locationPos: TextPosition;
    locationCtaTitle: string;
    locationCtaDescription: string;
    locationCtaButton: string;
    locationCtaUrl: string;
    ctaSubtitle: string;
    ctaTitle: string;
    ctaButton: string;
    ctaPos: TextPosition;
  };
}
