import { Router } from "express"
import { loginUser } from "../controllers/auth/index.js";


const authRouter = Router();

authRouter.post("/login", loginUser)

export default authRouter;