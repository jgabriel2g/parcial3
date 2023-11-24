import { Router } from "express";

import { getProducts, createProduct, getProductById, deleteProductById, updateProduct } from "../controllers/products.js";

const router = Router()

router.get('/products', getProducts)
router.post('/products', createProduct)
router.get('/products/:id', getProductById)
router.delete('/products/:id', deleteProductById)
router.patch('/products/:id', updateProduct)

export default router;
