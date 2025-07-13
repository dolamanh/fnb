import { inject, injectable } from "inversify";
import { Cart } from "../../entities/Cart";
import { TYPES } from "../../../di/types";
import { IUseCase } from "../base/IBaseUseCase";
import type { ICartRepository } from "../../ports/repositories/ICartRepository";

type getCartsInput = void;
type getCartsOutput = Cart[]; // Assuming Cart is an entity defined in your project

@injectable()
export class GetCartsUseCase implements IUseCase<getCartsInput, getCartsOutput> {
 constructor(
    @inject(TYPES.CartRepository) private cartRepository: ICartRepository
  ) {}

  async execute(): Promise<getCartsOutput> {
    return await this.cartRepository.getCarts();
  }
}
