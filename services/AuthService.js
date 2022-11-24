import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
const config = dotenv.config().parsed;

class AuthService{
    static async checkAuth(req, res, next){
        try{
            const token = (req.headers.authorization || '').split(' ')[1];
            if(!token){
                res.status(401).json({
                    message: 'Вы не авторизованы',
                })
            }
            req.userId = await jwt.verify(token, config.JWT_SECRET_KEY).id;
            next()
        }catch(err){
            console.log(err);
            res.status(401).json({
                message: 'Вы не авторизованы',
            })
        }
    }
}

export default AuthService;