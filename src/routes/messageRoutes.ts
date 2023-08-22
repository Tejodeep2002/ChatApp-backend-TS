import { Router } from "express";
import { authentication } from "../middleware/authMiddleware";
import { fetchMessage, sendNewMessage } from "../controllers/messageController";

const router = Router();

router
  .route("/")
  .post(authentication, sendNewMessage)
  .get(authentication, fetchMessage);

export default router;
