import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const validateHeaders = (req, res) => {
    const headers = req.headers
    if (!headers["authorization"]) {
        res.status(401).send({ message: 'Acceso no autorizado' });
    } else {
        const token = headers["authorization"].split(" ")[1]
        jwt.verify(token, 'secretkey', (err, decoded) => {
            if (err) {
                res.status(401).send({ message: 'Token inválido' });
            } else {
                if (decoded["rol"] !== "ADVISER"){
                    res.status(401).send({ message: 'Acceso no autorizado' });
                }
            }
        });
    }
}

export const createSale = async (req, res) => {
    try {
        validateHeaders(req, res)
        const {product_id, client_name, client_phone, amount, price} = req.body
        if (!product_id && product_id !== 0) {
            res.status(400).send("product_id is required");
            return;
        }
        if (!client_name) {
            res.status(400).send("client_name is required");
            return;
        }
        if (!client_phone) {
            res.status(400).send("client_phone is required");
            return;
        }
        if (!amount && amount !== 0) {
            res.status(400).send("amount is required");
            return;
        }
        if (!price && price !== 0) {
            res.status(400).send("price is required");
            return;
        }

        let [rows] = await pool.query("select * from products where id = ?", [product_id])
        if (rows.length <= 0) return res.status(404).json({
            message: "Product not found"
        })
        if (rows[0].amount < amount) {
            return res.status(400).json({
                message: "the quantity of the product to be sold is greater than the current quantity"
            })
        }

        let total = price * amount
        const query = "insert into sales (product_id, client_name, client_phone, amount, price) values (?,?,?,?,?)";

        [rows] = await pool.query(query, [product_id, client_name, client_phone, amount, total])

        res.send({
            id: rows.insertId,
            product_id: product_id,
            client_name: client_name,
            client_phone: client_phone,
            amount: amount,
            price: price
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}

export const getSales = async (req, res) => {
    try {
        validateHeaders(req, res)
        const [rows] = await pool.query('select * from sales;')
        res.json(rows)
    }catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}

export const getSalesById = async (req, res) => {
    try {
        validateHeaders(req, res)
        const {id} = req.params
        const [rows] = await pool.query('select * from sales where id = ?;', [id])
        if (rows.length <= 0) return res.status(404).json({
            message: "Sales not found"
        })
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}

export const deleteSaleById = async (req, res) => {
    try{
        validateHeaders(req, res)
        const {id} = req.params
        const [result] = await pool.query('delete from sales where id = ?', [id])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: "Sales not found"
        })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}

export const updateSale = async (req, res) => {
    try {
        validateHeaders(req, res)
        const {id} = req.params
        const {product_id, client_name, client_phone, amount, price} = req.body
        const query = "update sales set product_id = ifnull(?, product_id), client_name = ifnull(?, client_name), client_phone = ifnull(?, client_phone), amount = ifnull(?, amount), price = ifnull(?, price) where id = ?"
        const [result] = await pool.query(query, [product_id, client_name, client_phone, amount, price, id])
        if (result.affectedRows === 0) return res.status(404).json({
            message: "Sales not found"
        })

        const [rows] = await pool.query('select * from sales where id = ?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong"
        })
    }
}