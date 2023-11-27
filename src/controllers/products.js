import { pool } from "../db.js";

export const createProduct = async (req, res) => {
    try {
        const {name, description, price, stock} = req.body
        if (!name) {
            res.status(400).send("Name is required");
            return;
        }

        if (!price && price !== 0) {
            res.status(400).send("Price is required");
            return;
        }
        if (!stock && stock !== 0) {
            res.status(400).send("stock is required");
            return;
        }
        const query = "insert into products (name, description, price, stock) values (?,?,?,?)"
        const [rows] = await pool.query(query, [name, description, price, stock])
        res.send({
            id: rows.insertId,
            name: name,
            description: description,
            price: price,
            stock: stock
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong, "+ error
        })
    }
}

export const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('select * from products;')
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const {id} = req.params
        const [rows] = await pool.query('select * from products where id = ?;', [id])

        if (rows.length <= 0) return res.status(404).json({
            message: "Product not found"
        })
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}

export const deleteProductById = async (req, res) => {
    try{
        const {id} = req.params
        const [result] = await pool.query('delete from products where id = ?', [id])

        if (result.affectedRows <= 0) return res.status(404).json({
            message: "Product not found"
        })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong" + error
        })
    }
}

export const updateProduct = async (req, res) => {
    try{
        const {id} = req.params
        const {name, description, price, stock} = req.body
        const query = "update products set name = ifnull(?, name), description = ifnull(?, description), price = ifnull(?, price), stock = ifnull(?, stock) where id = ?;"

        const [result] = await pool.query(query, [name, description, price, stock, id])

        if (result.affectedRows === 0) return res.status(404).json({
            message: "Product not found"
        })

        const [rows] = await pool.query('select * from products where id = ?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}
