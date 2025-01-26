// src/data/mockData.ts

import imgSet1A from '../assets/images/r3.png';
import imgSet1B from '../assets/images/r1.png';
import imgSet2A from '../assets/images/r4.png';
import imgSet2B from '../assets/images/banner.jpeg';
import imgStatic from '../assets/images/r2.png';

// Define interfaces
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  author: string;
  date: string;
  comment: string;
  reply?: string;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  categories: string[]; // e.g., ["Barbershop", "Hair"]
  priceRange: string; // e.g., "$", "$$", "$$$"
  images: string[];
  services: Service[];
  aboutMsg: string;
  amenities: string[];
  reviews: Review[];
  onSale?: boolean; // Optional: For "On Sale" filter
}

// Mock Services
export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'HAIRCUT',
    description: 'Haircut and lineup, no beard, no eyebrows',
    price: '$40.00+',
    duration: '30min',
  },
  {
    id: 's2',
    name: 'HAIRCUT AND BEARD',
    description: 'Includes styling + beard trim',
    price: '$45.00+',
    duration: '30min',
  },
  {
    id: 's3',
    name: 'HAIRCUT, BEARD & EYEBROWS',
    description: 'Complete grooming package',
    price: '$50.00+',
    duration: '30min',
  },
  {
    id: 's4',
    name: 'Hair Consultation',
    description: '30min consult for hair loss treatments',
    price: '$80.00',
    duration: '30min',
  },
  {
    id: 's5',
    name: 'Follow-up Session',
    description: 'Regular checkup & maintenance',
    price: '$40.00',
    duration: '30min',
  },
  // Add more services as needed
];

// Mock Reviews
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    rating: 5,
    title: 'HAIRCUT & BEARD',
    author: 'Luis D Garcia',
    date: 'May 31, 2024',
    comment: 'Super good service!',
    reply: 'Super thankful and thankful! 🤗🙏',
  },
  {
    id: 'r2',
    rating: 5,
    title: 'HAIRCUT',
    author: 'Leonardo G',
    date: 'May 22, 2024',
    comment: 'Excellent service 👍',
    reply: 'Gracias Leo!! 🙏',
  },
  {
    id: 'r3',
    rating: 5,
    title: 'Hair Unit Installation',
    author: 'Adrian F',
    date: 'May 31, 2024',
    comment: 'Life changing results.',
    reply: 'Truly appreciate it! 💛',
  },
  // Add more reviews if needed for pagination
];

