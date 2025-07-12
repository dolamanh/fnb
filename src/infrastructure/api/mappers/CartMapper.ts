// Mappers to convert between different Cart model types

import { Cart, CartItem, Table, Discount, ServiceFee, Tax, Combo } from '../../../core/entities/Cart';
import { 
  CartApiResponse, 
  CartItemApiResponse, 
  TableApiResponse,
  DiscountApiResponse,
  ServiceFeeApiResponse,
  TaxApiResponse,
  ComboApiResponse
} from '../dtos/CartResponse';
import { CartModel, CartItemModel, TableModel } from '../../database/CartModel';
import { 
  CartViewModel, 
  CartItemViewModel, 
  TableViewModel,
  DiscountViewModel,
  ServiceFeeViewModel,
  TaxViewModel,
  ComboViewModel
} from '../../../presentation/models/CartViewModel';

export class CartMapper {
  // API Response -> Domain Entity
  static fromApiResponse(apiResponse: CartApiResponse): Cart {
    return {
      client_id: apiResponse.client_id,
      customer_id: apiResponse.customer_id,
      name: apiResponse.name,
      customer_count: apiResponse.customer_count,
      cashier_name: apiResponse.cashier_name,
      user_id: apiResponse.user_id,
      note: apiResponse.note,
      device_id: apiResponse.device_id,
      dine_type: apiResponse.dine_type,
      shipping_method_type: apiResponse.shipping_method_type,
      partner_order_id: apiResponse.partner_order_id,
      status: apiResponse.status,
      created_on: apiResponse.created_on,
      modified_on: apiResponse.modified_on,
      total_item_price: apiResponse.total_item_price,
      total_discount: apiResponse.total_discount,
      total_price: apiResponse.total_price,
      client_time: apiResponse.client_time,
      print: apiResponse.print,
      print_stamp: apiResponse.print_stamp,
      print_check_sheet: apiResponse.print_check_sheet,
      print_time: apiResponse.print_time,
      reference: apiResponse.reference,
      deleted: apiResponse.deleted,
      include_tax_to_bill: apiResponse.include_tax_to_bill,
      items: apiResponse.items.map(this.fromCartItemApiResponse),
      table: apiResponse.table ? this.fromTableApiResponse(apiResponse.table) : undefined,
      discounts: apiResponse.discounts.map(this.fromDiscountApiResponse),
      discounts_not_use: apiResponse.discounts_not_use,
      service_fees: apiResponse.service_fees.map(this.fromServiceFeeApiResponse),
      taxes: apiResponse.taxes.map(this.fromTaxApiResponse),
      cancelled: apiResponse.cancelled,
      shipment: apiResponse.shipment,
      combos: apiResponse.combos.map(this.fromComboApiResponse),
      table_booking: apiResponse.table_booking,
      print_stamp_time: apiResponse.print_stamp_time,
      print_check_sheet_time: apiResponse.print_check_sheet_time,
      printed: apiResponse.printed,
      versions: apiResponse.versions,
      last_version: apiResponse.last_version,
      vibrate_card_number: apiResponse.vibrate_card_number,
      cart_type: apiResponse.cart_type,
      cart_approve: apiResponse.cart_approve,
      customer_info: apiResponse.customer_info,
      payment_method_type: apiResponse.payment_method_type,
      cart_version: apiResponse.cart_version,
      tables: apiResponse.tables?.map(this.fromTableApiResponse),
    };
  }

  // Database Model -> Domain Entity
  static fromDatabaseModel(dbModel: CartModel): Cart {
    return {
      client_id: dbModel.client_id,
      customer_id: dbModel.customer_id,
      name: dbModel.name,
      customer_count: dbModel.customer_count,
      cashier_name: dbModel.cashier_name,
      user_id: dbModel.user_id,
      note: dbModel.note,
      device_id: dbModel.device_id,
      dine_type: dbModel.dine_type,
      shipping_method_type: dbModel.shipping_method_type,
      partner_order_id: dbModel.partner_order_id,
      status: dbModel.status,
      created_on: dbModel.created_on,
      modified_on: dbModel.modified_on,
      total_item_price: dbModel.total_item_price,
      total_discount: dbModel.total_discount,
      total_price: dbModel.total_price,
      client_time: dbModel.client_time,
      print: dbModel.print,
      print_stamp: dbModel.print_stamp,
      print_check_sheet: dbModel.print_check_sheet,
      print_time: dbModel.print_time,
      reference: dbModel.reference,
      deleted: dbModel.deleted,
      include_tax_to_bill: dbModel.include_tax_to_bill,
      items: [], // Will be populated separately
      table: undefined, // Will be populated separately
      discounts: [], // Will be populated separately
      discounts_not_use: [],
      service_fees: [], // Will be populated separately
      taxes: [], // Will be populated separately
      cancelled: dbModel.cancelled,
      shipment: undefined,
      combos: [], // Will be populated separately
      table_booking: undefined,
      print_stamp_time: dbModel.print_stamp_time,
      print_check_sheet_time: dbModel.print_check_sheet_time,
      printed: dbModel.printed,
      versions: undefined,
      last_version: dbModel.last_version,
      vibrate_card_number: dbModel.vibrate_card_number,
      cart_type: dbModel.cart_type,
      cart_approve: dbModel.cart_approve,
      customer_info: undefined,
      payment_method_type: dbModel.payment_method_type,
      cart_version: dbModel.cart_version,
      tables: undefined,
    };
  }

