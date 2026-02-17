const express = require('express');
const router = express.Router();

const {
  register,
  login,
  resendVerification,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
