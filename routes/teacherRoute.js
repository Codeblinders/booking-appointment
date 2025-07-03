import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import Session from "../models/sessionModel.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import teacherAuth from "../middlewares/teacherauth.js";

const router = express.Router();

/**
 * @route   PUT /api/v1/teacher/appointments/:id
 * @desc    Update appointment status (accept/reject)
 * @access  Private (Teacher)
 */
router.put("/appointments/:id", authMiddleware, teacherAuth, async (req, res) => {
  try {
    const { _id, status } = req.body;

    const appointment = await Session.findByIdAndUpdate(_id, { status });

    res.status(200).send({
      success: true,
      message: "Appointment status updated",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   GET /api/v1/teacher/appointments
 * @desc    Get all appointments for the logged-in teacher
 * @access  Private (Teacher)
 */
router.get("/appointments", authMiddleware, teacherAuth, async (req, res) => {
  try {
    const teacherId = req.body.userId; // Added by authMiddleware

    const appointments = await Session.find({ teacherID: teacherId })
      .populate("studentID", "name email") // Populate student name/email
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
    });
  }
});

/**
 * @route   POST /api/v1/teacher/get-teacher-by-id
 * @desc    Get teacher info + their appointments
 * @access  Private (Teacher)
 */
router.post("/get-teacher-by-id", authMiddleware, teacherAuth, async (req, res) => {
  try {
    const teacherid = req.body.teacherID;

    const teacher = await Teacher.findById(teacherid);
    const appointments = await Session.find({ teacherID: teacherid })
      .populate("studentID", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        speciality: teacher.speciality,
        appointmentsList: appointments,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error getting teacher info",
    });
  }
});

export default router;
