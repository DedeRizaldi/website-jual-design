export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  fileUrl?: string; // Only available after purchase in real app
  created_at?: string; // For sorting by newest
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES = [
  { id: '1', name: 'Posters', icon: 'Poster' },
  { id: '2', name: 'UI Kits', icon: 'Layout' },
  { id: '3', name: 'Banners', icon: 'Image' },
  { id: '4', name: 'Social Media', icon: 'Instagram' },
  { id: '5', name: 'Branding', icon: 'Briefcase' },
  { id: '6', name: 'Templates', icon: 'FileCode' },
];