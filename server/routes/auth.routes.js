const express = require('express');
const router = express.Router();
const { register, login, logout, userregister, userlogin, userlogout } = require('../controller/auth.controller');

// admin routes
router.post('/admin/register', register);
router.post('/admin/login', login);
router.post('/admin/logout', logout);

// User routes
router.post('/user/register', userregister);
router.post('/user/login', userlogin);
router.post('/user/logout', userlogout);

module.exports = router;