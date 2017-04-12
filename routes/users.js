const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users_contoller');
const { verifyToken } = require('../authentication/verifyToken');

router.get('/api', UserController.testResponse);
router.post('/api/users', UserController.create);
router.post('/api/user/login', UserController.login);
router.put('/api/user/update', verifyToken, UserController.update);

module.exports = router;