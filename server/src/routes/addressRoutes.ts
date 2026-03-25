import { Router } from "express";
import { AddressController } from "../controllers/addressController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", AddressController.getAllAddresses);
router.get("/:id", AddressController.getAddress);
router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  AddressController.createAddress,
);
router.put(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  AddressController.updateAddress,
);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  AddressController.deleteAddress,
);

export default router;
