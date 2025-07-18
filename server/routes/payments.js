import express from 'express';

import Student from '../models/Student.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Process payment
router.post('/process', auth, async (req, res) => {
  try {
    const { amount, paymentMethod, cardNumber, expiryDate, cvv } = req.body;

    // Simulate payment processing
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    // Update student's fee status
    const student = await Student.findById(req.student._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.feesPaid = true;
    student.paymentHistory.push({
      amount,
      paymentMethod,
      transactionId,
      date: new Date()
    });

    await student.save();

    // Emit real-time update to all connected clients
    req.io.emit('paymentUpdate', {
      studentId: student._id,
      name: student.name,
      email: student.email,
      feesPaid: true
    });

    res.json({
      message: 'Payment processed successfully',
      transactionId,
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