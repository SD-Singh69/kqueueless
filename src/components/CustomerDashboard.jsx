import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("User data error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    fetchQueues(token);
  }, [navigate]);

  const fetchQueues = async (token) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/queues", {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load queues");
      }

      setQueues(data.queues || []);
    } catch (error) {
      console.error("Queue loading error:", error);
      setError(error.message || "Unable to load queues");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const filteredQueues = queues.filter((queue) => {
    const searchText = search.toLowerCase();

    return (
      queue.queueName?.toLowerCase().includes(searchText) ||
      queue.serviceName?.toLowerCase().includes(searchText) ||
      queue.location?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/customer-dashboard">
            Queue<span className="text-primary">Less</span>
          </Link>

          <div className="d-flex align-items-center gap-3">
            {user && (
              <span className="text-secondary d-none d-md-block">
                Hi, <strong>{user.name}</strong>
              </span>
            )}

            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="container py-4">
        {/* Welcome */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            Welcome{user ? `, ${user.name}` : ""}
          </h2>

          <p className="text-secondary mb-0">
            Find a queue and save your time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary-subtle text-primary rounded-3
                                  d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i className="bi bi-search fs-4"></i>
                  </div>

                  <div className="ms-3">
                    <h5 className="fw-bold mb-1">Find a Queue</h5>

                    <p className="text-secondary mb-0">
                      Browse available queues below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-success-subtle text-success rounded-3
                                  d-flex align-items-center justify-content-center"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i className="bi bi-ticket-perforated fs-4"></i>
                  </div>

                  <div className="ms-3">
                    <h5 className="fw-bold mb-1">My Queue</h5>

                    <p className="text-secondary mb-0">
                      Your active queue will appear here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Search Queue */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-search text-primary me-2"></i>
              Find a Queue
            </h5>

            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder="Search hospital, salon, bank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearch("")}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Available Queues */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold mb-1">Available Queues</h4>

            <p className="text-secondary mb-0">
              Choose a queue to view its details.
            </p>
          </div>

          <button
            className="btn btn-outline-primary"
            onClick={() => fetchQueues(localStorage.getItem("token"))}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>

            <p className="text-secondary mt-3 mb-0">Loading queues...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* No queues */}
        {!loading && !error && queues.length === 0 && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center py-5">
              <i className="bi bi-inbox fs-1 text-secondary"></i>

              <h5 className="fw-bold mt-3">No queues available</h5>

              <p className="text-secondary mb-0">
                There are currently no open queues.
              </p>
            </div>
          </div>
        )}
        {!loading &&
          !error &&
          queues.length > 0 &&
          filteredQueues.length === 0 && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5">
                <i className="bi bi-search fs-1 text-secondary"></i>

                <h5 className="fw-bold mt-3">No queues found</h5>

                <p className="text-secondary mb-0">
                  Try searching for another hospital, salon, bank, service, or
                  location.
                </p>
              </div>
            </div>
          )}
        {/* Queue Cards */}
        {!loading && !error && filteredQueues.length > 0 && (
          <div className="row g-4">
            {filteredQueues.map((queue) => {
              const waitingCustomers =
                queue.customers?.filter(
                  (customer) => customer.status === "waiting",
                ).length || 0;

              return (
                <div className="col-md-6 col-lg-4" key={queue._id}>
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div
                        className="d-flex justify-content-between
                                      align-items-start mb-3"
                      >
                        <div
                          className="bg-primary-subtle text-primary
                                     rounded-3 d-flex align-items-center
                                     justify-content-center"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          <i className="bi bi-shop fs-4"></i>
                        </div>

                        <span className="badge text-bg-success">Open</span>
                      </div>

                      <h5 className="fw-bold mb-1">{queue.queueName}</h5>

                      <p className="text-primary mb-3">{queue.serviceName}</p>

                      {queue.description && (
                        <p className="text-secondary small">
                          {queue.description}
                        </p>
                      )}

                      <div className="small text-secondary mb-3">
                        <div className="mb-2">
                          <i className="bi bi-geo-alt me-2"></i>
                          {queue.location}
                        </div>

                        <div className="mb-2">
                          <i className="bi bi-clock me-2"></i>
                          {queue.openingTime} - {queue.closingTime}
                        </div>

                        <div>
                          <i className="bi bi-people me-2"></i>
                          {waitingCustomers} waiting
                        </div>
                      </div>

                      <div className="border-top pt-3 mb-3">
                        <div
                          className="d-flex justify-content-between
                                        small"
                        >
                          <span className="text-secondary">Avg. service</span>

                          <strong>{queue.averageServiceTime} min</strong>
                        </div>

                        <div
                          className="d-flex justify-content-between
                                        small mt-2"
                        >
                          <span className="text-secondary">Capacity</span>

                          <strong>{queue.maxCapacity}</strong>
                        </div>
                      </div>

                      <Link
                        to={`/view-queue/${queue._id}`}
                        className="btn btn-primary w-100"
                      >
                        View Queue
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
