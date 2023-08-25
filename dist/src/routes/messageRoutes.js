"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(authMiddleware_1.authentication, messageController_1.sendNewMessage)
    .get(authMiddleware_1.authentication, messageController_1.fetchMessage);
exports.default = router;
