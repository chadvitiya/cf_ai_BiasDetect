export type Category = 'geopolitics' | 'science' | 'business' | 'culture' | 'security' | 'sports';

export interface CategoryInfo {
  id: Category;
  label: string;
  icon: string;
  query: string;
}

export interface Article {
  title: string;
  snippet: string;
  summary: string;
  sentiment: number;
  bias: string;
  reason: string;
  link: string;
  source?: string;
  date?: string;
}
