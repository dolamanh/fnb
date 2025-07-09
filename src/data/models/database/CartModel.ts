import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class CartModel extends Model {
  static table = 'carts';

  @field('client_id') client_id!: string;
  @field('customer_id') customer_id!: string;
  @field('name') name!: string;
  @field('customer_count') customer_count!: number;
  @field('cashier_name') cashier_name!: string;
  @field('user_id') user_id!: string;
  @field('note') note!: string;
  @field('device_id') device_id!: string;
  @field('dine_type') dine_type!: string;
  @field('shipping_method_type') shipping_method_type?: string;
  @field('partner_order_id') partner_order_id?: string;
  @field('status') status!: string;
  @field('created_on') created_on!: number;
  @field('modified_on') modified_on?: number;
  @field('total_item_price') total_item_price!: number;
  @field('total_discount') total_discount!: number;
  @field('total_price') total_price!: number;
  @field('client_time') client_time!: number;
  @field('print') print!: boolean;
  @field('print_stamp') print_stamp!: boolean;
  @field('print_check_sheet') print_check_sheet!: boolean;
  @field('print_time') print_time!: number;
  @field('reference') reference!: string;
  @field('deleted') deleted!: boolean;
  @field('include_tax_to_bill') include_tax_to_bill!: boolean;
  @field('cancelled') cancelled?: boolean;
  @field('print_stamp_time') print_stamp_time!: number;
  @field('print_check_sheet_time') print_check_sheet_time!: number;
  @field('printed') printed!: boolean;
  @field('last_version') last_version!: string;
  @field('vibrate_card_number') vibrate_card_number?: string;
  @field('cart_type') cart_type?: string;
  @field('cart_approve') cart_approve!: boolean;
  @field('payment_method_type') payment_method_type?: string;
  @field('cart_version') cart_version!: number;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}

export class CartItemModel extends Model {
  static table = 'cart_items';

  @field('cart_id') cart_id!: string;
  @field('product_id') product_id!: string;
  @field('name') name!: string;
  @field('quantity') quantity!: number;
  @field('price') price!: number;
  @field('discount') discount!: number;
  @field('total_price') total_price!: number;
  @field('note') note!: string;
  @field('created_on') created_on!: number;
  @field('modified_on') modified_on?: number;
  @field('deleted') deleted!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}

export class TableModel extends Model {
  static table = 'tables';

  @field('name') name!: string;
  @field('description') description?: string;
  @field('status') status!: string;
  @field('created_on') created_on!: number;
  @field('modified_on') modified_on?: number;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
