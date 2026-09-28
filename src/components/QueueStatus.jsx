import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const QueueStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exitLoading, setExitLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${id}/status`,
        {
          headers: {
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to get queue status");
      }

      setQueueStatus(data);
    } catch (error) {
      console.error("Queue status error:", error);
      setError(error.message || "Unable to load queue status");
    } finally {
      setLoading(false);
    }
  };

  const handleExitQueue = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to exit this queue?",
    );

    if (!confirmed) return;

    try {
      setExitLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${id}/exit`,
        {
          method: "POST",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to exit queue");
      }

      navigate("/customer-dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setExitLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      socket.emit("joinQueue", id);
    });

    socket.on("queueUpdated", (data) => {
      if (String(data.id) === String(id)) {
        setQueueStatus((prev) => ({
          ...prev,
          currentToken: data.currentToken,
          status: data.status,
          peopleAhead: data.status === "serving" ? 0 : (prev?.peopleAhead ?? 0),
        }));

        // Get the complete, authoritative status from backend
        fetchStatus();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>

          <p className="text-secondary mt-3">Loading your queue status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100">
        <nav className="navbar bg-white border-bottom">
          <div className="container">
            <Link
              className="navbar-brand fw-bold fs-3"
              to="/customer-dashboard"
            >
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

  const isServing = queueStatus?.status === "serving";

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/customer-dashboard">
            Queue<span className="text-primary">Less</span>
          </Link>

          <Link to="/customer-dashboard" className="btn btn-outline-primary">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className={`rounded-circle d-inline-flex
                            align-items-center justify-content-center mb-3
                            ${
                              isServing
                                ? "bg-success-subtle text-success"
                                : "bg-primary-subtle text-primary"
                            }`}
                style={{
                  width: "75px",
                  height: "75px",
                }}
              >
                <i
                  className={`bi ${
                    isServing ? "bi-person-check" : "bi-ticket-perforated"
                  } fs-2`}
                ></i>
              </div>

              <h2 className="fw-bold">{queueStatus.queueName}</h2>

              <p className="text-secondary">Your Queue Status</p>
            </div>

            {/* Status Card */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {/* Current Status */}
                <div className="text-center mb-4">
                  <span
                    className={`badge fs-6 px-3 py-2 ${
                      isServing ? "text-bg-success" : "text-bg-primary"
                    }`}
                  >
                    {isServing ? "You are being served" : "Waiting in Queue"}
                  </span>
                </div>

                {/* Token */}
                <div className="text-center bg-light rounded-4 p-4 mb-4">
                  <small className="text-secondary">Your Token Number</small>

                  <h1 className="display-2 fw-bold text-primary mb-0">
                    #{queueStatus.tokenNumber}
                  </h1>
                </div>

                {/* Stats */}
                <div className="row g-3">
                  <div className="col-6">
                    <div className="border rounded-3 p-3 text-center h-100">
                      <i className="bi bi-people text-primary fs-3"></i>

                      <h4 className="fw-bold mt-2 mb-1">
                        {queueStatus.peopleAhead}
                      </h4>

                      <small className="text-secondary">People Ahead</small>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="border rounded-3 p-3 text-center h-100">
                      <i className="bi bi-clock text-primary fs-3"></i>

                      <h4 className="fw-bold mt-2 mb-1">
                        {queueStatus.estimatedWaitTime}
                      </h4>

                      <small className="text-secondary">Est. Minutes</small>
                    </div>
                  </div>
                </div>

                {/* Current Token */}
                <div className="mt-4 p-3 bg-primary-subtle rounded-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Currently Serving</span>

                    <strong className="text-primary">
                      {queueStatus.currentToken != null
                        ? `#${queueStatus.currentToken}`
                        : "Not started"}
                    </strong>
                  </div>
                </div>

                {/* Live indicator */}
                <div className="text-center mt-4">
                  <span className="text-success small">
                    <i className="bi bi-broadcast me-2"></i>
                    Live queue updates enabled
                  </span>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="text-center mt-4">
              <Link to="/customer-dashboard" className="text-decoration-none">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Dashboard
              </Link>

              <button
                className="btn btn-outline-danger w-100 mt-3"
                onClick={handleExitQueue}
                disabled={exitLoading}
              >
                {exitLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Exiting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-left me-2"></i>
                    Exit Queue
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QueueStatus;
