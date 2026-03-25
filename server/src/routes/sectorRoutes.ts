import { Router } from "express";
import { SectorController } from "../controllers/sectorController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();
const sectorController = new SectorController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
  sectorController.createSector,
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
  sectorController.getSectors,
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
  sectorController.getSectorById,
);

router.put(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
  sectorController.updateSector,
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
  sectorController.deleteSector,
);

export default router;
