import express from 'express';
import { signup, signin, signout, checkAuthStatus, changePassword } from '../controllers/auth.controller.js';


const router = express.Router();

// Register route
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/check-auth', checkAuthStatus);
router.post('/change-password', changePassword);
export default router;