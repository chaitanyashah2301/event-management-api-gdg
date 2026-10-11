import { Router } from "express";
import { overview } from "../controllers/analytics.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/overview", authenticate, requireAdmin, overview);

export default router;