export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: 'fashion' | 'gadgets' | 'farming' | 'food';
  subcategory: string;
  images: string[];
  seller: Seller;
  location: string;
  city: string;
  createdAt: string;
  isFeatured: boolean;
  isPromoted: boolean;
  views: number;
  status: 'active' | 'sold' | 'pending' | 'draft';
  condition: 'new' | 'used' | 'refurbished';
  negotiable: boolean;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  verified: boolean;
  memberSince: string;
  totalListings: number;
  whatsappNumber: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  city: string;
  isVerified: boolean;
  isSeller: boolean;
  memberSince: string;
  totalListings: number;
  savedListings: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
  itemCount: number;
}

export interface Message {
  id: string;
  listingId: string;
  listingTitle: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  listingImage: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface AdBanner {
  id: string;
  title: string;
  image: string;
  color: string;
  link: string;
}

export interface FeaturedPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  color: string;
}
