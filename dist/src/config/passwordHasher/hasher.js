"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordCompare = exports.passwordHasher = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const salt = 10;
const passwordHasher = async (password) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.passwordHasher = passwordHasher;
const passwordCompare = async (enteredPassword, hashedPassword) => {
    return await bcrypt_1.default.compare(enteredPassword, hashedPassword);
};
exports.passwordCompare = passwordCompare;
