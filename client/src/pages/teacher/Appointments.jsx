import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Table, Form, Button } from "react-bootstrap";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const TeacherAppointments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filters, setFilters] = useState({
    all: true,
    accepted: false,
    rejected: false,
    pending: false,
  });

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, []); // run once

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/teacher/appointments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      console.log("Appointments fetched:", data);

      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Error fetching appointments");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters whenever appointments or filters change
  useEffect(() => {
    if (filters.all) {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter(
          (appt) =>
            (filters.accepted && appt.status === "accepted") ||
            (filters.rejected && appt.status === "rejected") ||
            (filters.pending && appt.status === "pending")
        )
      );
    }
  }, [appointments, filters]);

  const handleFilterChange = ({ name, checked }) => {
    if (name === "all" && checked) {
      setFilters({ all: true, accepted: false, rejected: false, pending: false });
    } else {
      setFilters((prev) => ({ ...prev, [name]: checked, all: false }));
    }
  };

  const handleAction = async (id, action) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/teacher/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ _id: id, status: action }),
        }
      );
      const result = await res.json();
      if (result.success) {
        toast.success(`Appointment ${action}`);
        fetchAppointments(); // refresh
      } else {
        toast.error(result.message || "Failed to update appointment");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Server error while updating appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/teacher/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        toast.success("Appointment deleted");
        fetchAppointments(); // refresh
      } else {
        toast.error(result.message || "Failed to delete appointment");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Server error while deleting appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container mt-4">
          <h2>My Appointments</h2>

          <Form className="mb-3">
            <div className="d-flex flex-wrap">
              {Object.keys(filters).map((filter) => (
                <Form.Check
                  key={filter}
                  type="checkbox"
                  id={`filter-${filter}`}
                  label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                  name={filter}
                  checked={filters[filter]}
                  onChange={(e) => handleFilterChange(e.target)}
                  className="me-3"
                />
              ))}
            </div>
          </Form>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.studentID?.name || "N/A"}</td>
                    <td>
                      {dayjs(apt.scheduleDateTime).format("MMMM D, YYYY h:mm A")}
                    </td>
                    <td className="text-capitalize">{apt.status}</td>
                    <td>
                      {apt.status === "pending" ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleAction(apt._id, "accepted")}
                            disabled={isLoading}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAction(apt._id, "rejected")}
                            disabled={isLoading}
                          >
                            Reject
                          </Button>
                        </>
                      ) : apt.status !== "accepted" ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteAppointment(apt._id)}
                          disabled={isLoading}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Layout>
  );
};

export default TeacherAppointments;
