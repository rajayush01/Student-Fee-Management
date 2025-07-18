import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Student from '../models/Student.js';
import auth from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      email,
      password: hashedPassword
    });

    await student.save();

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
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

// Get current student
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      student: {
        id: req.student._id,
        name: req.student.name,
        email: req.student.email,
        feesPaid: req.student.feesPaid
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
