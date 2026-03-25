import { Router } from "express";
import { TenderController } from "../controllers/tenderController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../utils/multer";

const router = Router();
const tenderController = new TenderController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
  upload.array("documents", 5), // Allow up to 5 documents
  tenderController.createTender,
);

router.get(
  "/",
  authenticate,
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PROJECT_ADMIN,
  ]),
  tenderController.getTenders,
);

router.get(
  "/:id",
  authenticate,
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PROJECT_ADMIN,
  ]),
  tenderController.getTenderById,
);

router.put(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
  upload.array("documents", 5), // Allow up to 5 documents
  tenderController.updateTender,
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
  tenderController.deleteTender,
);

export default router;
