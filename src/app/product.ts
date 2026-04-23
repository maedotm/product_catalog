export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export const products: Product[] = [
  { id: 1, name: "Modern Desk Lamp", price: 45, category: "Office", image: "https://via.placeholder.com/300" },
  { id: 2, name: "Wireless Keyboard", price: 80, category: "Tech", image: "https://via.placeholder.com/300" },
  { id: 3, name: "Ergonomic Chair", price: 210, category: "Furniture", image: "https://via.placeholder.com/300" },
  { id: 4, name: "Leather Journal", price: 25, category: "Stationery", image: "https://via.placeholder.com/300" },
];