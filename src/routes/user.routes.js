import { Router } from "express"
import { createUser, deleteUser, getAllUser, getUser, modifyUser } from "../controllers/user/index.js"
import auth from "./auth.js"

const userRouter = Router()


userRouter.post("/create", createUser)
userRouter.delete("/delete/:idUser", auth, deleteUser)
userRouter.get("/getAll", auth, getAllUser)
userRouter.post("/get", auth, getUser)
userRouter.post("/modify/:idUser", auth, modifyUser)

export default userRouter;

