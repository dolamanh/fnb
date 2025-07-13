import { inject, injectable } from "inversify";
import type { ICartRemoteDataSource } from "../../core/ports/datasources/remote/ICartRemoteDataSource";
import { TYPES } from "../../di/types";
import { Cart } from "../../core/entities/cart/Cart";
import { CartMapper } from "../api/mappers/CartMapper";
import { ICartRepository } from "../../core/ports/repositories/ICartRepository";

@injectable()
export class CartRepository implements ICartRepository {
    constructor(
        @inject(TYPES.CartRemoteDataSource) private remoteDataSource: ICartRemoteDataSource
    ){}

    async getCarts(): Promise<Cart[]> {
        try {
            const carts = await this.remoteDataSource.getCarts();
            console.log('API carts response:', carts);
            return carts.map(cart => CartMapper.fromApiResponse(cart));;
        } catch (error) {
            console.error('Failed to fetch carts:', error);
            throw new Error('Could not retrieve carts');
        }
    }
    
    
}