// Mock Businesses
export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Anthony @ Westside Barbershop',
    address: '2800 N MacDill Ave, Suite R, Tampa, 33607',
    phone: '(813) 360-3761',
    rating: 5.0,
    reviewCount: 410,
    categories: ['Barbershop', 'Hair'],
    priceRange: '$$',
    images: [imgSet1A, imgSet1B, imgSet2A, imgSet2B], // rotating slideshow
    services: MOCK_SERVICES,
    aboutMsg: `PLEASE HAVE YOUR PHONE NUMBER UP TO DATE BECAUSE I WILL SHOOT YOU A TEXT IF I CANNOT MAKE IT. THANKS FOR BOOKING!`,
    amenities: [
      'Parking space',
      'Wi-Fi',
      'Credit cards accepted',
      'Child-friendly',
      'Accessible for people with disabilities',
    ],
    reviews: MOCK_REVIEWS,
    onSale: true, // Example flag for "On Sale" filter
  },
  {
    id: 'b2',
    name: 'Hair Loss Solutions - Non Surgical',
    address: '12301 Lake Underhill Rd, Suite 126, Orlando, 32828',
    phone: '(407) 555-1212',
    rating: 5.0,
    reviewCount: 348,
    categories: ['Hair', 'Non-Surgical'],
    priceRange: '$$$',
    images: [imgSet2A, imgSet1B, imgStatic],
    services: [
      {
        id: 's4',
        name: 'Hair Consultation',
        description: '30min consult for hair loss treatments',
        price: '$80.00',
        duration: '30min',
      },
      {
        id: 's5',
        name: 'Follow-up Session',
        description: 'Regular checkup & maintenance',
        price: '$40.00',
        duration: '30min',
      },
    ],
    aboutMsg: `Specializing in hair loss solutions with a non-surgical approach!`,
    amenities: ['Wi-Fi', 'Parking space', 'Accessible for people with disabilities'],
    reviews: MOCK_REVIEWS,
    onSale: false,
  },
  {
    id: 'b3',
    name: 'Elite Cleaners Co.',
    address: '456 Oak Street, Orlando, 32828',
    phone: '(407) 555-3434',
    rating: 4.8,
    reviewCount: 275,
    categories: ['Cleaning', 'Residential'],
    priceRange: '$$',
    images: [imgSet1B, imgSet2A, imgStatic],
    services: [
      {
        id: 's6',
        name: 'Deep Cleaning',
        description: 'Comprehensive cleaning service for your home.',
        price: '$120.00',
        duration: '2h',
      },
      {
        id: 's7',
        name: 'Office Cleaning',
        description: 'Maintain a spotless workspace.',
        price: '$200.00',
        duration: '3h',
      },
    ],
    aboutMsg: `Providing top-notch cleaning services to ensure your space is immaculate.`,
    amenities: ['Wi-Fi', 'Eco-friendly products', 'Flexible scheduling'],
    reviews: MOCK_REVIEWS,
    onSale: true,
  },
  {
    id: 'b4',
    name: 'Sparkle Maid Services',
    address: '789 Pine Ave, Tampa, 33607',
    phone: '(813) 555-7890',
    rating: 4.5,
    reviewCount: 190,
    categories: ['Cleaning', 'Maid Service'],
    priceRange: '$',
    images: [imgSet2B, imgSet1A, imgSet1B],
    services: [
      {
        id: 's8',
        name: 'Standard Cleaning',
        description: 'Regular cleaning service for your home.',
        price: '$80.00',
        duration: '1.5h',
      },
      {
        id: 's9',
        name: 'Move-Out Cleaning',
        description: 'Ensure your old place is spotless.',
        price: '$150.00',
        duration: '3h',
      },
    ],
    aboutMsg: `Dedicated to making your living space clean and comfortable.`,
    amenities: ['Pet-friendly', 'Flexible hours', 'Insurance covered'],
    reviews: MOCK_REVIEWS,
    onSale: false,
  },
  {
    id: 'b5',
    name: 'Bright Spaces Cleaning',
    address: '321 Maple Road, Orlando, 32828',
    phone: '(407) 555-5678',
    rating: 4.7,
    reviewCount: 220,
    categories: ['Cleaning', 'Commercial'],
    priceRange: '$$$',
    images: [imgStatic, imgSet1A, imgSet2A],
    services: [
      {
        id: 's10',
        name: 'Industrial Cleaning',
        description: 'Heavy-duty cleaning for industrial spaces.',
        price: '$300.00',
        duration: '5h',
      },
      {
        id: 's11',
        name: 'Window Cleaning',
        description: 'Crystal clear windows for your business.',
        price: '$100.00',
        duration: '2h',
      },
    ],
    aboutMsg: `Ensuring your commercial space shines with our expert cleaning services.`,
    amenities: ['24/7 Service', 'State-of-the-art equipment', 'Highly trained staff'],
    reviews: MOCK_REVIEWS,
    onSale: true,
  },
  {
    id: 'b6',
    name: 'GreenClean Solutions',
    address: '654 Cedar Blvd, Tampa, 33607',
    phone: '(813) 555-1234',
    rating: 4.9,
    reviewCount: 310,
    categories: ['Cleaning', 'Eco-Friendly'],
    priceRange: '$$',
    images: [imgSet1B, imgSet2B, imgSet1A],
    services: [
      {
        id: 's12',
        name: 'Eco-Friendly Cleaning',
        description: 'Green cleaning solutions for a healthier home.',
        price: '$90.00',
        duration: '2h',
      },
      {
        id: 's13',
        name: 'Carpet Cleaning',
        description: 'Deep cleaning for your carpets.',
        price: '$110.00',
        duration: '2.5h',
      },
    ],
    aboutMsg: `Committed to providing eco-friendly cleaning services without compromising quality.`,
    amenities: ['Biodegradable products', 'No harsh chemicals', 'Certified technicians'],
    reviews: MOCK_REVIEWS,
    onSale: false,
  },
  {
    id: 'b7',
    name: 'Pure Shine Cleaners',
    address: '987 Birch Lane, Orlando, 32828',
    phone: '(407) 555-6789',
    rating: 4.6,
    reviewCount: 180,
    categories: ['Cleaning', 'Specialized Services'],
    priceRange: '$$',
    images: [imgSet2A, imgStatic, imgSet1B],
    services: [
      {
        id: 's14',
        name: 'Specialized Floor Cleaning',
        description: 'Expert cleaning for hardwood and tiled floors.',
        price: '$130.00',
        duration: '3h',
      },
      {
        id: 's15',
        name: 'Upholstery Cleaning',
        description: 'Revitalize your furniture with our upholstery cleaning.',
        price: '$100.00',
        duration: '2h',
      },
    ],
    aboutMsg: `Providing specialized cleaning services to keep your home looking its best.`,
    amenities: ['Stain removal', 'Protective treatments', 'Quick drying'],
    reviews: MOCK_REVIEWS,
    onSale: true,
  },
  {
    id: 'b8',
    name: 'Pristine Cleaners',
    address: '159 Walnut Street, Tampa, 33607',
    phone: '(813) 555-2468',
    rating: 4.4,
    reviewCount: 150,
    categories: ['Cleaning', 'Residential'],
    priceRange: '$',
    images: [imgSet1A, imgSet2A, imgSet2B],
    services: [
      {
        id: 's16',
        name: 'Basic Home Cleaning',
        description: 'Essential cleaning services for your home.',
        price: '$60.00',
        duration: '1h 30min',
      },
      {
        id: 's17',
        name: 'Post-Construction Cleaning',
        description: 'Cleaning services after construction work.',
        price: '$200.00',
        duration: '4h',
      },
    ],
    aboutMsg: `Dedicated to making your home spotless with our reliable cleaning services.`,
    amenities: ['Affordable rates', 'Trusted professionals', 'Flexible scheduling'],
    reviews: MOCK_REVIEWS,
    onSale: false,
  },
  // Add more businesses as needed, reusing images
];

