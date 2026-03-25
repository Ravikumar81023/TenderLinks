import { Router } from "express";
import { BlogController } from "../controllers/blogController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../utils/multer";

const router = Router();

// Create post
router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  upload.single("media"),
  BlogController.createPost,
);

// Get all posts
router.get("/", BlogController.getPosts);

// Get single post
router.get("/:id", BlogController.getPostById);

// Update post
router.put(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  upload.single("media"),
  BlogController.updatePost,
);

// Delete post
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  BlogController.deletePost,
);

// Update post status
router.patch(
  "/:id/status",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  BlogController.updateStatus,
);

export default router;
