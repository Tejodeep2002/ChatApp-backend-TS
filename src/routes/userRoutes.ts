import { Router } from "express";
import {
  forgetPassword,
  loginUser,
  registerUser,
  resetLink,
  searchUser,
  userInfo,
} from "../controllers/userController";
import { authentication } from "../middleware/authMiddleware";

const router = Router();

router.route("/").post(registerUser).get(authentication, searchUser);
router.route("/login").post(loginUser);
router.route("/userInfo").get(authentication, userInfo);
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetLink").put(resetLink);

export default router;
