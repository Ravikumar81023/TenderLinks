import { Router } from "express";
import { LocationController } from "../controllers/locationController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();
const locationController = new LocationController();

router.post(
  "/",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROJECT_ADMIN]),
  locationController.createLocation,
);

router.get(
  "/",
  authenticate,
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PROJECT_ADMIN,
    UserRole.CUSTOMER,
  ]),
  locationController.getLocations,
);

router.get(
  "/:id",
  authenticate,
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PROJECT_ADMIN,
    UserRole.CUSTOMER,
  ]),
  locationController.getLocationById,
);

router.put(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.PROJECT_ADMIN, UserRole.ADMIN]),
  locationController.updateLocation,
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  locationController.deleteLocation,
);

export default router;
 