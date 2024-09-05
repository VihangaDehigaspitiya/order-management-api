import { Response, Request, NextFunction } from "express";
import Joi from "joi";
import OperationResult from "../utils/operationResult";
import { Product } from "../models/product.model";
import { ProductService } from "../services/product.service";
import { ErrorMessages } from "../generic/resources/error.messages";

type KeyValidateType = "body" | "query" | "params";

class ValidateSchema {
  /**
   * validate request payload using joi schemas
   * @param schema
   * @param keyValidate
   * @returns
   */
  static prepare(
    schema: Joi.ObjectSchema<any>,
    keyValidate: KeyValidateType = "body"
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error } = schema.validate(req.body);
        if (error)
          return res
            .status(422)
            .jsonp(OperationResult.failed(422, error.message));
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * validate order items
   * @returns
   */
  static validateOrderItems() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { products } = req.body;
        const errors: string[] = [];

        products.forEach((item: Product) => {
          const product = ProductService.getProductById(item.id);
          if (!product) {
            errors.push(
              ErrorMessages.PRODUCT_DOES_NOT_EXIST.replace("{name}", product.name)
            );
          } else if (item.quantity > product.quantity) {
            errors.push(
              ErrorMessages.INSUFFICIENT_QUANTITY.replace("{name}", product.name)
            );
          }
        });

        if (errors.length > 0) {
          return res
            .status(404)
            .jsonp(OperationResult.failed(404, errors.toString()));
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

export default ValidateSchema;
