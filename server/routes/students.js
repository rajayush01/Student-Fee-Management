import express from 'express';
import Student from '../models/Student.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const student = await Student.findById(req.student._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (email !== student.email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    student.name = name || student.name;
    student.email = email || student.email;

    await student.save();

    res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        feesPaid: student.feesPaid
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;