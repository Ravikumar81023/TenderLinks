import { Router } from "express";
import { SliderController } from "../controllers/sliderController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../utils/multer";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  upload.single("image"),
  SliderController.addImage,
);
router.get("/", SliderController.getImages);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  SliderController.deleteImage,
);

export default router;
