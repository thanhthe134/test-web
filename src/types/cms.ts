export type CollectionSlug = 'led-matrix' | 'laser' | 'kinetic';

export interface CmsProductSpec {
  label: string;
  value: string;
}

export interface FigmaProductModel {
  id: string;
  collection: CollectionSlug;
  collectionName: string;
  kicker: string;
  shortLabel: string;
  titleLine1: string;
  titleLine2: string;
  fullName: string;
  cardTag: string;
  cardSubtitle?: string;
  heroSummary: string;
  imageUrl: string;
  videoUrl?: string;
  galleryImages?: string[];
  specs: CmsProductSpec[];
  specsFootnote: string;
  applicationsLead: string;
  applicationsBody: string;
  applicationsFootnote: string;
}

export interface SiteSettings {
  companyName: string;
  heroKicker: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroImageUrl: string;
  heroVideoUrl: string;
  aboutKicker: string;
  aboutTitleLine1: string;
  aboutTitleLine2: string;
  aboutDescription: string;
  aboutImageUrl: string;
  footerDescription: string;
  phone: string;
  zalo: string;
  email: string;
  address: string;
}

export interface CmsProjectCase {
  id: string;
  num: string;
  title: string;
  detail: string;
  summary: string;
  imageUrl: string;
  videoUrl?: string;
  slug: CollectionSlug;
}

export interface CmsMediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  createdAt: string;
}

export interface CustomerInboxItem {
  contact_id: number;
  reference_code: string;
  customer_name: string;
  phone: string;
  company_agency: string;
  event_date: string;
  interested_categories: string[];
  stage_requirements: string;
  status: 'pending' | 'contacted' | 'quoted';
  admin_note?: string;
  created_at: string;
}

export interface PublicCmsPayload {
  siteSettings: SiteSettings;
  models: FigmaProductModel[];
  projects: CmsProjectCase[];
  media: CmsMediaItem[];
}
