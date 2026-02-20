"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const exercice_route_1 = __importDefault(require("./routes/exercice.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Mes routes
app.use("/users", user_route_1.default);
app.use("/games", exercice_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use((err, req, res, next) => {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
});
exports.default = app;
