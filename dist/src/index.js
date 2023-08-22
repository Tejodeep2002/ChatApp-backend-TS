"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json()); //to accept JSON data
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use("/api/user", userRoutes_1.default);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);
app.get("/", (req, res) => {
    res.send("Hello world");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Run on PORT ${PORT}`);
});
