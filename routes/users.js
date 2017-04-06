const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users_contoller');

router.get('/api', UserController.testResponse);

module.exports = router;