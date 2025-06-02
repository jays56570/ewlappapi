const { getConnection } = require('../config/database');



const AuthModel = {
  // 🔹 Save OTP
  saveOtp: async (mobile, otp, expires_at) => {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO user_otp_verification (mobile, otp, expires_at, is_verified) 
       VALUES (?, ?, ?, 0)`,
      [mobile, otp, expires_at]
    );
  },

  // 🔹 Verify OTP
  verifyOtp: async (mobile, otp) => {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM user_otp_verification 
       WHERE mobile = ? AND otp = ? AND is_verified = 0 AND expires_at > NOW() 
       ORDER BY id DESC LIMIT 1`,
      [mobile, otp]
    );
    return rows[0];
  },

  // 🔹 Mark OTP as Verified
  markOtpVerified: async (mobile) => {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE user_otp_verification 
       SET is_verified = 1 
       WHERE mobile = ?`,
      [mobile]
    );
  },

  // 🔹 Check if OTP is verified
  checkOtpVerified: async (mobile) => {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM user_otp_verification 
       WHERE mobile = ? AND is_verified = 1 
       ORDER BY id DESC LIMIT 1`,
      [mobile]
    );
    return !!rows.length;
  },

  // 🔹 Get user by mobile number
  getUserByMobile: async (mobile) => {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM users WHERE mobile = ?`,
      [mobile]
    );
    return rows[0];
  },

  // 🔹 Create new user with mobile only
  createUser: async ({ mobile }) => {
    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO users (mobile, is_verified) VALUES (?, ?)`,
      [mobile, true]
    );

    return {
      user_id: result.insertId,
      mobile
    };
  },

  // 🔹 Get latest unverified, unexpired OTP by mobile
getLatestOtp: async (mobile) => {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    `SELECT otp FROM user_otp_verification 
     WHERE mobile = ? AND is_verified = 0 AND expires_at > NOW() 
     ORDER BY id DESC LIMIT 1`,
    [mobile]
  );
  return rows[0]; // May return undefined if not found
}

};

module.exports = AuthModel;


// const AuthModel = {
//     getUserByEmail: async (email) => {
//         const conn = await getConnection();
//         const [rows] = await conn.execute(
//             "SELECT * FROM users WHERE email = ?",
//             [email]
//         );
//         return rows[0];
//     },

//     createUser: async ({ name, email, password_hash }) => {
//         const conn = await getConnection();
//         const [result] = await conn.execute(
//             `INSERT INTO users (name, email, password_hash, is_verified) 
//        VALUES (?, ?, ?, ?)`,
//             [name, email, password_hash, true]
//         );
//         return result;
//     },

//     saveOtp: async (email, otp, expires_at) => {
//         const conn = await getConnection();
//         await conn.execute(
//             `INSERT INTO user_otp_verification (email, otp, expires_at, is_verified) 
//        VALUES (?, ?, ?, 0)`,
//             [email, otp, expires_at]
//         );
//     },

//     verifyOtp: async (email, otp) => {
//         const conn = await getConnection();
//         const [rows] = await conn.execute(
//             `SELECT * FROM user_otp_verification 
//        WHERE email = ? AND otp = ? AND is_verified = 0 AND expires_at > NOW() 
//        ORDER BY id DESC LIMIT 1`,
//             [email, otp]
//         );
//         return rows[0];
//     },

//     markOtpVerified: async (email) => {
//         const conn = await getConnection();
//         await conn.execute(
//             `UPDATE user_otp_verification 
//        SET is_verified = 1 
//        WHERE email = ?`,
//             [email]
//         );
//     },

//     checkOtpVerified: async (email) => {
//         const conn = await getConnection();
//         const [rows] = await conn.execute(
//             `SELECT * FROM user_otp_verification 
//      WHERE email = ? AND is_verified = 1 
//      ORDER BY id DESC LIMIT 1`,
//             [email]
//         );
//         return !!rows.length;
//     }

// };

