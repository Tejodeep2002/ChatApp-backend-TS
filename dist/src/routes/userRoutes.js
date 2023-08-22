"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.route("/").post(userController_1.registerUser).get(authMiddleware_1.authentication);
router.route("/Login").post(userController_1.loginUser);
// router.route("/userInfo").get(userInfo)
// router.route("/forgetPassword").post(forgetPassword)
// router.route("/resetLink").post(resetLink)
exports.default = router;
