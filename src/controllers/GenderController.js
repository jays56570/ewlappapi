const GenderModel = require('../models/GenderModel');

const createGender = async (req, res) => {
  try {
    const { gender_name } = req.body;
    await GenderModel.createGender(gender_name);
    res.json({ success: true, message: 'Gender added successfully' });
  } catch (error) {
    console.error('Error in createGender:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateGender = async (req, res) => {
  try {
    const { gender_id, gender_name } = req.body;
    await GenderModel.updateGender(gender_id, gender_name);
    res.json({ success: true, message: 'Gender updated successfully' });
  } catch (error) {
    console.error('Error in updateGender:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getGender = async (req, res) => {
  try {
    const rows = await GenderModel.getAllGenders();
    res.json({ success: true, message: 'Genders fetched successfully', data: rows });
  } catch (error) {
    console.error('Error in getGender:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteGender = async (req, res) => {
  try {
    const { gender_id } = req.params;
    const result = await GenderModel.deleteGender(gender_id);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Gender deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Gender not found' });
    }
  } catch (error) {
    console.error('Error in deleteGender:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createGender,
  updateGender,
  getGender,
  deleteGender,
};
