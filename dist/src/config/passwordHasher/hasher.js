"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordCompare = exports.passwordHasher = void 0;
const bcrypt = require("bcrypt");
const salt = 10;
const passwordHasher = (password) => {
    return bcrypt.hash(password, salt);
};
exports.passwordHasher = passwordHasher;
const passwordCompare = (enteredPassword, hashedPassword) => {
    return bcrypt.compare(enteredPassword, hashedPassword);
};
exports.passwordCompare = passwordCompare;
