import {Router} from "express";
import {pool} from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router()

router.get('/ping', async (req, res) => {
    const [result] = await pool.query('SELECT 1 + 1 AS result')
    res.json(result)
})

router.post('/api/register', async (req, res) => {
    try {
        const { username, password, rol } = req.body;

        if (!username || !password) {
            res.status(400).send("username and password is required");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 4);
        const query = 'INSERT INTO users (username, password, rol) VALUES (?, ?, ?)';

        await pool.query(query, [username, hashedPassword, rol]);
        res.send({
            message: "Usuario registrado existosamente"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something goes wrong, " + error
        })
    }
});

router.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [result] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (result.length === 0) {
            res.status(401).send({ message: 'Credenciales incorrectas' });
        } else {
            const match = bcrypt.compare(password, result[0].password);

            if (match) {
                const accessToken = jwt.sign({ username }, 'secretkey', { expiresIn: '2h' });
                const refreshToken = jwt.sign({ username }, 'secretKey', { expiresIn: '7d' });

                res.cookie('token', accessToken, { httpOnly: true });
                res.cookie('refreshToken', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

                res.status(200).send({
                    message: 'Inicio de sesión exitoso',
                    accessToken,
                    refreshToken,
                    data: {
                        role: result[0].rol,
                        name: result[0].username,
                    },
                });
            } else {
                res.status(401).send({ message: 'Credenciales incorrectas' });
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Something goes wrong" + error
        })
    }
});

router.post('/api/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: 'No se proporcionó un token de actualización' });
    }

    jwt.verify(refreshToken, 'refreshkey', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token de actualización inválido' });
        }

        const accessToken = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });
        res.status(200).json({ accessToken });
    });
});

export default router