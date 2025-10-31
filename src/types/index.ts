// src/types/index.ts

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  phoneNumber: string;
  cartCount: number;
}

export interface CarouselItem {
  id: number;
  title: string;
  description?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
}