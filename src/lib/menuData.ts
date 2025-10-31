// src/lib/menuData.ts

import { MenuItem } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'popular-1',
    categoryId: 'breakfast-waffles',
    name: 'Spicy Honey Glazed Chicken on Waffle',
    description: 'Crispy waffle topped with spiced honey glazed chicken, served with berry compote',
    price: 1553,
    available: true
  },
  {
    id: 'popular-2',
    categoryId: 'small-plates',
    name: 'Parmesan Chicken',
    description: 'Golden crispy chicken breast coated with fresh parmesan and herbs',
    price: 2156,
    available: true
  },
  {
    id: 'eggs-1',
    categoryId: 'eggs',
    name: 'Scrambled Eggs with Toast',
    description: 'Fluffy scrambled eggs served with buttered toast',
    price: 850,
    available: true
  },
  {
    id: 'eggs-2',
    categoryId: 'eggs',
    name: 'Eggs Benedict',
    description: 'Poached eggs on English muffin with hollandaise sauce',
    price: 1200,
    available: true
  },
  {
    id: 'breakfast-1',
    categoryId: 'breakfast-waffles',
    name: 'Classic Belgian Waffles',
    description: 'Fluffy Belgian waffles with maple syrup and whipped cream',
    price: 950,
    available: true
  },
  {
    id: 'breakfast-2',
    categoryId: 'breakfast-waffles',
    name: 'Chocolate Chip Pancakes',
    description: 'Soft pancakes filled with chocolate chips, topped with berries',
    price: 1100,
    available: true
  },
  {
    id: 'breakfast-3',
    categoryId: 'breakfast-waffles',
    name: 'Strawberry Shortcake Waffle',
    description: 'Golden waffle with fresh strawberries and cream',
    price: 1050,
    available: true
  },
  {
    id: 'sharing-1',
    categoryId: 'breakfast-sharing',
    name: 'Breakfast Platter for Two',
    description: 'Assorted eggs, waffles, bacon, sausage and toast',
    price: 2200,
    available: true
  },
  {
    id: 'sharing-2',
    categoryId: 'breakfast-sharing',
    name: 'Continental Breakfast Spread',
    description: 'Cheeses, cured meats, pastries, fruits and croissants',
    price: 2800,
    available: true
  },
  {
    id: 'small-1',
    categoryId: 'small-plates',
    name: 'Crispy Calamari',
    description: 'Golden fried calamari served with marinara sauce',
    price: 1400,
    available: true
  },
  {
    id: 'small-2',
    categoryId: 'small-plates',
    name: 'Garlic Shrimp Bruschetta',
    description: 'Toasted bread topped with garlic shrimp and fresh herbs',
    price: 1600,
    available: true
  },
  {
    id: 'small-3',
    categoryId: 'small-plates',
    name: 'Mozzarella Sticks',
    description: 'Crispy fried mozzarella served with marinara',
    price: 950,
    available: true
  },
  {
    id: 'salad-1',
    categoryId: 'salad',
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, croutons with classic caesar dressing',
    price: 1200,
    available: true
  },
  {
    id: 'salad-2',
    categoryId: 'salad',
    name: 'Grilled Chicken Salad',
    description: 'Mixed greens with grilled chicken, vegetables and vinaigrette',
    price: 1500,
    available: true
  },
  {
    id: 'salad-3',
    categoryId: 'salad',
    name: 'Greek Salad',
    description: 'Tomatoes, cucumbers, feta cheese, olives with olive oil dressing',
    price: 1100,
    available: true
  },
  {
    id: 'tacos-1',
    categoryId: 'tacos',
    name: 'Chicken Tacos (3)',
    description: 'Three soft tacos with grilled chicken, lettuce, cheese and salsa',
    price: 1300,
    available: true
  },
  {
    id: 'tacos-2',
    categoryId: 'tacos',
    name: 'Beef Tacos (3)',
    description: 'Three crispy tacos with seasoned beef, sour cream and guacamole',
    price: 1400,
    available: true
  },
  {
    id: 'pizza-1',
    categoryId: 'pizza',
    name: 'Margherita Pizza',
    description: 'Classic pizza with mozzarella, tomato sauce and fresh basil',
    price: 1800,
    available: true
  },
  {
    id: 'pizza-2',
    categoryId: 'pizza',
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni and mozzarella cheese',
    price: 1900,
    available: true
  },
  {
    id: 'pizza-3',
    categoryId: 'pizza',
    name: 'Vegetarian Pizza',
    description: 'Fresh vegetables, mushrooms, peppers and olives',
    price: 1700,
    available: true
  }
];

// Popular items for the featured section
export const POPULAR_MENU_ITEMS: MenuItem[] = [
  MENU_ITEMS.find(item => item.id === 'popular-1')!,
  MENU_ITEMS.find(item => item.id === 'popular-2')!,
  MENU_ITEMS.find(item => item.id === 'breakfast-1')!
];