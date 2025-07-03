import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";
import StudentModel from "../models/studentModel.js";
import TeacherModel from "../models/teacherModel.js";
import SessionModel from "../models/sessionModel.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import studentAuth from "../middlewares/studentauth.js";

import {
  registerController,
  loginController,
  userInfoController,
  appointmentListController,
  teacherDetailsController,
  bookAppointmentController,
  teacherInfoController,
  updateAppointmentController,
  deleteAppointmentController
} from "../controllers/userCtrl.js";

const router = express.Router();

// Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/get-user-info-by-id", authMiddleware, userInfoController);

router.get("/book-appointment", authMiddleware, studentAuth, teacherDetailsController);
router.post("/teacher/book-appointment/", authMiddleware, studentAuth, bookAppointmentController);
router.post("/get-teacher-by-id", authMiddleware, studentAuth, teacherInfoController);

router.get("/appointments", authMiddleware, appointmentListController);
router.put("/update-appointment/:id", authMiddleware, updateAppointmentController);
router.delete("/delete-appointment/:id", authMiddleware, deleteAppointmentController);

export default router;
