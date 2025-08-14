export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'telebirr' | 'cbe' | 'm-pesa';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentPayload {
  order_no: string;
  amount: string;
  success_url: string;
  failure_url: string;
  customer_name: string;
  email_id: string;
  mobile_no: string;
  bill_address?: string;
  bill_city?: string;
  bill_state?: string;
  bill_country?: string;
  bill_zip?: string;
}