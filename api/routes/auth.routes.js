import express from 'express';
import { signup, signin, signout, checkAuthStatus } from '../controllers/auth.controller.js';


const router = express.Router();

// Register route
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/check-auth', checkAuthStatus);

export default router;