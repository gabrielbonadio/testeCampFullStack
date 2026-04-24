"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const swagger_1 = require("./swagger");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
exports.app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
exports.app.use(routes_1.routes);
