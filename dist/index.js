"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const PORT = 4321;
const app = (0, express_1.default)();
(0, dotenv_1.config)();
app.use(express_1.default.json(), express_1.default.urlencoded({ extended: true }), (0, cors_1.default)());
app.use("/ai", ai_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost: ${PORT}`);
});
