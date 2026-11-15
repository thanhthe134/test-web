export type AppView = 'home' | 'products' | 'detail' | 'projects' | 'contact' | 'admin';

export type ProductCategoryKey = 'all' | 'kinetic' | 'laser' | 'led-matrix';

export type EquipmentSystemType = 'led-matrix' | 'laser-pro' | 'kinetic-ball' | 'kinetic-ring';

export interface TechnicalSpecRow {
  label: string;
  value: string;
}

export interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  categoryKey: Exclude<ProductCategoryKey, 'all'>;
  categoryLabel: string;
  systemType: EquipmentSystemType;
  tagline: string;
  description: string;
  stageApplication: string;
  imageUrl: string;
  highlightSpec1Label: string;
  highlightSpec1Value: string;
  highlightSpec2Label: string;
  highlightSpec2Value: string;
  stockCount: number;
  status?: 'available' | 'maintenance';
  isFeatured?: boolean;
  specs: TechnicalSpecRow[];
  riggingNotes: {
    trussLoad: string;
    suspensionPoints: string;
    cableDrop: string;
    controlChain: string;
  };
}

export interface CoreLineSummary {
  id: string;
  systemType: EquipmentSystemType;
  categoryKey: Exclude<ProductCategoryKey, 'all'>;
  title: string;
  subtitle: string;
  summary: string;
  imageUrl: string;
  featuredProductId: string;
  keyMetric: string;
}

export interface ProjectCase {
  id: string;
  title: string;
  eventType: string;
  clientName?: string;
  location: string;
  date: string;
  scaleMetric: string;
  stageDimension: string;
  summary: string;
  imageUrl: string;
  equipmentUsed: string[];
  linkedCategory: Exclude<ProductCategoryKey, 'all'>;
}

export type QuoteCategoryOption = 'Kinetic Ball' | 'Kinetic Ring' | 'Laser' | 'LED Matrix';

export interface QuoteFormData {
  fullName: string;
  phone: string;
  company: string;
  eventDate: string;
  selectedCategories: QuoteCategoryOption[];
  stageDimensions: string;
  notes: string;
}

export type ContactStatus = 'pending' | 'contacted' | 'quoted';

export interface ContactRecord {
  contact_id: number;
  reference_code: string;
  customer_name: string;
  phone: string;
  company_agency: string;
  event_date: string;
  interested_categories: string[];
  stage_requirements: string;
  status: ContactStatus;
  created_at: string;
}
