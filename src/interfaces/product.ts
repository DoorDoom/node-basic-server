export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
};

export type IProduct = CreateProductInput & {
  id: string;
};
