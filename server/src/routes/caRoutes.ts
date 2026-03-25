import { Router } from "express";
import { CAController } from "../controllers/caController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  CAController.createCA,
);
router.get("/", CAController.getCAs);
router.get("/:id", CAController.getCAById);
router.put(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  CAController.updateCA,
);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]),
  CAController.deleteCA,
);

export default router;
