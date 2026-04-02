"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiMiddleware = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUiMiddleware = swagger_ui_express_1.default;
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
        },
    },
    apis: ["./routes/*.ts"],
});
