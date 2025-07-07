/**
 * Single Base UseCase Interface
 * Tất cả use cases đều kế thừa interface này
 * 
 * @template TInput - Type of input parameters
 * @template TOutput - Type of output result
 */
export interface IUseCase<TInput = void, TOutput = void> {
  /**
   * Execute the use case with input parameters
   * @param input - Input parameters for the use case
   * @returns Promise with the result
   */
  execute(input: TInput): Promise<TOutput>;
}

/**
 * UseCase with validation support
 * Extends base interface with validation capabilities
 */
export interface IValidatedUseCase<TInput = void, TOutput = void> extends IUseCase<TInput, TOutput> {
  /**
   * Validate input before execution
   * @param input - Input to validate
   * @returns true if valid, throws error if invalid
   */
  validateInput(input: TInput): boolean;
}
