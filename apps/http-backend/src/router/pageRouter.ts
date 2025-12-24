import { Router } from "express";
import { signUp } from "./../controller/auth";
import middleware from "./../middleware/middleware.js";
import room from "./../controller/room.js";
const router = Router();
router.post("/signup", signUp);
router.get("/room", middleware, room);
export default router;
