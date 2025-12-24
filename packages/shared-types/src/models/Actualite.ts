export interface Actualite {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
  content: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string | null;
  category: string;
  publishedAt: Date | null;
  status: 'draft' | 'published';
  isFeatured: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleCreationAttributes {
  title: string;
  description: string;
  content: string;
  imageUrl?: string | null;
  category: string;
  publishedAt?: Date | null;
  status?: 'draft' | 'published';
  isFeatured?: boolean;
  slug: string;
}

