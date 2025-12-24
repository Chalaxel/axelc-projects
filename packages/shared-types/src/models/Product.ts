export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreationAttributes {
  name: string;
  price: number;
  categoryId: string;
}

