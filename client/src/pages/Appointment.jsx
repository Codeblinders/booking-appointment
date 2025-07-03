import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Table, Form, Button } from "react-bootstrap";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const UserAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filters, setFilters] = useState({
    all: true,
    accepted: false,
    rejected: false,
    pending: false,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (filters.all) {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((appt) =>
          (filters.accepted && appt.status === "accepted") ||
          (filters.rejected && appt.status === "rejected") ||
          (filters.pending && appt.status === "pending")
        )
      );
    }
  }, [appointments, filters]);

  const fetchAppointments = async () => {
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
      setAppointments(data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = ({ name, checked }) => {
    if (name === "all" && checked) {
      setFilters({ all: true, accepted: false, rejected: false, pending: false });
    } else {
      setFilters((f) => ({ ...f, [name]: checked, all: false }));
    }
  };

  const deleteAppointment = async (id) => {
    setIsLoading(true);
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/delete-appointment/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ _id: id }),
        }
      );
      fetchAppointments();
    } catch {
      toast.error("Error deleting appointment");
      setIsLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    setIsLoading(true);
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update-appointment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ _id: id, status }),
        }
      );
      fetchAppointments();
    } catch {
      toast.error("Error updating appointment");
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
            <div className="d-flex">
              {Object.keys(filters).map((key) => (
                <Form.Check
                  key={key}
                  type="checkbox"
                  id={`filter-${key}`}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  checked={filters[key]}
                  onChange={(e) =>
                    handleFilterChange({ name: e.target.name, checked: e.target.checked })
                  }
                  className="me-3"
                />
              ))}
            </div>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt._id}>
                  <td>{apt.teacherID.name}</td>
                  <td>{dayjs(apt.scheduleDateTime).format("MMMM D, YYYY h:mm A")}</td>
                  <td>{apt.status}</td>
                  <td>
                    {(apt.status === "accepted" || apt.status === "pending") ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(apt._id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <i
                        className="ri-delete-bin-line"
                        onClick={() => deleteAppointment(apt._id)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Layout>
  );
};

export default UserAppointment;
