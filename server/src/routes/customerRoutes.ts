import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../utils/multer";

const router = Router();
const customerController = new CustomerController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  upload.array("documents"),
  customerController.createCustomer,
);

router.get(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.getCustomers,
);

router.get(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.getCustomerById,
);

router.put(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  upload.array("documents"),
  customerController.updateCustomer,
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.deleteCustomer,
);

router.post(
  "/:id/notes",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.addCustomerNote,
);

router.patch(
  "/:id/subscription-tier",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.updateSubscriptionTier,
);

router.get(
  "/overview",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.getCustomerOverview,
);

router.put(
  "/:id/info",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.updateCustomerInfo,
);

router.delete(
  "/:id/terminate",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.terminateCustomerService,
);

router.post(
  "/analytics",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  customerController.recordAnalytics,
);

router.put(
  "/analytics/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CUSTOMER]),
  customerController.updateAnalytics,
);

router.get(
  "/:id/analytics",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.getCustomerAnalytics,
);

router.post(
  "/:id/documents",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  upload.single("document"),
  customerController.uploadDocument,
);

router.get(
  "/:id/documents",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  customerController.getDocuments,
);

export default router;
