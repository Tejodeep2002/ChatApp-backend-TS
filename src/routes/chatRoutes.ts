import { Router } from "express";
import { authentication } from "../middleware/authMiddleware";
import {
  accessChat,
  createGroup,
  fetchChats,
  groupAddUser,
  groupRemoveUser,
  groupUpdate,
} from "../controllers/chatController";

const router = Router();

router
  .route("/")
  .post(authentication, accessChat)
  .get(authentication, fetchChats);
router.route("/group").post(authentication, createGroup);
router.route("/groupUpdate").put(authentication, groupUpdate);
router.route("/groupAddUser").put(authentication, groupAddUser);
router.route("/groupRemoveUser").put(authentication, groupRemoveUser);

export default router;
