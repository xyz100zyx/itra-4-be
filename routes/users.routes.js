import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import UserController from "../controllers/UserController.js";
import AuthService from "../services/AuthService.js";

const router = Router();

router.post('/auth/register', AuthController.registration)
router.post('/auth/login', AuthController.login);
router.get('/getUsers', AuthService.checkAuth, UserController.getUsers);
router.patch('/blockUsers', AuthService.checkAuth, UserController.blockUsers);
router.patch('/unblockUsers', AuthService.checkAuth, UserController.unblockUsers);
router.delete('/deleteUsers', AuthService.checkAuth, UserController.deleteUsers);


export default router;