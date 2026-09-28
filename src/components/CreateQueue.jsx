import React, { useState } from "react";
import { Link } from "react-router-dom";

const CreateQueue = () => {
  const [queue, setQueue] = useState({
    queueName: "",
    serviceName: "",
    description: "",
    location: "",
    openingTime: "",
    closingTime: "",
    averageServiceTime: "",
    maxCapacity: "",
  });

  const handleChange = (e) => {
    setQueue({
      ...queue,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/queues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          ...queue,
          averageServiceTime: Number(queue.averageServiceTime),
          maxCapacity: Number(queue.maxCapacity),
        }),
      });

      const data = await response.json();

    

      if (response.ok) {
        

        window.location.href = "/owner-dashboard";
      } else {
        console.error("CREATE QUEUE FAILED:", data.message);
      }
    } catch (error) {
      console.error("CREATE QUEUE ERROR:", error);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/owner-dashboard" className="navbar-brand fw-bold fs-4">
            Queue<span className="text-primary">Less</span>
          </Link>

          <Link to="/owner-dashboard" className="btn btn-outline-light">
            <i className="bi bi-arrow-left me-2"></i>
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Page */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="mb-4">
              <h2 className="fw-bold">Create New Queue</h2>

              <p className="text-muted">
                Set up a queue for your customers to join.
              </p>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  {/* Queue Information */}
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-list-ul me-2"></i>
                    Queue Information
                  </h5>

                  <div className="row">
                    {/* Queue Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Queue Name
                      </label>

                      <input
                        type="text"
                        name="queueName"
                        className="form-control"
                        placeholder="e.g. General Consultation"
                        value={queue.queueName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Service */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Service Name
                      </label>

                      <input
                        type="text"
                        name="serviceName"
                        className="form-control"
                        placeholder="e.g. Doctor Consultation"
                        value={queue.serviceName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      placeholder="Describe the service provided..."
                      value={queue.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <hr className="my-4" />

                  {/* Location */}
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-geo-alt me-2"></i>
                    Location & Timing
                  </h5>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location</label>

                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      placeholder="e.g. Sector 17, Chandigarh"
                      value={queue.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    {/* Opening */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Opening Time
                      </label>

                      <input
                        type="time"
                        name="openingTime"
                        className="form-control"
                        value={queue.openingTime}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Closing */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Closing Time
                      </label>

                      <input
                        type="time"
                        name="closingTime"
                        className="form-control"
                        value={queue.closingTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Queue Settings */}
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-gear me-2"></i>
                    Queue Settings
                  </h5>

                  <div className="row">
                    {/* Average Service Time */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Average Service Time
                      </label>

                      <div className="input-group">
                        <input
                          type="number"
                          name="averageServiceTime"
                          className="form-control"
                          placeholder="5"
                          min="1"
                          value={queue.averageServiceTime}
                          onChange={handleChange}
                          required
                        />

                        <span className="input-group-text">minutes</span>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Maximum Queue Capacity
                      </label>

                      <input
                        type="number"
                        name="maxCapacity"
                        className="form-control"
                        placeholder="50"
                        min="1"
                        value={queue.maxCapacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="alert alert-info mt-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Customers will be able to see the queue name, location,
                    timings, estimated waiting time and available capacity.
                  </div>

                  {/* Buttons */}
                  <div className="d-flex gap-3 mt-4">
                    <Link
                      to="/owner-dashboard"
                      className="btn btn-outline-secondary flex-fill"
                    >
                      Cancel
                    </Link>

                    <button type="submit" className="btn btn-primary flex-fill">
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Queue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQueue;
