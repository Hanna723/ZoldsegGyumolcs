export interface Order {
  user: string;
  products: Array<{ id: string; amount: number }>;
  price: number;
  time: Date;
}
