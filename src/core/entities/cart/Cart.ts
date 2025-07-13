export interface Cart {
  client_id: string;
  customer_id: string;
  name: string;
  customer_count: number;
  cashier_name: string;
  user_id: string;
  note: string;
  device_id: string;
  dine_type: string;
  shipping_method_type?: string;
  partner_order_id?: string;
  status: string;
  created_on: number;
  modified_on?: number;
  total_item_price: number;
  total_discount: number;
  total_price: number;
  client_time: number;
  print: boolean;
  print_stamp: boolean;
  print_check_sheet: boolean;
  print_time: number;
  reference: string;
  deleted: boolean;
  include_tax_to_bill: boolean;
  items: CartItem[];
  table?: Table;
  discounts: Discount[];
  discounts_not_use: string[];
  service_fees: ServiceFee[];
  taxes: Tax[];
  cancelled?: boolean;
  shipment?: unknown;
  combos: Combo[];
  table_booking?: unknown;
  print_stamp_time: number;
  print_check_sheet_time: number;
  printed: boolean;
  versions?: unknown;
  last_version: string;
  vibrate_card_number?: string;
  cart_type?: string;
  cart_approve: boolean;
  customer_info?: unknown;
  payment_method_type?: string;
  cart_version: number;
  tables?: Table[];
}
export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  total_price: number;
  note: string;
  created_on: number;
  modified_on?: number;
  deleted: boolean;
}
export interface Table {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_on: number;
  modified_on?: number;
}
export interface Discount {
  id: string;
  cart_id: string;
  name: string;
  type: string;
  value: number;
  created_on: number;
  modified_on?: number;
  deleted: boolean;
}
export interface ServiceFee {
  id: string;
  cart_id: string;
  name: string;
  type: string;
  value: number;
  created_on: number;
  modified_on?: number;
  deleted: boolean;
}
export interface Tax {
  id: string;
  cart_id: string;
  name: string;
  type: string;
  value: number;
  created_on: number;
  modified_on?: number;
  deleted: boolean;
}
export interface Combo {
  id: string;
  cart_id: string;
  name: string;
  product_ids: string[];
  quantity: number;
  price: number;
  discount: number;
  total_price: number;
  created_on: number;
  modified_on?: number;
  deleted: boolean;
}