import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const OwnerDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQueue, setEditQueue] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  const fetchQueues = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/my`,
        {
          headers: {
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setQueues(data.queues);

        if (data.queues.length > 0) {
          setSelectedQueue(data.queues[0]);
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    socket.on("connect", () => {
      if (selectedQueue) {
        socket.emit("joinQueue", selectedQueue._id);
      }
    });

    socket.on("queueUpdated", (data) => {
      if (selectedQueue && String(data.queueId) === String(selectedQueue._id)) {
        fetchQueues();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedQueue]);

  const servedToday =
    selectedQueue?.customers?.filter(
      (customer) => customer.status === "completed",
    ).length || 0;

  const handleNext = async () => {
    if (!selectedQueue || actionLoading) return;

    if (selectedQueue.status !== "open") return;

    const waitingCustomers = selectedQueue.customers.filter(
      (customer) => customer.status === "waiting",
    );

    if (waitingCustomers.length === 0) return;

    setActionLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${selectedQueue._id}/next`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to call next customer");
      }

      const updatedQueue = {
        ...selectedQueue,
        currentToken: data.currentToken,
        customers: selectedQueue.customers.map((customer) =>
          customer.tokenNumber === data.tokenNumber
            ? { ...customer, status: "serving" }
            : customer,
        ),
      };

      setQueues((prev) =>
        prev.map((q) => (q._id === updatedQueue._id ? updatedQueue : q)),
      );
    } catch (error) {
      console.error("NEXT ERROR:", error);
    } finally {
      setActionLoading(false);
    }
  };
  const handleComplete = async (queue) => {
    if (!queue || actionLoading) return;

    setActionLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${queue._id}/complete`,
        {
          method: "POST",
          headers: {
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        const updatedQueue = {
          ...queue,
          customers: queue.customers.map((customer) =>
            customer.tokenNumber === data.tokenNumber
              ? { ...customer, status: "completed" }
              : customer,
          ),
        };

        setSelectedQueue(updatedQueue);

        setQueues((previousQueues) =>
          previousQueues.map((item) =>
            item._id === updatedQueue._id ? updatedQueue : item,
          ),
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("COMPLETE ERROR:", error);
    } finally {
      setActionLoading(false);
    }
  };
  const handleSkip = async (queue) => {
    if (!queue) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${queue._id}/skip`,
        {
          method: "POST",
          headers: {
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        const updatedQueue = {
          ...queue,
          customers: queue.customers.map((customer) =>
            customer.tokenNumber === data.tokenNumber
              ? { ...customer, status: "skipped" }
              : customer,
          ),
        };

        setSelectedQueue(updatedQueue);

        setQueues((previousQueues) =>
          previousQueues.map((item) =>
            item._id === updatedQueue._id ? updatedQueue : item,
          ),
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("SKIP ERROR:", error);
    }
  };
  const handlePauseResume = async (queue) => {
    if (!queue) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const action = queue.status === "paused" ? "resume" : "pause";

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${queue._id}/${action}`,
        {
          method: "POST",
          headers: {
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        const updatedQueue = {
          ...queue,
          status: data.status,
        };

        setSelectedQueue(updatedQueue);

        setQueues((previousQueues) =>
          previousQueues.map((item) =>
            item._id === updatedQueue._id ? updatedQueue : item,
          ),
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("PAUSE/RESUME ERROR:", error);
    }
  };
  const currentServingCustomer = selectedQueue?.customers?.find(
    (customer) => customer.status === "serving",
  );

  const waitingCustomers =
    selectedQueue?.customers?.filter(
      (customer) => customer.status === "waiting",
    ) || [];
  const handleEditQueue = (queue) => {
    setEditQueue({ ...queue });
    setShowEditModal(true);
  };
  const handleDeleteQueue = async (queue) => {
    if (!queue) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${queue.queueName}"?`,
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${queue._id}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete queue");
      }

      const remainingQueues = queues.filter((item) => item._id !== queue._id);

      setQueues(remainingQueues);

      if (selectedQueue?._id === queue._id) {
        setSelectedQueue(remainingQueues[0] || null);
      }

      alert("Queue deleted successfully");
    } catch (error) {
      console.error("DELETE QUEUE ERROR:", error);
      alert(error.message);
    }
  };

  const handleUpdateQueue = async (e) => {
    e.preventDefault();

    if (!editQueue || editLoading) return;

    setEditLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/queues/${editQueue._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(editQueue),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update queue");
      }

      setQueues((previousQueues) =>
        previousQueues.map((queue) =>
          queue._id === data.queue._id ? data.queue : queue,
        ),
      );

      setSelectedQueue(data.queue);
      setShowEditModal(false);
      setEditQueue(null);
    } catch (error) {
      console.error("EDIT QUEUE ERROR:", error);
      alert(error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/owner-login");
  };
  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/owner-dashboard" className="navbar-brand fw-bold fs-4">
            Queue<span className="text-primary">Less</span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            <Link to="/owner-profile" className="btn btn-outline-light btn-sm">
              <i className="bi bi-person-circle me-1"></i>
              Profile
            </Link>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="container py-5">
        {/* Welcome */}
        <div className="mb-4">
          <h2 className="fw-bold">Owner Dashboard</h2>

          <p className="text-muted mb-0">
            Manage your queues and serve your customers efficiently.
          </p>
        </div>

        {/* Statistics */}
        <div className="row g-4 mb-5">
          {/* Current Queue */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">Current Queue</p>

                    <h2 className="fw-bold mb-0">
                      {selectedQueue
                        ? selectedQueue.customers.filter(
                            (customer) => customer.status === "waiting",
                          ).length
                        : 0}
                    </h2>
                  </div>

                  <i className="bi bi-people fs-1 text-primary"></i>
                </div>

                <small className="text-muted">Customers waiting</small>
              </div>
            </div>
          </div>

          {/* Currently Serving */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">Serving</p>

                    <h2 className="fw-bold mb-0">
                      {selectedQueue ? `#${selectedQueue.currentToken}` : "#0"}
                    </h2>
                  </div>

                  <i className="bi bi-person-check fs-1 text-success"></i>
                </div>

                <small className="text-muted">Current token</small>
              </div>
            </div>
          </div>

          {/* Estimated Wait */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">Avg. Wait</p>

                    <h2 className="fw-bold mb-0">
                      {selectedQueue?.averageServiceTime || 0} min
                    </h2>
                  </div>

                  <i className="bi bi-clock fs-1 text-warning"></i>
                </div>

                <small className="text-muted">Estimated waiting time</small>
              </div>
            </div>
          </div>

          {/* Served Today */}
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">Served Today</p>

                    <h3>{servedToday}</h3>
                  </div>

                  <i className="bi bi-check-circle fs-1 text-info"></i>
                </div>

                <small className="text-muted">Customers served</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="row g-4">
          {/* Queue Management */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="fw-bold mb-0">My Queues</h4>

                      <button
                        className="btn btn-outline-primary btn-sm mx-3"
                        onClick={fetchQueues}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Refresh
                      </button>
                    </div>
                    <p className="text-muted mb-0">
                      Manage your created queues
                    </p>
                  </div>

                  <span className="badge bg-primary fs-6">
                    {queues.length} Queue{queues.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {loading ? (
                  <p className="text-muted">Loading queues...</p>
                ) : queues.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-inbox fs-1 text-muted"></i>
                    <p className="text-muted mt-2">
                      You haven't created any queues yet.
                    </p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {queues.map((queue) => (
                      <div className="col-md-6" key={queue._id}>
                        <div className="card border shadow-sm h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <h5 className="fw-bold mb-2">
                                {queue.queueName}
                              </h5>

                              <span
                                className={`badge ${
                                  queue.status === "open"
                                    ? "bg-success"
                                    : queue.status === "paused"
                                      ? "bg-warning text-dark"
                                      : "bg-secondary"
                                }`}
                              >
                                {queue.status}
                              </span>
                            </div>

                            <p className="text-muted mb-2">
                              {queue.serviceName}
                            </p>

                            <p className="small mb-2">
                              <i className="bi bi-geo-alt me-2"></i>
                              {queue.location}
                            </p>

                            <p className="small mb-2">
                              <i className="bi bi-clock me-2"></i>
                              {queue.openingTime} - {queue.closingTime}
                            </p>

                            <p className="small mb-3">
                              <i className="bi bi-people me-2"></i>
                              Capacity: {queue.maxCapacity}
                            </p>

                            <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                Current Token: #{queue.currentToken}
                              </small>

                              <div className="d-flex flex-wrap gap-2 justify-content-end">
                                {currentServingCustomer ? (
                                  <>
                                    <button
                                      className="btn btn-success btn-sm px-3"
                                      onClick={() => handleComplete(queue)}
                                      disabled={actionLoading}
                                    >
                                      <i className="bi bi-check-lg me-1"></i>
                                      {actionLoading
                                        ? "Processing..."
                                        : "Complete"}
                                    </button>

                                    <button
                                      className="btn btn-warning btn-sm px-3"
                                      onClick={() => handleSkip(queue)}
                                      disabled={actionLoading}
                                    >
                                      <i className="bi bi-skip-forward-fill me-1"></i>
                                      {actionLoading ? "Processing..." : "Skip"}
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="btn btn-primary btn-sm px-3"
                                    onClick={handleNext}
                                    disabled={
                                      actionLoading ||
                                      !selectedQueue ||
                                      selectedQueue.status !== "open" ||
                                      waitingCustomers.length === 0
                                    }
                                  >
                                    {actionLoading
                                      ? "Processing..."
                                      : "Next Customer"}
                                  </button>
                                )}
                                <button
                                  className={`btn btn-sm px-3 ${
                                    queue.status === "paused"
                                      ? "btn-warning"
                                      : "btn-outline-secondary"
                                  }`}
                                  onClick={() => handlePauseResume(queue)}
                                >
                                  <i
                                    className={`bi ${
                                      queue.status === "paused"
                                        ? "bi-play-fill"
                                        : "bi-pause-fill"
                                    } me-1`}
                                  ></i>

                                  {queue.status === "paused"
                                    ? "Resume"
                                    : "Pause"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Quick Actions</h4>

                <Link to="/create-queue" className="btn btn-primary w-100 mb-3">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Queue
                </Link>

                <button
                  className="btn btn-outline-dark w-100 mb-3"
                  onClick={() =>
                    selectedQueue && handlePauseResume(selectedQueue)
                  }
                  disabled={!selectedQueue || actionLoading}
                >
                  <i className="bi bi-pause-circle me-2"></i>
                  {selectedQueue?.status === "paused"
                    ? "Resume Queue"
                    : "Pause Queue"}
                </button>

                <button
                  className="btn btn-outline-primary w-100 mb-3"
                  onClick={() =>
                    selectedQueue && handleEditQueue(selectedQueue)
                  }
                  disabled={!selectedQueue}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Queue Details
                </button>

                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() =>
                    selectedQueue && handleDeleteQueue(selectedQueue)
                  }
                  disabled={!selectedQueue}
                >
                  <i className="bi bi-trash3 me-2"></i>
                  Delete Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Queue Modal */}
      {showEditModal && editQueue && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleUpdateQueue}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Queue Details
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditQueue(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    {/* Queue Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Queue Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={editQueue.queueName || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            queueName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Service Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Service Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={editQueue.serviceName || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            serviceName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Description
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        value={editQueue.description || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>

                    {/* Location */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">Location</label>

                      <input
                        type="text"
                        className="form-control"
                        value={editQueue.location || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            location: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Opening Time */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Opening Time
                      </label>

                      <input
                        type="time"
                        className="form-control"
                        value={editQueue.openingTime || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            openingTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Closing Time */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Closing Time
                      </label>

                      <input
                        type="time"
                        className="form-control"
                        value={editQueue.closingTime || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            closingTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Average Service Time */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Average Service Time
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={editQueue.averageServiceTime || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            averageServiceTime: e.target.value,
                          })
                        }
                        required
                      />

                      <small className="text-muted">Minutes per customer</small>
                    </div>

                    {/* Maximum Capacity */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Maximum Capacity
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={editQueue.maxCapacity || ""}
                        onChange={(e) =>
                          setEditQueue({
                            ...editQueue,
                            maxCapacity: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditQueue(null);
                    }}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={editLoading}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
