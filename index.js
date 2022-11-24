import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import usersRoutes from './routes/users.routes.js';

const config = dotenv.config().parsed;
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json({strict: false}))

app.use('/', usersRoutes);

app.listen(config.PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Server is ran');
    }
})