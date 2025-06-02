const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/AuthModel');
const sendMail = require('../utils/SendMail');

const JWT_SECRET = process.env.JWT_SECRET;


// Dummy SMS sending function
const sendSms = async (mobile, message) => {
  console.log(`SMS sent to ${mobile}: ${message}`);
  // Twilio, Fast2SMS, etc.
};

// 🔹 Send OTP Function
const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires_at = new Date(Date.now() + 5 * 60000); // 5 minutes validity

    await AuthModel.saveOtp(mobile, otp, expires_at);
    await sendSms(mobile, `Your OTP is: ${otp}`);

    return res.json({ success: true, message: "OTP sent to mobile" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to send OTP", error: err.message });
  }
};

// 🔹 Verify OTP and Login Function
const verifyOtpAndLogin = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile and OTP are required" });
    }

    const isValid = await AuthModel.verifyOtp(mobile, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    let user = await AuthModel.getUserByMobile(mobile);

    // Auto-register if user doesn't exist
    if (!user) {
      user = await AuthModel.createUser({ mobile });
    }

    await AuthModel.markOtpVerified(mobile);

    const token = jwt.sign(
      { id: user.user_id, mobile: user.mobile },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        mobile: user.mobile
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "OTP verification failed", error: err.message });
  }
};

const getLatestOtp = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    const otpRow = await AuthModel.getLatestOtp(mobile);

    if (!otpRow) {
      return res.status(404).json({ success: false, message: "No active OTP found" });
    }

    return res.json({ success: true, otp: otpRow.otp });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching OTP", error: err.message });
  }
};







// // Send OTP
// const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if email already registered
//     const existing = await AuthModel.getUserByEmail(email);
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Email already registered" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const expires_at = new Date(Date.now() + 5 * 60000); // 5 minutes validity

//     await AuthModel.saveOtp(email, otp, expires_at);
//     await sendMail(email, "Your OTP", `<h3>Your OTP is: ${otp}</h3>`);

//     res.json({ success: true, message: "OTP sent to email" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error sending OTP", error: err.message });
//   }
// };

// // Verify OTP
// const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const data = await AuthModel.verifyOtp(email, otp);

//     if (!data) {
//       return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//     }

//     await AuthModel.markOtpVerified(email);
//     res.json({ success: true, message: "OTP verified" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Verification failed", error: err.message });
//   }
// };
 
// // Register
// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Already registered check
//     const existing = await AuthModel.getUserByEmail(email);
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Email already exists" });
//     }

//     // OTP verified check
//     const isOtpVerified = await AuthModel.checkOtpVerified(email);
//     if (!isOtpVerified) {
//       return res.status(400).json({ success: false, message: "OTP not verified" });
//     }

//     const hash = bcrypt.hashSync(password, 10);
//     await AuthModel.createUser({ name, email, password_hash: hash });

//     res.json({ success: true, message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Registration error", error: err.message });
//   }
// };

// // Login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await AuthModel.getUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const match = bcrypt.compareSync(password, user.password_hash);
//     if (!match) {
//       return res.status(401).json({ success: false, message: "Incorrect password" });
//     }

//     const token = jwt.sign(
//       { id: user.user_id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user.user_id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Login error", error: err.message });
//   }
// };

module.exports = {
  // sendOtp,
  // verifyOtp,
  // register,
  // login,
 sendOtp,
 verifyOtpAndLogin,
 getLatestOtp
};
