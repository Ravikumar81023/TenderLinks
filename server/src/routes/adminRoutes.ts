import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();
const adminController = new AdminController();

// Allow SUPER_ADMIN and ADMIN to create new admins
router.post(
  "/",
  authenticate,
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_ADMIN,
    UserRole.PROJECT_ADMIN,
  ]),
  adminController.createAdmin.bind(adminController),
);

// Allow all admin roles to view admins (permissions are handled in service layer)
router.get(
  "/",
  authenticate,
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_ADMIN,
    UserRole.PROJECT_ADMIN,
  ]),
  adminController.getAdmins.bind(adminController),
);

router.get(
  "/:id",
  authenticate,
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CONTENT_ADMIN,
    UserRole.PROJECT_ADMIN,
  ]),
  adminController.getAdminById.bind(adminController),
);

router.put(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  adminController.updateAdmin.bind(adminController),
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  adminController.deleteAdmin.bind(adminController),
);

export default router;
