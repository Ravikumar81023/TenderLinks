import { Router } from "express";
import { ContactController } from "../controllers/contactController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", ContactController.getAllContacts);
router.get("/:id", ContactController.getContact);
router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  ContactController.createContact,
);
router.put(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  ContactController.updateContact,
);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  ContactController.deleteContact,
);
router.post("/complaint", ContactController.submitComplaint);

export default router;
