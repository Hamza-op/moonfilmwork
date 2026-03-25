import { Service, BusinessSettings } from '../types';
import pakistanWeddingServices from './pakistanWeddingServices.json';

export const defaultServices: Service[] = pakistanWeddingServices as Service[];

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
