import express from "express"; // ✅ FIX: removed 'c' before import
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import Session from "../models/sessionModel.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import teacherAuth from "../middlewares/teacherauth.js";

const router = express.Router();

// ✅ Update Appointment Status
router.put("/appointments/:id", authMiddleware, teacherAuth, async (req, res) => {
  try {
    const { _id, status } = req.body;

    const appointments = await Session.findByIdAndUpdate(_id, { status });

    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get Teacher Info & Appointments
router.post("/get-teacher-by-id", authMiddleware, teacherAuth, async (req, res) => {
  try {
    const teacherid = req.body.teacherID;

    const teacher = await TeacherModel.findById(teacherid);
    const appointments = await Session.find({ teacherID: teacherid })
      .sort({ "dateTime.date": 1, "dateTime.time": 1 });

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
      message: "Error getting teacher info",
      success: false,
    });
  }
});

export default router;
