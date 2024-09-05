import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { orderApisRoutes } from "../src/routes/order.routes";
import { ProductService } from "./services/product.service";


const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Order Management API",
      version: "1.0.0",
      description: "Order Management Description",
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
  },
  apis: [path.resolve(__dirname, "./routes/*.ts")], // Path to your API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Load products
ProductService.loadProducts()

app.use(cors());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/order", orderApisRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
