import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const ViewQueue = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQueue();
  }, [id]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:5000/api/queues/${id}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load queue");
      }

      setQueue(data.queue);
    } catch (error) {
      console.error("Queue error:", error);
      setError(error.message || "Unable to load queue");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setJoining(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/queues/${id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to join queue");
      }

      console.log("JOIN QUEUE RESPONSE:", data);

      // Go to queue status with the queue ID
      navigate(`/queue-status/${id}`);
    } catch (error) {
      console.error("Join queue error:", error);
      setError(error.message || "Unable to join queue");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-secondary mt-3">Loading queue...</p>
        </div>
      </div>
    );
  }

  if (error && !queue) {
    return (
      <div className="bg-light min-vh-100">
        <nav className="navbar bg-white border-bottom">
          <div className="container">
            <Link className="navbar-brand fw-bold fs-3" to="/">
              Queue<span className="text-primary">Less</span>
            </Link>
          </div>
        </nav>

        <main className="container py-5">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>

          <Link to="/customer-dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const waitingCustomers =
    queue?.customers?.filter((customer) => customer.status === "waiting")
      .length || 0;

  const servingCustomers =
    queue?.customers?.filter((customer) => customer.status === "serving")
      .length || 0;

  const estimatedWait = waitingCustomers * queue.averageServiceTime;

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/customer-dashboard">
            Queue<span className="text-primary">Less</span>
          </Link>

          <div className="ms-auto">
            <Link to="/customer-dashboard" className="btn btn-outline-primary">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="container py-5">
        {/* Back */}
        <Link
          to="/customer-dashboard"
          className="text-decoration-none text-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to queues
        </Link>

        {/* Content */}
        <div className="row mt-4 g-4">
          {/* Queue Details */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-primary-subtle text-primary rounded-3
                                 d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                    >
                      <i className="bi bi-shop fs-2"></i>
                    </div>

                    <div>
                      <span
                        className={`badge ${
                          queue.status === "open"
                            ? "text-bg-success"
                            : "text-bg-warning"
                        } mb-2`}
                      >
                        {queue.status}
                      </span>

                      <h2 className="fw-bold mb-1">{queue.queueName}</h2>

                      <p className="text-secondary mb-0">{queue.serviceName}</p>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Queue Stats */}
                <div className="row text-center g-3">
                  <div className="col-4">
                    <div className="bg-light rounded-3 p-3">
                      <i className="bi bi-people text-primary fs-4"></i>

                      <h4 className="fw-bold mt-2 mb-1">{waitingCustomers}</h4>

                      <small className="text-secondary">Waiting</small>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="bg-light rounded-3 p-3">
                      <i className="bi bi-clock text-primary fs-4"></i>

                      <h4 className="fw-bold mt-2 mb-1">~{estimatedWait}</h4>

                      <small className="text-secondary">Minutes</small>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="bg-light rounded-3 p-3">
                      <i className="bi bi-person-check text-primary fs-4"></i>

                      <h4 className="fw-bold mt-2 mb-1">
                        {queue.currentToken || "-"}
                      </h4>

                      <small className="text-secondary">Current Token</small>
                    </div>
                  </div>
                </div>

                {/* Queue Information */}
                <div className="mt-5">
                  <h5 className="fw-bold mb-3">Queue Information</h5>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex">
                        <i className="bi bi-geo-alt text-primary fs-5 me-3"></i>

                        <div>
                          <small className="text-secondary">Location</small>

                          <p className="mb-0 fw-semibold">{queue.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex">
                        <i className="bi bi-clock text-primary fs-5 me-3"></i>

                        <div>
                          <small className="text-secondary">
                            Working Hours
                          </small>

                          <p className="mb-0 fw-semibold">
                            {queue.openingTime} - {queue.closingTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex">
                        <i className="bi bi-stopwatch text-primary fs-5 me-3"></i>

                        <div>
                          <small className="text-secondary">
                            Average Service Time
                          </small>

                          <p className="mb-0 fw-semibold">
                            {queue.averageServiceTime} minutes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex">
                        <i className="bi bi-people text-primary fs-5 me-3"></i>

                        <div>
                          <small className="text-secondary">
                            Queue Capacity
                          </small>

                          <p className="mb-0 fw-semibold">
                            {queue.maxCapacity} people
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {queue.description && (
                  <div className="mt-5">
                    <h5 className="fw-bold mb-3">About this Queue</h5>

                    <p className="text-secondary mb-0">{queue.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Join Card */}
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm rounded-4 sticky-lg-top"
              style={{ top: "20px" }}
            >
              <div className="card-body p-4">
                <h4 className="fw-bold">Join this queue</h4>

                <p className="text-secondary">
                  Get a digital token and track your position.
                </p>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger">
                    <small>
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {error}
                    </small>
                  </div>
                )}

                <div className="bg-light rounded-3 p-3 mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Current token</span>

                    <span className="fw-semibold">
                      {queue.currentToken || "None"}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Estimated wait</span>

                    <span className="fw-semibold">~{estimatedWait} min</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100"
                  onClick={handleJoinQueue}
                  disabled={joining || queue.status !== "open"}
                >
                  {joining ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Joining...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Join This Queue
                    </>
                  )}
                </button>

                <p className="text-center text-secondary small mt-3 mb-0">
                  You can track your queue position after joining.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewQueue;
