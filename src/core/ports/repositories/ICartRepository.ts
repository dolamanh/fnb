import { Cart } from "../../entities/Cart";

export interface ICartRepository {
    getCarts(): Promise<Cart[]>;
}
