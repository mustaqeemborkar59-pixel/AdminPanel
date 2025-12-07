
import type { MenuItem } from '@/types';

// This data is now just a fallback and should be replaced by WooCommerce data.
export const initialMenuItems: MenuItem[] = [
  // Fiction
  {
    id: 'BOOK001',
    name: 'The Midnight Library',
    category: 'Fiction',
    price: 15.99,
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'midnight library book',
    availability: true,
    description: 'A novel about a library that allows you to live the life you could have lived.',
  },
  {
    id: 'BOOK002',
    name: 'Klara and the Sun',
    category: 'Fiction',
    price: 18.50,
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'klara sun book',
    availability: true,
    description: 'A story about an Artificial Friend who longs for a human connection.',
  },

  // Non-Fiction
  {
    id: 'BOOK003',
    name: 'Sapiens: A Brief History of Humankind',
    category: 'Non-Fiction',
    price: 22.00,
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'sapiens book',
    availability: true,
    description: 'An exploration of the history of Homo sapiens.',
  },
  {
    id: 'BOOK004',
    name: 'Educated: A Memoir',
    category: 'Non-Fiction',
    price: 17.99,
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'educated memoir book',
    availability: true,
    description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
  },

  // Science Fiction
  {
    id: 'BOOK005',
    name: 'Dune',
    category: 'Science Fiction',
    price: 19.99,
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'dune book',
    availability: true,
    description: 'A science fiction epic set in the distant future amidst a feudal interstellar society.',
  },
  {
    id: 'BOOK006',
    name: 'Project Hail Mary',
    category: 'Science Fiction',
    price: 20.00,
    imageUrl: 'https://placehold.co/300x200.png',
    imageHint: 'hail mary book',
    availability: false,
    description: 'A lone astronaut must save the earth from a disaster.',
  },
];
