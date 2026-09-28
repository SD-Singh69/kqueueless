import React, { useState } from "react";
import { Link } from "react-router-dom";

const JoinQueue = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Queue<span className="text-primary">Less</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#joinNavbar"
            aria-controls="joinNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="joinNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/join-queue">
                  Join Queue
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-primary px-4" to="/signup">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-5">
        {/* Heading */}
        <div className="text-center mb-5">
          <span className="badge text-bg-primary px-3 py-2 mb-3">
            <i className="bi bi-ticket-perforated me-2"></i>
            Join a Queue
          </span>

          <h1 className="fw-bold display-5">Find a Queue</h1>

          <p className="text-secondary lead">
            Search for a business or service and join its queue digitally.
          </p>
        </div>

        {/* Search */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7">
            <div className="input-group input-group-lg shadow-sm">
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

              <button className="btn btn-primary px-4">Search</button>
            </div>
          </div>
        </div>

        {/* QR Option */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary-subtle text-primary rounded-3 p-3 me-3">
                    <i className="bi bi-qr-code-scan fs-2"></i>
                  </div>

                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">Have a QueueLess QR code?</h5>

                    <p className="text-secondary mb-0">
                      Scan the QR code provided at the location.
                    </p>
                  </div>

                  <button className="btn btn-outline-primary">Scan QR</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Queues */}
        <div className="mb-4">
          <h3 className="fw-bold">Popular Queues</h3>

          <p className="text-secondary">
            Choose a service to see available queues.
          </p>
        </div>

        <div className="row g-4">
          {/* Hospital */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div className="bg-danger-subtle text-danger rounded-3 p-3">
                    <i className="bi bi-hospital fs-3"></i>
                  </div>

                  <span className="badge text-bg-success h-100">Open</span>
                </div>

                <h5 className="fw-bold mt-4">City Hospital</h5>

                <p className="text-secondary">General consultation</p>

                <div className="d-flex justify-content-between mb-3">
                  <small className="text-secondary">
                    <i className="bi bi-people me-1"></i>
                    12 people
                  </small>

                  <small className="text-secondary">
                    <i className="bi bi-clock me-1"></i>
                    ~25 min
                  </small>
                </div>

                <button className="btn btn-primary w-100">View Queue</button>
              </div>
            </div>
          </div>

          {/* Salon */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div className="bg-warning-subtle text-warning rounded-3 p-3">
                    <i className="bi bi-scissors fs-3"></i>
                  </div>

                  <span className="badge text-bg-success h-100">Open</span>
                </div>

                <h5 className="fw-bold mt-4">Style Studio</h5>

                <p className="text-secondary">Hair & grooming</p>

                <div className="d-flex justify-content-between mb-3">
                  <small className="text-secondary">
                    <i className="bi bi-people me-1"></i>5 people
                  </small>

                  <small className="text-secondary">
                    <i className="bi bi-clock me-1"></i>
                    ~15 min
                  </small>
                </div>

                <button className="btn btn-primary w-100">View Queue</button>
              </div>
            </div>
          </div>

          {/* Bank */}
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div className="bg-success-subtle text-success rounded-3 p-3">
                    <i className="bi bi-bank fs-3"></i>
                  </div>

                  <span className="badge text-bg-success h-100">Open</span>
                </div>

                <h5 className="fw-bold mt-4">City Bank</h5>

                <p className="text-secondary">Customer service</p>

                <div className="d-flex justify-content-between mb-3">
                  <small className="text-secondary">
                    <i className="bi bi-people me-1"></i>8 people
                  </small>

                  <small className="text-secondary">
                    <i className="bi bi-clock me-1"></i>
                    ~20 min
                  </small>
                </div>

                <button className="btn btn-primary w-100">View Queue</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <span className="fw-bold">
              Queue<span className="text-primary">Less</span>
            </span>

            <small className="text-secondary">© 2026 QueueLess</small>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JoinQueue;
