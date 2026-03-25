import { Router } from "express";
import { AboutController } from "../controllers/aboutController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", AboutController.getAboutInfo);
router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  AboutController.createAboutInfo,
);
router.put(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  AboutController.updateAboutInfo,
);
router.put(
  "/tender-stats",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  AboutController.updateTenderStats,
);

export default router;
