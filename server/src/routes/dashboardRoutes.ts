import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();
const dashboardController = new DashboardController();

router.get(
  "/overview",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  dashboardController.getOverviewStats,
);

router.get(
  "/users",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  dashboardController.getUserStats,
);

router.get(
  "/tenders",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  dashboardController.getTenderStats,
);

router.get(
  "/analytics",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  dashboardController.getAnalyticsStats,
);

router.get(
  "/documents",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  dashboardController.getDocumentStats,
);

router.get(
  "/blogs",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  dashboardController.getBlogStats,
);

router.get(
  "/services",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  dashboardController.getServiceStats,
);

export default router;
