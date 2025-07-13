import { CartApiResponse, CartApiResponseWrapper } from "../../../../infrastructure/api/dtos/response/CartResponse";
import { Cart } from "../../../entities/cart/Cart";

export interface ICartRemoteDataSource {
    getCarts(): Promise<CartApiResponse[]>;
}