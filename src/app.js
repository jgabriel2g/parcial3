import express from 'express'

import {PORT} from "./config.js";
import indexRoutes from './routes/index.js'
import productRoutes from './routes/products.js'
import salesRoutes from './routes/sales.js'

const app = express();

app.listen(PORT)
app.use(express.json())

console.log(`Server running on port ${PORT}`)

app.use(indexRoutes)
app.use(productRoutes)
app.use(salesRoutes)
app.use((req, res, next) => {
    res.status(404).json({
        message: "endpoint not found"
    })
})
