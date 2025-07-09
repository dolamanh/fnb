// Presentation Models for displaying Cart data in UI

export interface CartViewModel {
  client_id: string;
  customer_id: string;
  name: string;
  customer_count: number;
  cashier_name: string;
  user_id: string;
  note: string;
  device_id: string;
  dine_type: string;
  status: string;
  total_item_price: number;
  total_discount: number;
  total_price: number;
  
  // Formatted fields for UI
  displayName: string;                    // "Bàn 5 - Nguyễn Văn A"
  customerCountText: string;              // "5 khách"
  statusText: string;                     // "Đang phục vụ", "Đã thanh toán"
  statusColor: string;                    // Color for status indicator
  totalPriceFormatted: string;           // "150,000 VNĐ"
  totalItemPriceFormatted: string;       // "120,000 VNĐ"
  totalDiscountFormatted: string;        // "20,000 VNĐ"
  createdTimeFormatted: string;          // "14:30 - 8/7/2025"
  modifiedTimeFormatted: string;         // "15:45 - 8/7/2025"
  dineTypeText: string;                  // "Tại bàn", "Mang về"
  itemCount: number;                     // Total items in cart
  tableInfo: string;                     // "Bàn 5" or "Mang về"
  
  // Nested ViewModels
  items: CartItemViewModel[];
  table?: TableViewModel;
  discounts: DiscountViewModel[];
  service_fees: ServiceFeeViewModel[];
  taxes: TaxViewModel[];
  combos: ComboViewModel[];
}

export interface CartItemViewModel {
  id: string;
  cart_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  total_price: number;
  note: string;
  
  // Formatted fields
  quantityText: string;           // "2x"
  priceFormatted: string;         // "50,000 VNĐ"
  totalPriceFormatted: string;    // "100,000 VNĐ"
  discountFormatted: string;      // "10,000 VNĐ"
  hasDiscount: boolean;           // For conditional UI
  hasNote: boolean;               // For conditional UI
}

export interface TableViewModel {
  id: string;
  name: string;
  description?: string;
  status: string;
  
  // Formatted fields
  displayName: string;            // "Bàn 5"
  statusText: string;             // "Trống", "Có khách"
  statusColor: string;            // Color for status
  fullDescription: string;        // "Bàn 5 - Khu vực VIP"
}

export interface DiscountViewModel {
  id: string;
  name: string;
  type: string;
  value: number;
  
  // Formatted fields
  valueFormatted: string;         // "10%" or "50,000 VNĐ"
  typeText: string;               // "Phần trăm", "Số tiền"
}

export interface ServiceFeeViewModel {
  id: string;
  name: string;
  type: string;
  value: number;
  
  // Formatted fields
  valueFormatted: string;         // "5%" or "20,000 VNĐ"
  typeText: string;               // "Phần trăm", "Số tiền"
}

export interface TaxViewModel {
  id: string;
  name: string;
  type: string;
  value: number;
  
  // Formatted fields
  valueFormatted: string;         // "10%" or "15,000 VNĐ"
  typeText: string;               // "Phần trăm", "Số tiền"
}

export interface ComboViewModel {
  id: string;
  name: string;
  product_ids: string[];
  quantity: number;
  price: number;
  discount: number;
  total_price: number;
  
  // Formatted fields
  quantityText: string;           // "2x"
  priceFormatted: string;         // "80,000 VNĐ"
  totalPriceFormatted: string;    // "160,000 VNĐ"
  discountFormatted: string;      // "20,000 VNĐ"
  productCount: number;           // Number of products in combo
}

export interface CartListViewModel {
  carts: CartViewModel[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error?: string;
  
  // Summary data
  totalRevenue: number;
  totalRevenueFormatted: string;  // "2,500,000 VNĐ"
  averageOrderValue: number;
  averageOrderValueFormatted: string; // "125,000 VNĐ"
}

export interface CartFormViewModel {
  client_id?: string;
  customer_id: string;
  name: string;
  customer_count: number;
  cashier_name: string;
  user_id: string;
  note: string;
  device_id: string;
  dine_type: string;
  table_id?: string;
  
  // Form validation
  nameError?: string;
  customer_countError?: string;
  cashier_nameError?: string;
  dine_typeError?: string;
  
  // Form state
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  
  // Available options
  availableTables: TableViewModel[];
  dineTypeOptions: { value: string; label: string }[];
}

export interface CartDetailViewModel {
  cart: CartViewModel;
  isLoading: boolean;
  error?: string;
  
  // Actions
  canEdit: boolean;
  canDelete: boolean;
  canPrint: boolean;
  canAddItems: boolean;
  canApplyDiscount: boolean;
  canCheckout: boolean;
  
  // UI state
  showItemDetails: boolean;
  showDiscountDetails: boolean;
  showPaymentOptions: boolean;
}
