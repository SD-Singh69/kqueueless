import React from "react";
import { Link } from "react-router-dom";

const OwnerProfile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/owner-dashboard" className="navbar-brand fw-bold fs-4">
            Queue<span className="text-primary">Less</span>
          </Link>

          <Link to="/owner-dashboard" className="btn btn-outline-light btn-sm">
            <i className="bi bi-arrow-left me-1"></i>
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Profile */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "90px",
                      height: "90px",
                    }}
                  >
                    <i className="bi bi-person fs-1"></i>
                  </div>

                  <h3 className="fw-bold mb-1">Owner Profile</h3>

                  <p className="text-muted mb-0">
                    Manage your account information
                  </p>
                </div>

                {/* Profile Details */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-person me-2"></i>
                        Name
                      </small>

                      <strong>{user.name || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-envelope me-2"></i>
                        Email
                      </small>

                      <strong>{user.email || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-telephone me-2"></i>
                        Phone
                      </small>

                      <strong>{user.phone || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-shop me-2"></i>
                        Business
                      </small>

                      <strong>{user.shopName || "Not available"}</strong>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <small className="text-muted d-block mb-1">
                        <i className="bi bi-shield-check me-2"></i>
                        Account Type
                      </small>

                      <span className="badge bg-primary">Owner</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <Link to="/owner-dashboard" className="btn btn-primary">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
