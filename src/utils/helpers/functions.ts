import { Product } from "../../models/product.model";

/**
 * calculate the total price
 * @param products 
 * @returns 
 */
export const calculateTotal = (products: Product[]) => {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
};
