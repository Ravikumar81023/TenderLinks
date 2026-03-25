import { Router } from "express";
import { AuthController } from "../controllers/authController";
const router = Router();
const authController = new AuthController();

router.post("/admin/login", authController.loginAdmin);
router.post("/customer/login", authController.loginCustomer);
router.post("/admin/logout", authController.logoutAdmin);
router.post("/customer/logout", authController.logoutCustomer);
export default router;
