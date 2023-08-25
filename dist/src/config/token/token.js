"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.resetJwtToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET;
const generateJwtToken = (id) => {
    if (secretKey !== undefined) {
        const token = jsonwebtoken_1.default.sign({ id }, secretKey, { expiresIn: "30d" });
        return token;
    }
};
exports.generateJwtToken = generateJwtToken;
const resetJwtToken = (id) => {
    if (secretKey !== undefined) {
        const token = jsonwebtoken_1.default.sign({ id }, secretKey, { expiresIn: 60 * 60 });
        return token;
    }
};
exports.resetJwtToken = resetJwtToken;
const verifyJwtToken = (token) => {
    if (secretKey !== undefined) {
        try {
            const data = jsonwebtoken_1.default.verify(token, secretKey);
            return data;
        }
        catch (error) {
            return error;
        }
    }
};
exports.verifyJwtToken = verifyJwtToken;
