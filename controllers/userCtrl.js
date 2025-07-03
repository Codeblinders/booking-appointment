import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import Session from "../models/sessionModel.js";

export const registerController = async (req, res) => {
  try {
    const { email, password, role, name, speciality } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    const userExist = await Model.findOne({ email });
    if (userExist) {
      return res.status(200).send({
        message: "User with same email already exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Model({
      email,
      password: hashedPassword,
      name,
      role,
    });

    if (role === "teacher" && speciality) {
      newUser.speciality = speciality;
    }

    await newUser.save();

    res.status(200).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ message: "Server error", success: false });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === "teacher" ? Teacher : Student;

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        message: "Incorrect password or email address",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, myRole: role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      message: "Login Successful",
      success: true,
      data: { token },
    });
  } catch (error) {
    res.status(500).send({ message: "Server error", success: false, error });
  }
};

export const userInfoController = async (req, res) => {
  try {
    const Model = req.body.role === "teacher" ? Teacher : Student;
    const user = await Model.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    const output = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: req.body.role,
    };
    if (output.role === "teacher") {
      output.speciality = user.speciality;
    }

    res.status(200).send({ success: true, data: output });
  } catch (error) {
    res.status(500).send({
      message: "Error getting user info",
      success: false,
    });
  }
};

export const teacherDetailsController = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    const data = teachers.map(t => ({
      id: t._id,
      name: t.name,
      email: t.email,
      speciality: t.speciality,
    }));
    res.status(200).send({ success: true, data });
  } catch (error) {
    res.status(500).send({
      message: "Error getting teacher info",
      success: false,
    });
  }
};

export const bookAppointmentController = async (req, res) => {
  try {
    const { studentID, teacherID, scheduleDateTime } = req.body;
    const existing = await Session.findOne({ teacherID, scheduleDateTime });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const newAppointment = new Session({
      studentID,
      teacherID,
      scheduleDateTime,
      status: "pending",
    });

    await newAppointment.save();
    res.status(201).json({
      success: true,
      message: "Appointment booking request sent successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};

export const teacherInfoController = async (req, res) => {
  try {
    const teacherID = req.body.teacherID;
    const teacher = await Teacher.findById(teacherID);
    const appointments = await Session.find({ teacherID }).sort("scheduleDateTime");

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
};

export const appointmentListController = async (req, res) => {
  try {
    const key = req.body.role === "student" ? "studentID" : "teacherID";
    const id = req.body.userId;

    const appointments = await Session.find({ [key]: id })
      .populate("teacherID", "name")
      .populate("studentID", "name")
      .sort("scheduleDateTime");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointmentController = async (req, res) => {
  try {
    const { _id, status } = req.body;
    await Session.findByIdAndUpdate(_id, { status }, { new: true });

    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    const { _id } = req.body;
    const result = await Session.deleteOne({ _id });

    if (result.deletedCount === 1) {
      res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
