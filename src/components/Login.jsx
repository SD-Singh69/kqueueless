import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // google login
  const handleGoogleLogin = async (credential) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      if (data.user.role !== "customer") {
        setError("This Google account is registered as an owner.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // google auth
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

        callback: (response) => {
          handleGoogleLogin(response.credential);
        },
      });

      const googleButton = document.getElementById("googleButton");

      if (googleButton) {
        window.google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Make sure this login belongs to a customer
      if (data.user.role !== "customer") {
        setError("This login is for customers only.");
        return;
      }

      // Save authentication information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Go to customer dashboard
      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Queue<span className="text-primary">Less</span>
          </Link>

          <div className="ms-auto">
            <span className="text-secondary me-2 d-none d-sm-inline">
              Don't have an account?
            </span>

            <Link to="/signup" className="btn btn-outline-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Section */}
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
                    <i className="bi bi-person fs-2"></i>
                  </div>

                  <h2 className="fw-bold mb-2">Welcome Back</h2>

                  <p className="text-secondary mb-0">
                    Login to continue using QueueLess
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
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

                  {/* Password */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <label
                        htmlFor="password"
                        className="form-label fw-semibold"
                      >
                        Password
                      </label>

                      {/* <Link
                        to="/forgot-password"
                        className="small text-decoration-none"
                      >
                        Forgot Password?
                      </Link> */}
                    </div>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-lock"></i>
                      </span>

                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember"
                    />

                    <label
                      className="form-check-label text-secondary"
                      htmlFor="remember"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Login Button */}
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
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
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
                  id="googleButton"
                  className="d-flex justify-content-center w-100"
                ></div>

                {/* Signup */}
                <p className="text-center text-secondary mt-4 mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    Create one
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

export default Login;
