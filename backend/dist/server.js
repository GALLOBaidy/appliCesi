"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const exercice_route_1 = __importDefault(require("./routes/exercice.route"));
const userGame_route_1 = __importDefault(require("./routes/userGame.route"));
const auth_controller_1 = require("./controllers/auth.controller");
const stats_route_1 = __importDefault(require("./routes/stats.route"));
const mentalHealthContent_routes_1 = __importDefault(require("./routes/mentalHealthContent.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/login", auth_controller_1.login);
// Mes routes
app.use("/users", user_route_1.default);
app.use("/games", exercice_route_1.default);
app.use("/user-exo", userGame_route_1.default);
app.use("/stats", stats_route_1.default);
app.use("/content", mentalHealthContent_routes_1.default);
app.use((err, req, res, next) => {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
