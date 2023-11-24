import { pool } from "../db.js";

export const createProduct = async (req, res) => {
    try {
        const {name, description, price, amount} = req.body
        if (!name) {
            res.status(400).send("Name is required");
            return;
        }

        if (!price && price !== 0) {
            res.status(400).send("Price is required");
            return;
        }
        if (!amount && amount !== 0) {
            res.status(400).send("Amount is required");
            return;
        }
        const query = "insert into products (name, description, price, amount) values (?,?,?,?)"
        const [rows] = await pool.query(query, [name, description, price, amount])
        res.send({
            id: rows.insertId,
            name: name,
            description: description,
            price: price,
            amount: amount
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
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

        res.sendStatus(404)
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}

export const updateProduct = async (req, res) => {
    try{
        const {id} = req.params
        const {name, description, price, amount} = req.body
        const query = "update products set name = ifnull(?, name), description = ifnull(?, description), price = ifnull(?, price), amount = ifnull(?, amount) where id = ?;"

        const [result] = await pool.query(query, [name, description, price, amount, id])

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