// Mock Filters
export const MOCK_FILTERS = {
  Categories: [
    { name: 'Barbershop', count: 95 },
    { name: 'Hair', count: 80 },
    { name: 'Cleaning', count: 120 },
    { name: 'Residential', count: 70 },
    { name: 'Commercial', count: 50 },
    { name: 'Non-Surgical', count: 40 },
    { name: 'Maid Service', count: 60 },
    { name: 'Eco-Friendly', count: 30 },
    { name: 'Specialized Services', count: 45 },
  ],
  PriceRanges: [
    { name: '$', count: 30, color: 'green' },
    { name: '$$', count: 50, color: 'blue' },
    { name: '$$$', count: 20, color: 'red' },
  ],
  Ratings: [
    { name: '5 Stars', count: 120 },
    { name: '4 Stars', count: 60 },
    { name: '3 Stars', count: 25 },
    { name: '2 Stars', count: 10 },
    { name: '1 Star', count: 5 },
  ],
  Amenities: [
    { name: 'Parking Space', count: 50 },
    { name: 'Wi-Fi', count: 40 },
    { name: 'Pet-Friendly', count: 20 },
    { name: 'Child-Friendly', count: 25 },
    { name: 'Credit Card Accepted', count: 60 },
    { name: 'Disability Accessible', count: 30 },
  ],
};

// Top-level categories (like "Autopart", "Beauty & Health", etc.)
export const TOP_CATEGORIES = [
  'Deep Cleaning',
  'Glass Cleaning',
  'Maid Service',
  'Office Cleaning',
  'Carpet Cleaning',
  'Upholstery Cleaning',
  'General Cleaning',
  'Detailing',
  'Yard Care',
  'Lawn Mowing',
  'Roof Cleaning',

];
