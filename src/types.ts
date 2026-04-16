export interface KnowledgePoint {
  id: string;
  category: string;
  subCategory: string;
  name: string;
  grade: string;
}

export type ViewType = 'dashboard' | 'learning';

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}
