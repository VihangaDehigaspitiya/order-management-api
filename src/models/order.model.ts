import { OrderStatus } from "../generic/enum";
import { Product } from "./product.model";

export class Order {
  id: string;
  customer_details: CustomerDetails;
  products: Product[];
  status: OrderStatus;
  created_at: number;
}

class CustomerDetails {
  name: string;
  email: string;
  mobile_no: string;
  address: string;
}
