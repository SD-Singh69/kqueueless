import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Home Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Queue<span className="text-primary">Less</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#homeNavbar"
            aria-controls="homeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="homeNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <li className="nav-item">
                <a className="nav-link active" href="#home">
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">
                  How It Works
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
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

      {/* Hero Section */}
      <section id="home" className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            {/* Left */}
            <div className="col-lg-7">
              <span className="badge text-bg-primary mb-3 px-3 py-2">
                Smart Queue Management
              </span>

              <h1 className="display-3 fw-bold">
                Wait Less.
                <br />
                <span className="text-primary">Live More.</span>
              </h1>

              <p className="lead text-secondary mt-4">
                QueueLess helps you join queues digitally, track your position
                in real time, and get notified when your turn is approaching.
              </p>

              <div className="d-flex gap-3 mt-4">
                <Link to="/join-queue" className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-ticket-perforated me-2"></i>
                  Join a Queue
                </Link>

                <a
                  href="#how-it-works"
                  className="btn btn-outline-dark btn-lg px-4"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right - Queue Card */}
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <small className="text-secondary">Current Queue</small>

                      <h4 className="fw-bold">City Hospital</h4>
                    </div>

                    <span className="badge text-bg-success h-100">Live</span>
                  </div>

                  <div className="text-center my-4">
                    <small className="text-secondary">Your Token</small>

                    <h1 className="display-1 fw-bold text-primary">#24</h1>

                    <p className="text-secondary">7 people ahead of you</p>
                  </div>

                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar"
                      style={{ width: "65%" }}
                    ></div>
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-secondary">Queue Progress</small>

                    <small className="fw-semibold">~18 min</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold">SIMPLE PROCESS</span>

            <h2 className="fw-bold mt-2">How QueueLess Works</h2>

            <p className="text-secondary">
              Join and manage queues without standing in line.
            </p>
          </div>

          <div className="row g-4">
            {/* Step 1 */}
            <div className="col-md-4">
              <div className="text-center px-3">
                <div
                  className="bg-primary-subtle text-primary
                                rounded-circle d-inline-flex
                                align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <i className="bi bi-qr-code fs-2"></i>
                </div>

                <h4 className="fw-bold mt-4">Scan</h4>

                <p className="text-secondary">
                  Scan the QR code provided by the business or service.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-md-4">
              <div className="text-center px-3">
                <div
                  className="bg-success-subtle text-success
                                rounded-circle d-inline-flex
                                align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <i className="bi bi-ticket-perforated fs-2"></i>
                </div>

                <h4 className="fw-bold mt-4">Get Your Token</h4>

                <p className="text-secondary">
                  Get a digital token and leave the physical queue.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-md-4">
              <div className="text-center px-3">
                <div
                  className="bg-warning-subtle text-warning
                                rounded-circle d-inline-flex
                                align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <i className="bi bi-bell fs-2"></i>
                </div>

                <h4 className="fw-bold mt-4">Get Notified</h4>

                <p className="text-secondary">
                  Track your position and know when your turn is near.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-primary fw-semibold">FEATURES</span>

            <h2 className="fw-bold mt-2">Everything You Need</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="bi bi-clock-history text-primary fs-1"></i>

                  <h5 className="fw-bold mt-3">Real-Time Tracking</h5>

                  <p className="text-secondary mb-0">
                    Track your queue position in real time.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="bi bi-bell text-primary fs-1"></i>

                  <h5 className="fw-bold mt-3">Notifications</h5>

                  <p className="text-secondary mb-0">
                    Know when your turn is approaching.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="bi bi-qr-code text-primary fs-1"></i>

                  <h5 className="fw-bold mt-3">QR Joining</h5>

                  <p className="text-secondary mb-0">
                    Join queues quickly using a QR code.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <i className="bi bi-phone text-primary fs-1"></i>

                  <h5 className="fw-bold mt-3">Mobile Friendly</h5>

                  <p className="text-secondary mb-0">
                    Access your queue from any device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container py-4">
          <div className="bg-primary text-white rounded-4 p-5 text-center">
            <h2 className="fw-bold">Ready to skip the wait?</h2>

            <p className="mb-4">
              Join your first digital queue with QueueLess.
            </p>

            <Link to="/Signup" className="btn btn-light btn-lg px-4">
              Join a Queue
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-top py-4 bg-white">
        <div className="container">
          <div
            className="d-flex justify-content-between
                          align-items-center flex-wrap gap-3"
          >
            <span className="fw-bold">
              Queue<span className="text-primary">Less</span>
            </span>

            <small className="text-secondary">
              © 2026 QueueLess. All rights reserved.
            </small>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
