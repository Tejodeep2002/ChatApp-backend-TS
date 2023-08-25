"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const chatController_1 = require("../controllers/chatController");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(authMiddleware_1.authentication, chatController_1.accessChat)
    .get(authMiddleware_1.authentication, chatController_1.fetchChats);
router.route("/group").post(authMiddleware_1.authentication, chatController_1.createGroup);
router.route("/groupUpdate").put(authMiddleware_1.authentication, chatController_1.groupUpdate);
router.route("/groupAddUser").put(authMiddleware_1.authentication, chatController_1.groupAddUser);
router.route("/groupRemoveUser").put(authMiddleware_1.authentication, chatController_1.groupRemoveUser);
exports.default = router;
