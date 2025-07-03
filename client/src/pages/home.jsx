import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";

export const Home = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/appointments`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setAppointments(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id]); // ✅ Safer dependency (avoid referencing entire object)

  const handleBookSession = () => {
    navigate("/book-appointment");
  };

  const nextAppointment = appointments?.find(
    (appt) => appt.status === "accepted"
  );

  return (
    <Layout>
      <div className="container">
        {isLoading ? (
          <div className="text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Error fetching appointments: {error.message}
          </div>
        ) : !nextAppointment ? (
          <div className="text-center mt-5">
            <p className="h3">You have no confirmed appointments.</p>
          </div>
        ) : (
          <div className="card my-3">
            <div className="card-body">
              <h5 className="card-title">Upcoming Appointment</h5>
              <p className="card-text">
                Date:{" "}
                {dayjs(nextAppointment.scheduleDateTime).format(
                  "MMMM D, YYYY"
                )}
                <br />
                Time:{" "}
                {dayjs(nextAppointment.scheduleDateTime).format("hh:mm A")}
                <br />
                {user.role === "teacher" ? (
                  <>Student Name: {nextAppointment?.studentID?.name}</>
                ) : (
                  <>Teacher Name: {nextAppointment?.teacherID?.name}</>
                )}
              </p>
            </div>
          </div>
        )}

        {user?.role === "student" && (
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary btn-lg mt-4"
              onClick={handleBookSession}
            >
              Book 1:1 Session Now
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
