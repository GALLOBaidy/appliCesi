import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.ts"],
});

// Re-export propre (SonarQube OK)
export { swaggerUi as swaggerUiMiddleware };
