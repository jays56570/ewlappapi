const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// // Auth Routes
// router.post('/send-otp', AuthController.sendOtp);
// router.post('/verify-otp', AuthController.verifyOtp);
// router.post('/register', AuthController.register);
// router.post('/login', AuthController.login);

router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtpAndLogin);
router.get('/getotp', AuthController.getLatestOtp);


module.exports = router;

