import { NextFunction, Request, Response } from "express";
import OperationResult from "../utils/operationResult";
import { ErrorMessages } from "../generic/resources/error.messages";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { Order } from "../models/order.model";
import { SuccessMessage } from "../generic/resources/success.messages";
import { OrderStatus } from "../generic/enum";
import { calculateTotal } from "../utils/helpers/functions";
import { OrderService } from "../services/order.service";
import { ProductService } from "../services/product.service";

class OrderController {
  /**
   * create order
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static createOrder(request: Request, res: Response, next: NextFunction) {
    try {
      const { products, customer_details } = request.body;

      const orderItems = ProductService.processOrderItems(products);

      let payload = {
        customer_details,
        products: orderItems,
        id: uuidv4(),
        status: OrderStatus.PENDING,
        created_at: moment().unix(),
        total: calculateTotal(products),
      } as Order;

      const addedOrder = OrderService.createOrder(payload);
      return res
        .status(201)
        .json(OperationResult.success(addedOrder, SuccessMessage.ORDER_ADDED));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * get order by id
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static getOrderById(request: Request, res: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const order = OrderService.getOrderbyId(id);
      if (!order)
        return res
          .status(404)
          .json(
            OperationResult.failed(404, ErrorMessages.ORDER_DOES_NOT_EXIST)
          );

      return res.status(200).json(OperationResult.success(order));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * cancel order
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static cancelOrder(request: Request, res: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const order = OrderService.getOrderbyId(id);
      if (!order)
        return res
          .status(404)
          .json(
            OperationResult.failed(404, ErrorMessages.ORDER_DOES_NOT_EXIST)
          );

      OrderService.cancelOrder(id);
      return res
        .status(200)
        .json(OperationResult.success(id, SuccessMessage.ORDER_CANCELLED));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * get order list
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static getOrders(request: Request, res: Response, next: NextFunction) {
    try {
      const orders = OrderService.getAllOrders();
      return res.status(200).json(OperationResult.success(orders));
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * process next order
   * @param request
   * @param res
   * @param next
   * @returns
   */
  static processNextOrder(request: Request, res: Response, next: NextFunction) {
    try {
      const orders = OrderService.getOrdersQueue();
      if (orders.length === 0)
        return res
          .status(404)
          .json(OperationResult.failed(404, ErrorMessages.QUEUE_EMPTY));
      const nextOrder = OrderService.processNextOrder();
      return res
        .status(200)
        .json(
          OperationResult.success(nextOrder, SuccessMessage.ORDER_PROCESSED)
        );
    } catch (error) {
      return res
        .status(500)
        .json(OperationResult.failed(500, ErrorMessages.INTERNAL_SERVER_ERROR));
    }
  }
}

export default OrderController;
