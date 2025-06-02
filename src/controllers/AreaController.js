const { getConnection } = require('../config/database');

// CREATE
const createArea = async (req, res) => {
  try {
    const { name, code, ward_id } = req.body;
    const pool = await getConnection();

    const [result] = await pool.execute(
      `INSERT INTO d05_area (Name, Code, Ward_Id) VALUES (?, ?, ?)`,
      [name, code, ward_id]
    );

    res.json({
      success: true,
      message: 'Added successfully'
    });
  } catch (error) {
    console.error('Error in createArea:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// UPDATE
const updateArea = async (req, res) => {
  try {
    const { id, name, code, ward_id } = req.body;
    const pool = await getConnection();

    const [result] = await pool.execute(
      `UPDATE d05_area SET Name = ?, Code = ?, Ward_Id = ? WHERE Id = ?`,
      [name, code, ward_id, id]
    );

    res.json({
      success: true,
      message: 'Updated successfully'
    });
  } catch (error) {
    console.error('Error in updateArea:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// READ
const getArea = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.execute("SELECT * FROM d05_area");

    res.json({
      success: true,
      message: 'Data fetched successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error in getArea:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE
const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const [result] = await pool.execute(`DELETE FROM d05_area WHERE Id = ?`, [id]);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Area not found' });
    }
  } catch (error) {
    console.error('Error in deleteArea:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createArea,
  updateArea,
  getArea,
  deleteArea,
};
