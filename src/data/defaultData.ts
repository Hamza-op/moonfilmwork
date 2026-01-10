import { Service, BusinessSettings } from '../types';

export const defaultServices: Service[] = [
  // Photography Services
  { id: '1', name: 'Wedding Photography', category: 'photography', price: 50000, description: 'Full day wedding coverage', isActive: true },
  { id: '2', name: 'Pre-Wedding Shoot', category: 'photography', price: 30000, description: 'Pre-wedding couple photoshoot', isActive: true },
  { id: '3', name: 'Portrait Session', category: 'photography', price: 10000, description: '1-2 hour portrait session', isActive: true },
  { id: '4', name: 'Product Photography', category: 'photography', price: 6000, description: 'Per product (5 photos)', isActive: true },
  { id: '5', name: 'Event Photography', category: 'photography', price: 20000, description: 'Corporate/Private events', isActive: true },
  { id: '6', name: 'Maternity Shoot', category: 'photography', price: 15000, description: 'Maternity photoshoot session', isActive: true },

  // Videography Services
  { id: '7', name: 'Wedding Film', category: 'videography', price: 70000, description: 'Full wedding day coverage', isActive: true },
  { id: '8', name: 'Cinematic Trailer', category: 'videography', price: 30000, description: '3-5 min highlight video', isActive: true },
  { id: '9', name: 'Event Videography', category: 'videography', price: 40000, description: 'Full event coverage', isActive: true },
  { id: '10', name: 'Commercial Video', category: 'videography', price: 50000, description: 'Brand/Product commercial', isActive: true },
  { id: '11', name: 'Drone Coverage', category: 'videography', price: 15000, description: 'Aerial videography addon', isActive: true },

  // Packages
  { id: '12', name: 'Wedding Complete Package', category: 'package', price: 110000, description: 'Photo + Video + Album', isActive: true },
  { id: '13', name: 'Pre-Wedding Package', category: 'package', price: 50000, description: 'Photo + Video + Prints', isActive: true },
  { id: '14', name: 'Event Complete Package', category: 'package', price: 55000, description: 'Photo + Video coverage', isActive: true },

  // Add-ons
  { id: '15', name: 'Extra Hour', category: 'addon', price: 4000, description: 'Additional coverage hour', isActive: true },
  { id: '16', name: 'Photo Album', category: 'addon', price: 10000, description: '20 page premium album', isActive: true },
  { id: '17', name: 'USB Drive', category: 'addon', price: 3000, description: 'All files on USB', isActive: true },
  { id: '18', name: 'Express Delivery', category: 'addon', price: 6000, description: '48 hour turnaround', isActive: true },
  { id: '19', name: 'Extra Photographer', category: 'addon', price: 10000, description: 'Additional photographer', isActive: true },
  { id: '20', name: 'Printed Photos (10)', category: 'addon', price: 2000, description: '10 printed photos 8x10', isActive: true },
];

export const defaultBusinessSettings: BusinessSettings = {
  businessName: 'Moonfilmwork',
  tagline: 'Capturing Moments, Creating Memories',
  phone: '+92 300 1234567',
  whatsappNumber: '+923001234567',
  email: 'moonfilmwork@gmail.com',
  instagram: '@moonfilmwork',
  address: 'Studio Address, City, Pakistan',
  currency: 'Rs. ',
  bankDetails: 'Bank Name: HBL\nAccount No: 1234567890\nIBAN: PK00HABB1234567890',
  termsAndConditions: '• 50% advance payment required for booking\n• Balance payment before delivery\n• Delivery within 15-30 working days\n• All photos/videos are digitally delivered',
  taxRate: 0,
};
