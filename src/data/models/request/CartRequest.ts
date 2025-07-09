// API Request Models for Cart operations

export interface CreateCartRequest {
  customer_id: string;
  name: string;
  customer_count: number;
  cashier_name: string;
  user_id: string;
  note?: string;
  device_id: string;
  dine_type: string;
  shipping_method_type?: string;
  partner_order_id?: string;
  table_id?: string;
}

export interface UpdateCartRequest {
  name?: string;
  customer_count?: number;
  cashier_name?: string;
  note?: string;
  dine_type?: string;
  shipping_method_type?: string;
  partner_order_id?: string;
  table_id?: string;
  status?: string;
}

export interface AddCartItemRequest {
  cart_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  price?: number;
  note?: string;
}

export interface GetCartRequest {
  cart_id: string;
}

export interface GetCartsRequest {
  page?: number;
  limit?: number;
  status?: string;
  customer_id?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  sortBy?: 'created_on' | 'total_price' | 'customer_count';
  sortOrder?: 'asc' | 'desc';
}

export interface DeleteCartRequest {
  cart_id: string;
  soft_delete?: boolean;
}
