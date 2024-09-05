import { OrderStatus } from "../generic/enum";
import { Order } from "../models/order.model";

export class OrderService {
  /**
   * in memory order array
   */
  static orders: Order[] = [];

  /**
   * in memory order queue
   */
  static orders_queue: Order[] = [];

  /**
   * place a new order
   * @param order
   * @returns
   */
  static createOrder(order: Order): Order {
    this.orders.push(order);
    this.orders_queue.push(order);
    return order;
  }

  /**
   * get all orders
   * @returns
   */
  static getAllOrders(): Order[] {
    return this.orders;
  }

  /**
   * get order details by id
   * @param id
   * @returns
   */
  static getOrderbyId(id: string): Order {
    return this.orders.find((x) => x.id === id);
  }

  /**
   * cancel order by id
   * @param id
   * @returns
   */
  static cancelOrder(id: string): Order[] {
    const updatedData = {
      status: OrderStatus.CANCELLED,
    };
    this.orders = this.orders.map((order) =>
      order.id === id ? { ...order, ...updatedData } : order
    );
    this.orders_queue = this.orders_queue.filter(x => x.id !== id);
    return this.orders;
  }

  /**
   * process next order
   * @returns
   */
  static processNextOrder(): Order {
    const nextOrder = this.orders_queue.shift();
    nextOrder.status = OrderStatus.PROCESSED;
    return nextOrder;
  }

  /**
   * get all orders in the order queue
   * @returns
   */
  static getOrdersQueue(): Order[] {
    return this.orders_queue;
  }
}
