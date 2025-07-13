import { Cart } from "../../entities/cart/Cart";

export interface ICartRepository {
    getCarts(): Promise<Cart[]>;
}
