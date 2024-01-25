import { Router } from "express"
import auth from "./auth.js"
import { createQuote, deleteQuote, getAllQuote, getQuote, modifyQuote } from "../controllers/quote/index.js";


const quoteRouter = Router()


quoteRouter.post("/create", auth, createQuote)
quoteRouter.delete("/delete/:idQuote", auth, deleteQuote)
quoteRouter.get("/getAll", auth, getAllQuote)
quoteRouter.post("/get", auth, getQuote)
quoteRouter.post("/modify/:idQuote", auth, modifyQuote)
// productRouter.post("/get", auth, getProduct)
// 

export default quoteRouter;

