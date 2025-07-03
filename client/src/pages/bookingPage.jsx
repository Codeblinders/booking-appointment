import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const BookingPage = () => {
  const { teacherID } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [teacher, setTeacher] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch teacher details on mount
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/get-teacher-by-id`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ teacherID }),
          }
        );
        const { success, data } = await res.json();
        if (success) setTeacher(data);
        else navigate("/home");
      } catch {
        navigate("/");
      }
    };

    fetchTeacher();
  }, [teacherID, navigate]);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedDateTime) {
      toast.error("Please select a date and time.");
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        studentID: user.id,
        teacherID: teacher.id,
        scheduleDateTime: selectedDateTime.format("YYYY-MM-DDTHH:mm"),
      };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/teacher/book-appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingData),
        }
      );
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        navigate("/user-appointments");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Internal server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="container mt-5">
          {!teacher ? (
            <div className="text-center mt-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title text-primary">{teacher.name}</h2>
                    <p><strong>Speciality:</strong> {teacher.speciality}</p>
                    <p><strong>Email:</strong> {teacher.email}</p>

                    <form onSubmit={handleSubmitBooking}>
                      <div className="mb-3 d-flex align-items-center">
                        <strong>Schedule:&nbsp;</strong>
                        <DateTimePicker
                          label="Choose Date/Time"
                          value={selectedDateTime}
                          onChange={setSelectedDateTime}
                          minutesStep={30}
                          minTime={dayjs().hour(9).startOf("hour")}
                          maxTime={dayjs().hour(17).startOf("hour")}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={isLoading}
                      >
                        {isLoading ? "Booking..." : "Book Now"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </LocalizationProvider>
    </Layout>
  );
};

export default BookingPage;
