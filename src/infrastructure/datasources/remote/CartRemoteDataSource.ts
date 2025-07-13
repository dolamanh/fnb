import { inject, injectable } from "inversify";
import type { Cart } from "../../../core/entities/cart/Cart";
import type { ICartRemoteDataSource } from "../../../core/ports/datasources/remote/ICartRemoteDataSource";
import type { IApiService } from "../../../core/ports/services/IApiService";
import { TYPES } from "../../../di/types";
import { CartMapper } from "../../api/mappers/CartMapper";
import { CartApiResponse, CartApiResponseWrapper } from "../../api/dtos/response/CartResponse";

@injectable()
export class CartRemoteDataSource implements ICartRemoteDataSource {
    constructor(
        @inject(TYPES.ApiService) private apiService: IApiService
    ) { }
    async getCarts(): Promise<CartApiResponse[]> {
        try {
            const response = await this.apiService.get<CartApiResponseWrapper>('/carts.json?page=0&processing=true&limit=0');
            console.log('API carts response:', response.data);
            return response.data.carts;
            // return response.data.map(cart => CartMapper.fromApiResponse(cart)); // Assuming the API returns an array of Cart objects
        } catch (error) {
            console.error('Failed to fetch carts:', error);
            throw error; // Re-throwing the error for further handling
        }
    }

}