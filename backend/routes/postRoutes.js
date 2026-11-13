import { Router } from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  createPost,
  getFeed,
  getMyPosts,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
const router = Router();
router.use(protect);
router.get("/", getFeed);
router.get("/mine", getMyPosts);
router.post("/", upload.single("image"), createPost);
router.delete("/:id", deletePost);
router.post("/:id/like", toggleLike);
export default router;
