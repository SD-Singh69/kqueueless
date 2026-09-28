import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });

    setError("");
  };
  // google signup
  const handleGoogleSignup = async (credential) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google signup failed");
      }

      if (data.user.role !== "customer") {
        setError("This Google account is registered as an owner.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Google signup error:", error);
      setError(error.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  //google auth
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id:
          "1052510175584-1c18mgfofo7k8h4gp8mcoe5gul3j9nos.apps.googleusercontent.com",
        callback: (response) => {
          handleGoogleSignup(response.credential);
        },
      });

      const googleButton = document.getElementById("googleSignupButton");

      if (googleButton) {
        window.google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
          width: 350,
          text: "continue_with",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/customer/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            phone: credentials.phone,
            password: credentials.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Queue<span className="text-primary">Less</span>
          </Link>

          <div className="ms-auto">
            <span className="text-secondary me-2 d-none d-sm-inline">
              Already have an account?
            </span>

            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Section */}
      <main className="container">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 73px)" }}
        >
          <div className="col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                {/* Heading */}
                <div className="text-center mb-4">
                  <div
                    className="bg-primary-subtle text-primary rounded-circle
                               d-inline-flex align-items-center
                               justify-content-center mb-3"
                    style={{ width: "65px", height: "65px" }}
                  >
                    <i className="bi bi-person-plus fs-2"></i>
                  </div>

                  <h2 className="fw-bold mb-2">Create Account</h2>

                  <p className="text-secondary mb-0">Join QueueLess today</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full Name
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-person"></i>
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={credentials.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-envelope"></i>
                      </span>

                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Phone Number
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-telephone"></i>
                      </span>

                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={credentials.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-lock"></i>
                      </span>

                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={credentials.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                      />
                    </div>

                    <small className="text-secondary">
                      Password must be at least 6 characters.
                    </small>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm Password
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-shield-lock"></i>
                      </span>

                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                        minLength="6"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                      required
                    />

                    <label
                      className="form-check-label text-secondary"
                      htmlFor="terms"
                    >
                      I agree to the terms and conditions
                    </label>
                  </div>

                  {/* Signup Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="d-flex align-items-center my-4">
                  <hr className="flex-grow-1" />

                  <span className="text-secondary small px-3">OR</span>

                  <hr className="flex-grow-1" />
                </div>

                {/* Google */}
                <div
                  id="googleSignupButton"
                  className="d-flex justify-content-center w-100"
                ></div>

                {/* Login */}
                <p className="text-center text-secondary mt-4 mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
