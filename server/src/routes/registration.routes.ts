
import { Router } from "express";
import {
  register,
  unregister,
  getMine,
} from "../controllers/registration.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMine);

router.post("/events/:id", authenticate, register);

router.delete("/events/:id", authenticate, unregister);

export default router;
