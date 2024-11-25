const express = require('express');
const { signup } = require('../controllers/auth.controller.js');


const router = express.Router();

// Register route
router.post('/signup', signup);



export default router;