import React from "react";
import { Link } from "react-router-dom";

const RoleSelection = () => {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Welcome to Queue<span className="text-primary">Less</span>
          </h1>

          <p className="text-muted fs-5">
            How would you like to use QueueLess?
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {/* Customer */}
          <div className="col-md-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-5">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-person fs-1 text-primary"></i>
                </div>

                <h3 className="fw-bold">Customer</h3>

                <p className="text-muted">
                  Join queues, check your position, and get notified when your
                  turn is approaching.
                </p>

                <Link to="/login" className="btn btn-primary btn-lg w-100 mt-3">
                  Continue as Customer
                </Link>
              </div>
            </div>
          </div>

          {/* Shop Owner */}
          <div className="col-md-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-5">
                <div
                  className="bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-shop fs-1"></i>
                </div>

                <h3 className="fw-bold">Shop Owner</h3>

                <p className="text-muted">
                  Create and manage your queues, serve customers, and monitor
                  your business.
                </p>

                <Link
                  to="/owner-login"
                  className="btn btn-dark btn-lg w-100 mt-3"
                >
                  Continue as Shop Owner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
