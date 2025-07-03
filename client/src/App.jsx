import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Button } from "antd";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Home } from "./pages/home.jsx";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { PublicRoutes } from "./components/PublicRoutes";
import BookAppointment from "./pages/bookAppointment";
import BookingPage from "./pages/bookingPage";
import TeacherAppointments from "./pages/teacher/Appointments";
import UserAppointment from "./pages/Appointment";
import Profile from "./pages/profile";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-appointments"
            element={
              <ProtectedRoute>
                <UserAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/appointments"
            element={
              <ProtectedRoute>
                <TeacherAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/book-appointment/:teacherID"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoutes>
                <Register />
              </PublicRoutes>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoutes>
                <Login />
              </PublicRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;