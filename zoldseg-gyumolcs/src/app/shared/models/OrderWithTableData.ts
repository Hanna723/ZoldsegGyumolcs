export interface OrderWithTableData {
  user: string;
  products: Array<{ name: string; amount: number }>;
  price: number;
  time: string | Date;
  time2: string | Date;
}
