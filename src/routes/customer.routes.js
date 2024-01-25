import { Router } from "express"
import auth from "./auth.js"
import { createCustomer, deleteCustomer, getAllCustomer, getCustomer, modifyCustomer } from "../controllers/customer/index.js"

const customerRouter = Router()

customerRouter.post("/create", auth, createCustomer)
customerRouter.delete("/delete/:idCustomer", auth, deleteCustomer)
customerRouter.get("/getAll", auth, getAllCustomer)
customerRouter.post("/get", auth, getCustomer)
customerRouter.post("/modify/:idCustomer", auth, modifyCustomer)

export default customerRouter;

