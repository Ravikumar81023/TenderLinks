import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();
const analyticsController = new AnalyticsController();

router.get(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  analyticsController.getAnalytics,
);

router.post(
  "/login",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  analyticsController.recordLogin,
);

router.post(
  "/logout/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  analyticsController.recordLogout,
);

router.put(
  "/pageviews/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  analyticsController.updatePageViews,
);

router.put(
  "/timespent/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  analyticsController.updateTimeSpent,
);

export default router;
