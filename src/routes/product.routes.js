import { Router } from "express"
import auth from "./auth.js"
import { createProduct, deleteProduct, getProduct, getAllProduct, modifyProduct } from "../controllers/product/index.js"


const productRouter = Router()


productRouter.post("/create", auth, createProduct)
productRouter.delete("/delete/:idProduct", auth, deleteProduct)
productRouter.get("/getAll", auth, getAllProduct)
productRouter.post("/get", auth, getProduct)
productRouter.post("/modify/:idProduct", auth, modifyProduct)

export default productRouter;

