import { Router } from "express";
import { ServiceController } from "../controllers/serviceController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../utils/multer";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  upload.single("media"),
  ServiceController.createService,
);
router.get("/", ServiceController.getServices);
router.get("/:id", ServiceController.getServiceById);
router.put(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  upload.single("media"),
  ServiceController.updateService,
);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  ServiceController.deleteService,
);

export default router;
