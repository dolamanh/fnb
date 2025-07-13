import { CartApiResponse, CartApiResponseWrapper } from "../../../infrastructure/api/dtos/CartResponse";
import { Cart } from "../../entities/Cart";

export interface ICartRemoteDataSource {
    getCarts(): Promise<CartApiResponse[]>;
}