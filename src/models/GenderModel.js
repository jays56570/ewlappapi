const { getConnection } = require('../config/database');

// CREATE
const createGender = async (gender_name) => {
  const pool = await getConnection();
  const [result] = await pool.execute(
    `INSERT INTO gender (gender_name) VALUES (?)`,
    [gender_name]
  );
  return result;
};

// UPDATE
const updateGender = async (gender_id, gender_name) => {
  const pool = await getConnection();
  const [result] = await pool.execute(
    `UPDATE gender SET gender_name = ? WHERE gender_id = ?`,
    [gender_name, gender_id]
  );
  return result;
};

// GET ALL
const getAllGenders = async () => {
  const pool = await getConnection();
  const [rows] = await pool.execute(`SELECT * FROM gender`);
  return rows;
};

// DELETE
const deleteGender = async (gender_id) => {
  const pool = await getConnection();
  const [result] = await pool.execute(
    `DELETE FROM gender WHERE gender_id = ?`,
    [gender_id]
  );
  return result;
};

module.exports = {
  createGender,
  updateGender,
  getAllGenders,
  deleteGender,
};
