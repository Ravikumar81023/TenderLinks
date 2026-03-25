import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { SocialMediaController } from "../controllers/socialMediaContoller";
import { UserRole } from "@prisma/client";

const router = Router();
const socialMediaController = new SocialMediaController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  socialMediaController.createSocialMedia
);

router.get(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  socialMediaController.getSocialMedia
);
router.get(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  socialMediaController.getSocialMediaById
);

router.put(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  socialMediaController.updateSocialMedia
);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  
  socialMediaController.deleteSocialMedia
);

export default router;
