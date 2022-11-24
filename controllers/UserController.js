import pool from "../db.js";
import * as dotenv from 'dotenv';

class UserController{

    async getUsers(req, res){
        try{
            const userId = req.userId;

            const users = await pool.query(
                `SELECT * FROM users`,
                []
            ).then(data=>data.rows);

            res.json({
                ...users
            })

        }catch(err){
            console.log(err);
            res.status(500).json({
                message: 'Не удалось выполнить запрос',
            })
        }
    }

    async blockUsers(req, res){
        try{
            const userId = req.userId;
            const {usersId} = req.body;

            usersId.map(async (id) => {
                await pool.query(
                    `UPDATE users
                    SET status=0
                    WHERE id=($1)`,
                    [id]
                )
            })

            if(usersId.includes(userId)){
                res.json({
                    message: 'Вы заблокированы',
                })
                return;
            }

            const users = await pool.query(
                `SELECT * FROM users`,
                []
            ).then(data => data.rows);

            res.json({
                ...users,
            });

        }catch(err){
            console.log(err);
            res.status(500).json({
                message: 'Не удалось заблокировать пользователей / пользователя',
            })
        }
    }

    async unblockUsers(req, res){
        try{
            const userId = req.userId;
            const {usersId} = req.body;

            usersId.map(async (id) => {
                await pool.query(
                    `UPDATE users
                    SET status=1
                    WHERE id=($1)`,
                    [id]
                )
            })

            if(usersId.includes(userId)){
                res.json({
                    message: 'Вы разблокированы',
                })
                return;
            }

            const users = await pool.query(
                `SELECT * FROM users`,
                []
            ).then(data => data.rows);

            res.json({
                ...users,
            });

        }catch(err){
            console.log(err);
            res.status(500).json({
                message: 'Не удалось заблокировать пользователей / пользователя',
            })
        }
    }

    async deleteUsers(req, res){
        try{
            const {usersId} = req.body; 
            const userId = req.userId;
            
            usersId.map(async (id) => {
                await pool.query(
                    `DELETE FROM users
                    WHERE id=($1)`,
                    [id]
                )
            });
            if(usersId.includes(userId)){
                res.json('Вы удалены из базы данных');
                return;
            }
            
            const users = await pool.query(
                `SELECT * FROM users`,
                []
            ).then(data => data.rows);

            res.json({
                ...users,
            })

        }catch(err){
            console.log(err);
            res.status(500).json({
                message: 'Не удалось удалить пользователей / пользователя',
            })
        }
    }

}

export default new UserController();