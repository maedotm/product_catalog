export interface Product {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  discount?: number;
}