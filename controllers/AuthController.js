import pool from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
const config = dotenv.config().parsed;
import getDate from "../utils/getDate.js";
import getTime from "../utils/getTime.js";

class AuthController{
    async registration(req, res){
        try{
            const {firstName, secondName, email, password} = req.body;
            const date = new Date();

            const foundedUser = await pool.query(
                `SELECT * FROM users
                WHERE email=($1)`,
                [email]
            ).then(data=>data.rows[0]);

            if(foundedUser){
                res.status(400).json({
                    message: 'Пользователь с таким Email уже зарегистрирован',
                })
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const user = await pool.query(
                `INSERT INTO users (first_name, second_name, email, password_hash, register_date, login_date, register_time, login_time, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [firstName, secondName, email, passwordHash, getDate(), getDate(), getTime(), getTime(), 1]
            ).then(data => data.rows[0]);
        
            if(!user){
                res.status(500).json({
                    message: 'Не удалось зарегистрироваться',
                })
                return;
            }

            const token = await jwt.sign({
                id: user.id,   
            }, config.JWT_SECRET_KEY, {
                expiresIn: config.JWT_TOKEN_EXPIRES,
            });

            const {password_hash, ...userData} = user;

            res.json({
                ...userData,
                token,
            })
            

        }catch(err){
            console.log('Error', err);
            res.status(500).json({
                message: 'Не удалось зарегистрироваться',
            })
        }
    }

    async login(req, res){
        try{
            const {email, password} = req.body;

            const foundedUser = await pool.query(
                `SELECT * FROM users
                WHERE email=($1)`,
                [email]
            ).then(data=>data.rows[0]);

            if(!foundedUser){
                res.status(404).json({
                    message: 'Неверный логин или пароль',
                })
                return;
            }

            if(!foundedUser.status){
                res.status(403).json({
                    message: 'Вы заблокированы',
                })
                return;
            }

            const isValidPassword = await bcrypt.compare(password, foundedUser.password_hash);
            if(!isValidPassword){
                res.status(404).json({
                    message: 'Неверный логин или пароль',
                })
                return;
            }

            const user = await pool.query(
                `UPDATE users
                SET login_date=($1),
                login_time=($2)
                WHERE id=($3) RETURNING *`,
                [getDate(), getTime(), foundedUser.id]
            ).then(data => data.rows[0]);

            const token = await jwt.sign({
                id: user.id,
            }, config.JWT_SECRET_KEY, {expiresIn: config.JWT_TOKEN_EXPIRES});

            const {password_hash, ...userData} = user;

            res.json({
                ...userData,
                token,
            })

        }catch(err){
            console.log('Error', err);
            res.status(500).json({
                message: 'Не удалось войти в систему',
            })
        }
    }
}

export default new AuthController();