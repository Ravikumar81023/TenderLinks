import { Router } from "express";
import { CustomerNoteController } from "../controllers/customerNoteController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  CustomerNoteController.getAllNotes,
);

router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  CustomerNoteController.createNote,
);
router.get(
  "/:userId",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  CustomerNoteController.getNotesByCustomer,
);
router.put(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  CustomerNoteController.updateNote,
);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  CustomerNoteController.deleteNote,
);

export default router;
