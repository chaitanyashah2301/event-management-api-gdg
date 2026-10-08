import { Router } from "express";
import {  create,  getAll,  getOne,  update,  remove,} from "../controllers/event.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.post("/",authenticate,requireAdmin,create);
router.get("/",getAll);
router.get("/:id",getOne);
router.put("/:id",authenticate,requireAdmin,update);
router.delete("/:id",authenticate,requireAdmin,remove);

export default router;