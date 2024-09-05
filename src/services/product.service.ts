import path from "path";
import fs from "fs";
import { Product } from "../models/product.model";

export class ProductService {

  /**
   * in memory products array
   */
  static products: Product[] = [];

  /**
   * load products from the json
   */
  static loadProducts(): void {
    const filePath = path.join(__dirname, "../data/products.json");
    const data = fs.readFileSync(filePath, "utf-8");
    this.products = JSON.parse(data);
  }

  /**
   * get product details by id
   * @param id 
   * @returns 
   */
  static getProductById(id: number): Product {
    return this.products.find((x) => x.id === id);
  }

  /**
   * process order items
   * @param orderItems 
   * @returns 
   */
  static processOrderItems(orderItems: Product[]): Product[] {
    return orderItems.map((item: Product) => {
      const product = this.getProductById(item.id);
      product.quantity -= item.quantity;
      return {
        id: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });
  }
}
