export interface Service {
  id: string;
  name: string;
  category: 'photography' | 'videography' | 'package' | 'addon';
  price: number;
  description: string;
  isActive: boolean;
}

export interface ReceiptItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  eventType: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  total: number;
  notes: string;
  createdAt: string;
  status: 'pending' | 'partial' | 'paid';
  amountPaid: number;
  balanceDue: number;
  advancePayment: number;
}

export interface BusinessSettings {
  id?: string | number;
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  instagram: string;
  address: string;
  currency: string;
  bankDetails: string;
  termsAndConditions: string;
  taxRate: number;
  upiId?: string;
  themePreference?: string;
  darkMode?: boolean;
}
