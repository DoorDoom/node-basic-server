import { randomUUID } from 'crypto';
import type { CreateProductInput, IProduct } from '../interfaces/product.ts';

export class ProductService {
  private products: IProduct[] = [];

  create(input: CreateProductInput): IProduct {
    if (input.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const product: IProduct = {
      id: randomUUID(),
      ...input,
    };

    this.products.push(product);
    return product;
  }

  findAll(): IProduct[] {
    return this.products;
  }

  findById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  update(id: string, updates: Partial<CreateProductInput>): IProduct | null {
    const product = this.findById(id);
    if (!product) return null;

    if (updates.price !== undefined && updates.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    Object.assign(product, updates);
    return product;
  }

  delete(id: string): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }
}
