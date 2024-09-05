import { Router } from "express";
import orderSchema from "../schema/order.schema";
import ValidateSchema from "../middleware/validationSchema";
import OrderController from "../controllers/order.controller";

export const orderApisRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Operations related to the order
 * /order:
 *   post:
 *     summary: Add order
 *     description: Add new order
 *     tags:
 *       - Order
 *     parameters:
 *       - in: body
 *         name: order body
 *         description: Add order
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             customer_details:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile_no:
 *                   type: string
 *                 address:
 *                   type: string
 *             products:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   price:
 *                     type: number
 *         example:
 *           customer_details:
 *             name: john
 *             email: john@email.com
 *             mobile_no: 071000000000
 *             address: australia
 *           products:
 *             - id: 1
 *               price: 999.99
 *               quantity: 1
 *             - id: 2
 *               price: 499.99
 *               quantity: 2
 *     responses:
 *       201:
 *         description: An order object.
 */
orderApisRoutes.post(
  "/",
  ValidateSchema.prepare(orderSchema.addOrderSchema),
  ValidateSchema.validateOrderItems(),
  OrderController.createOrder
);

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Operations related to the order
 * /order/{id}:
 *   get:
 *     summary: Get order
 *     description: Get order by id
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the order.
 *     responses:
 *       200:
 *         description: An order.
 */
orderApisRoutes.get("/:id", OrderController.getOrderById);

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Operations related to the order
 * /order/{id}:
 *   delete:
 *     summary: Cancel order
 *     description: Cancel order by id
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the order.
 *     responses:
 *       200:
 *         description: An order.
 */
orderApisRoutes.delete("/:id", OrderController.cancelOrder);

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Operations related to the order
 * /order:
 *   get:
 *     summary: Get orders
 *     description: Get all orders
 *     tags:
 *       - Order
 *     responses:
 *       200:
 *         description: orders list.
 */
orderApisRoutes.get("/", OrderController.getOrders);

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Operations related to the order
 * /order/process-next-order:
 *   post:
 *     summary: Process next order
 *     description: Process next order
 *     tags:
 *       - Order
 *     responses:
 *       200:
 *         description: processed order details.
 */
orderApisRoutes.post("/process-next-order", OrderController.processNextOrder);
