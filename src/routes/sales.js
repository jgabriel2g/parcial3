import { Router } from "express";

import { createSale, getSales, getSalesById, updateSale, deleteSaleById} from "../controllers/sales.js";

const router = Router()

router.get('/sales', getSales)
router.post('/sales', createSale)
router.get('/sales/:id', getSalesById)
router.delete('/sales/:id', deleteSaleById)
router.patch('/sales/:id', updateSale)

export default router;
