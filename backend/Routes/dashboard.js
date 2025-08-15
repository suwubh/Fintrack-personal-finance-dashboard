
const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboard');
const auth = require('../Middlewares/authMiddleware'); // updated path

router.get('/', auth, getDashboardData);
module.exports = router;