  // Domain Entity -> View Model
  static toViewModel(cart: Cart): CartViewModel {
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

    const formatDateTime = (timestamp: number): string => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const getStatusText = (status: string): string => {
      const statusMap: { [key: string]: string } = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang phục vụ',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy',
        'paid': 'Đã thanh toán'
      };
      return statusMap[status] || status;
    };

    const getStatusColor = (status: string): string => {
      const colorMap: { [key: string]: string } = {
        'pending': '#FF9800',
        'processing': '#2196F3',
        'completed': '#4CAF50',
        'cancelled': '#F44336',
        'paid': '#4CAF50'
      };
      return colorMap[status] || '#757575';
    };

    const getDineTypeText = (dineType: string): string => {
      const typeMap: { [key: string]: string } = {
        'dine_in': 'Tại bàn',
        'takeaway': 'Mang về',
        'delivery': 'Giao hàng'
      };
      return typeMap[dineType] || dineType;
    };

    return {
      client_id: cart.client_id,
      customer_id: cart.customer_id,
      name: cart.name,
      customer_count: cart.customer_count,
      cashier_name: cart.cashier_name,
      user_id: cart.user_id,
      note: cart.note,
      device_id: cart.device_id,
      dine_type: cart.dine_type,
      status: cart.status,
      total_item_price: cart.total_item_price,
      total_discount: cart.total_discount,
      total_price: cart.total_price,
      
      // Formatted fields
      displayName: cart.table ? `${cart.table.name} - ${cart.name}` : cart.name,
      customerCountText: `${cart.customer_count} khách`,
      statusText: getStatusText(cart.status),
      statusColor: getStatusColor(cart.status),
      totalPriceFormatted: formatCurrency(cart.total_price),
      totalItemPriceFormatted: formatCurrency(cart.total_item_price),
      totalDiscountFormatted: formatCurrency(cart.total_discount),
      createdTimeFormatted: formatDateTime(cart.created_on),
      modifiedTimeFormatted: cart.modified_on ? formatDateTime(cart.modified_on) : '',
      dineTypeText: getDineTypeText(cart.dine_type),
      itemCount: cart.items.length,
      tableInfo: cart.table ? cart.table.name : getDineTypeText(cart.dine_type),
      
      // Nested ViewModels
      items: cart.items.map(this.toCartItemViewModel),
      table: cart.table ? this.toTableViewModel(cart.table) : undefined,
      discounts: cart.discounts.map(this.toDiscountViewModel),
      service_fees: cart.service_fees.map(this.toServiceFeeViewModel),
      taxes: cart.taxes.map(this.toTaxViewModel),
      combos: cart.combos.map(this.toComboViewModel),
    };
  }

  // Helper methods for nested entities
  static fromCartItemApiResponse(apiResponse: CartItemApiResponse): CartItem {
    return {
      id: apiResponse.id,
      cart_id: apiResponse.cart_id,
      product_id: apiResponse.product_id,
      name: apiResponse.name,
      quantity: apiResponse.quantity,
      price: apiResponse.price,
      discount: apiResponse.discount,
      total_price: apiResponse.total_price,
      note: apiResponse.note,
      created_on: apiResponse.created_on,
      modified_on: apiResponse.modified_on,
      deleted: apiResponse.deleted,
    };
  }

  static fromTableApiResponse(apiResponse: TableApiResponse): Table {
    return {
      id: apiResponse.id,
      name: apiResponse.name,
      description: apiResponse.description,
      status: apiResponse.status,
      created_on: apiResponse.created_on,
      modified_on: apiResponse.modified_on,
    };
  }

  static fromDiscountApiResponse(apiResponse: DiscountApiResponse): Discount {
    return {
      id: apiResponse.id,
      cart_id: apiResponse.cart_id,
      name: apiResponse.name,
      type: apiResponse.type,
      value: apiResponse.value,
      created_on: apiResponse.created_on,
      modified_on: apiResponse.modified_on,
      deleted: apiResponse.deleted,
    };
  }

  static fromServiceFeeApiResponse(apiResponse: ServiceFeeApiResponse): ServiceFee {
    return {
      id: apiResponse.id,
      cart_id: apiResponse.cart_id,
      name: apiResponse.name,
      type: apiResponse.type,
      value: apiResponse.value,
      created_on: apiResponse.created_on,
      modified_on: apiResponse.modified_on,
      deleted: apiResponse.deleted,
    };
  }

  static fromTaxApiResponse(apiResponse: TaxApiResponse): Tax {
    return {
      id: apiResponse.id,
      cart_id: apiResponse.cart_id,
      name: apiResponse.name,
      type: apiResponse.type,
      value: apiResponse.value,
      created_on: apiResponse.created_on,
      modified_on: apiResponse.modified_on,
      deleted: apiResponse.deleted,
    };
  }

  static fromComboApiResponse(apiResponse: ComboApiResponse): Combo {
    return {
      id: apiResponse.id,
      cart_id: apiResponse.cart_id,
      name: apiResponse.name,
      product_ids: apiResponse.product_ids,
      quantity: apiResponse.quantity,
      price: apiResponse.price,
      discount: apiResponse.discount,
      total_price: apiResponse.total_price,
      created_on: apiResponse.created_on,
      modified_on: apiResponse.modified_on,
      deleted: apiResponse.deleted,
    };
  }

  static toCartItemViewModel(item: CartItem): CartItemViewModel {
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

    return {
      id: item.id,
      cart_id: item.cart_id,
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
      total_price: item.total_price,
      note: item.note,
      quantityText: `${item.quantity}x`,
      priceFormatted: formatCurrency(item.price),
      totalPriceFormatted: formatCurrency(item.total_price),
      discountFormatted: formatCurrency(item.discount),
      hasDiscount: item.discount > 0,
      hasNote: item.note.trim() !== '',
    };
  }

  static toTableViewModel(table: Table): TableViewModel {
    return {
      id: table.id,
      name: table.name,
      description: table.description,
      status: table.status,
      displayName: table.name,
      statusText: table.status === 'available' ? 'Trống' : 'Có khách',
      statusColor: table.status === 'available' ? '#4CAF50' : '#F44336',
      fullDescription: table.description ? `${table.name} - ${table.description}` : table.name,
    };
  }

  static toDiscountViewModel(discount: Discount): DiscountViewModel {
    const formatValue = (type: string, value: number): string => {
      if (type === 'percentage') {
        return `${value}%`;
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    };

    return {
      id: discount.id,
      name: discount.name,
      type: discount.type,
      value: discount.value,
      valueFormatted: formatValue(discount.type, discount.value),
      typeText: discount.type === 'percentage' ? 'Phần trăm' : 'Số tiền',
    };
  }

  static toServiceFeeViewModel(serviceFee: ServiceFee): ServiceFeeViewModel {
    const formatValue = (type: string, value: number): string => {
      if (type === 'percentage') {
        return `${value}%`;
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    };

    return {
      id: serviceFee.id,
      name: serviceFee.name,
      type: serviceFee.type,
      value: serviceFee.value,
      valueFormatted: formatValue(serviceFee.type, serviceFee.value),
      typeText: serviceFee.type === 'percentage' ? 'Phần trăm' : 'Số tiền',
    };
  }

  static toTaxViewModel(tax: Tax): TaxViewModel {
    const formatValue = (type: string, value: number): string => {
      if (type === 'percentage') {
        return `${value}%`;
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    };

    return {
      id: tax.id,
      name: tax.name,
      type: tax.type,
      value: tax.value,
      valueFormatted: formatValue(tax.type, tax.value),
      typeText: tax.type === 'percentage' ? 'Phần trăm' : 'Số tiền',
    };
  }

  static toComboViewModel(combo: Combo): ComboViewModel {
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

    return {
      id: combo.id,
      name: combo.name,
      product_ids: combo.product_ids,
      quantity: combo.quantity,
      price: combo.price,
      discount: combo.discount,
      total_price: combo.total_price,
      quantityText: `${combo.quantity}x`,
      priceFormatted: formatCurrency(combo.price),
      totalPriceFormatted: formatCurrency(combo.total_price),
      discountFormatted: formatCurrency(combo.discount),
      productCount: combo.product_ids.length,
    };
  }

  // Array mappers
  static fromApiResponseArray(apiResponses: CartApiResponse[]): Cart[] {
    return apiResponses.map(this.fromApiResponse);
  }

  static fromDatabaseModelArray(dbModels: CartModel[]): Cart[] {
    return dbModels.map(this.fromDatabaseModel);
  }

  static toViewModelArray(carts: Cart[]): CartViewModel[] {
    return carts.map(this.toViewModel);
  }
}
