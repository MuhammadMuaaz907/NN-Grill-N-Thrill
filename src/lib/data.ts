// src/lib/data.ts

import { CarouselItem, Category } from '@/types';

export const RESTAURANT_INFO = {
  name: 'NN',
  location: 'Gadap Town',
  phoneNumber: '0325 3652040',
  tagline: "Grill N' Thrill"
};

export const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'Where Flavor',
    description: 'Meets Happiness',
    image: '/hero-image.jpg'
  },
  {
    id: 2,
    title: 'Premium Breakfast',
    description: 'Start Your Day Right',
    image: '/hero-image.jpg'
  },
  {
    id: 3,
    title: 'Fresh Salads',
    description: 'Healthy & Delicious',
    image: '/hero-image.jpg'
  }
];

export const CATEGORIES: Category[] = [
  { id: 'eggs', name: 'EGGS' },
  { id: 'breakfast-waffles', name: 'BREAKFAST WAFFLES AND PAN CAKES' },
  { id: 'breakfast-sharing', name: 'BREAKFAST SHARING PLATTERS' },
  { id: 'small-plates', name: 'SMALL PLATES AND STARTERS' },
  { id: 'salad', name: 'SALAD' },
  { id: 'tacos', name: 'TACOS' },
  { id: 'pizza', name: 'PIZZA' },
  { id: 'sandwiches', name: 'SANDWICHES' }
];