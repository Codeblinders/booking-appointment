import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import TeacherCard from "../components/teacherCard";

const BookAppointment = () => {
  const [teachersList, setTeachersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getTeachersList = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/book-appointment`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setTeachersList(data.data);
      } else {
        navigate("/home");
      }
    } catch (err) {
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTeachersList();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {teachersList.length === 0 ? (
        <div className="text-center mt-5">
          <p className="h3">
            Currently no teachers are available on this platform
          </p>
        </div>
      ) : (
        <div className="d-flex flex-wrap">
          {teachersList.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default BookAppointment;
