export type JobOpening = {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  industry: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  closingDate: string;
  link: string;
  isDemo?: boolean;
};

export type MarketplaceProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  isDemo?: boolean;
};

export type AffiliateOffer = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  link: string;
  badge: string;
};

export type ServiceOffer = {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
};

export const homeCategories = [
  {
    id: 'jobs',
    name: 'Jobs',
    description: 'Career options worldwide',
    accent: '#2563eb',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Discover products and brands',
    accent: '#0f766e',
  },
  {
    id: 'affiliate',
    name: 'Affiliate',
    description: 'Smart recommendations',
    accent: '#7c3aed',
  },
  {
    id: 'services',
    name: 'Services',
    description: 'Hire trusted professionals',
    accent: '#ea580c',
  },
];

export const featuredOpportunities = [
  {
    id: 'f1',
    type: 'Job',
    title: 'Regional Marketing Manager',
    subtitle: 'Remote • Full-time',
    detail: 'Build brand growth across Africa and Europe.',
  },
  {
    id: 'f2',
    type: 'Product',
    title: 'Sustainable Business Starter Kit',
    subtitle: 'Demo product',
    detail: 'Tools for new founders and digital entrepreneurs.',
  },
  {
    id: 'f3',
    type: 'Service',
    title: 'Website Design Packages',
    subtitle: 'Custom solution',
    detail: 'Launch your online presence with a conversion-ready site.',
  },
];

export const jobOpenings: JobOpening[] = [
  {
    id: 'j1',
    title: 'Senior Product Designer',
    company: 'Northstar Studio',
    location: 'Remote',
    country: 'United Kingdom',
    industry: 'Design',
    employmentType: 'Full-time',
    description: 'Create user-centered digital experiences for SaaS products serving international teams and clients.',
    closingDate: '2026-11-15',
    link: 'https://example.com/jobs/northstar',
    isDemo: true,
  },
  {
    id: 'j2',
    title: 'Operations Coordinator',
    company: 'Global Logistics Group',
    location: 'Dubai',
    country: 'United Arab Emirates',
    industry: 'Logistics',
    employmentType: 'Contract',
    description: 'Coordinate supplier updates, passenger scheduling, and process improvements across regional fulfillment teams.',
    closingDate: '2026-11-03',
    link: 'https://example.com/jobs/global-logistics',
    isDemo: true,
  },
  {
    id: 'j3',
    title: 'Customer Success Manager',
    company: 'Helio Commerce',
    location: 'Lagos',
    country: 'Nigeria',
    industry: 'Sales',
    employmentType: 'Full-time',
    description: 'Support digital merchants with onboarding, retention planning, and business growth insights.',
    closingDate: '2026-10-30',
    link: 'https://example.com/jobs/helio-commerce',
    isDemo: true,
  },
  {
    id: 'j4',
    title: 'Data Analyst',
    company: 'Summit Analytics',
    location: 'Toronto',
    country: 'Canada',
    industry: 'Technology',
    employmentType: 'Remote',
    description: 'Turn raw campaign and sales data into clear reporting dashboards and strategic recommendations.',
    closingDate: '2026-11-10',
    link: 'https://example.com/jobs/summit-analytics',
    isDemo: true,
  },
  {
    id: 'j5',
    title: 'Content Writer',
    company: 'Storyline Media',
    location: 'Cape Town',
    country: 'South Africa',
    industry: 'Marketing',
    employmentType: 'Part-time',
    description: 'Produce blog posts, landing pages, and campaign content for a growing digital publication network.',
    closingDate: '2026-10-27',
    link: 'https://example.com/jobs/storyline-media',
    isDemo: true,
  },
  {
    id: 'j6',
    title: 'Frontend Engineer',
    company: 'BrightPeak Labs',
    location: 'Berlin',
    country: 'Germany',
    industry: 'Technology',
    employmentType: 'Full-time',
    description: 'Build polished web interfaces, accessibility-first components, and responsive product experiences.',
    closingDate: '2026-11-18',
    link: 'https://example.com/jobs/brightpeak-labs',
    isDemo: true,
  },
];

export const demoProducts: MarketplaceProduct[] = [
  {
    id: 'p1',
    name: 'Business Growth Planner Kit',
    category: 'Education',
    price: '$49',
    description: 'A practical planning toolkit designed for entrepreneurs seeking to organize sales, marketing, and growth priorities.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    sellerName: 'Aster & Co.',
    sellerEmail: 'hello@asterco.demo',
    sellerPhone: '+1 (555) 123-4567',
    isDemo: true,
  },
  {
    id: 'p2',
    name: 'Smart Travel Organizer',
    category: 'Lifestyle',
    price: '$79',
    description: 'Portable travel storage features a modular layout for gadgets, documents, and daily essentials.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    sellerName: 'Nomad Essentials',
    sellerEmail: 'support@nomadessentials.demo',
    sellerPhone: '+44 20 7946 0958',
    isDemo: true,
  },
  {
    id: 'p3',
    name: 'Portable Office Projector',
    category: 'Technology',
    price: '$299',
    description: 'Compact presentation projector for remote teams, classrooms, and home office setups.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    sellerName: 'Streamline Devices',
    sellerEmail: 'sales@streamline-devices.demo',
    sellerPhone: '+61 2 5550 1033',
    isDemo: true,
  },
  {
    id: 'p4',
    name: 'Premium Productivity Notepad',
    category: 'Office',
    price: '$22',
    description: 'A premium paper planner designed for daily task tracking, priorities, and notes.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    sellerName: 'Write & Plan Studio',
    sellerEmail: 'shop@writeandplan.demo',
    sellerPhone: '+27 11 555 7788',
    isDemo: true,
  },
];

export const affiliateOffers: AffiliateOffer[] = [
  {
    id: 'a1',
    name: 'Remote Work Essentials Bundle',
    category: 'Workspace',
    price: '$59',
    description: 'Upgrade your home office with ergonomic accessories and productivity tools designed for growth-minded professionals.',
    link: 'https://example.com/affiliate/workspace-bundle',
    badge: 'Editor pick',
  },
  {
    id: 'a2',
    name: 'Online Course Starter Pack',
    category: 'Learning',
    price: '$89',
    description: 'A beginner-friendly toolkit for building digital skills, creating online courses, and generating income.',
    link: 'https://example.com/affiliate/course-pack',
    badge: 'Popular',
  },
  {
    id: 'a3',
    name: 'Freelance Toolkit',
    category: 'Career',
    price: '$39',
    description: 'Templates, checklists, and client management resources to help independent professionals win more work.',
    link: 'https://example.com/affiliate/freelance-toolkit',
    badge: 'Top rated',
  },
];

export const serviceOfferings = [
  {
    id: 's1',
    title: 'Graphic Design',
    category: 'Creative',
    description: 'Create brand assets, social media visuals, flyers, and polished marketing materials for your audience.',
    price: 'From $120',
  },
  {
    id: 's2',
    title: 'Website Development',
    category: 'Technology',
    description: 'Responsive websites and landing pages designed to convert visitors into leads and customers.',
    price: 'From $350',
  },
  {
    id: 's3',
    title: 'Tutoring',
    category: 'Education',
    description: 'Academic support and personalized coaching for students, professionals, and exam preparation.',
    price: 'From $25/hr',
  },
  {
    id: 's4',
    title: 'Content Writing',
    category: 'Marketing',
    description: 'SEO-friendly blog posts, product descriptions, and email campaigns that speak clearly to your market.',
    price: 'From $80',
  },
];

export const marketplaceFilters = ['All', 'Technology', 'Education', 'Lifestyle', 'Office'];
export const employmentTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];
