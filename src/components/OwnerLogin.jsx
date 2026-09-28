import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OwnerLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const handleGoogleLogin = async (credential) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      // Only allow owner accounts
      if (data.user.role !== "owner") {
        throw new Error("This Google account is not registered as an owner.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/owner-dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          handleGoogleLogin(response.credential);
        },
      });

      const googleButton = document.getElementById("googleOwnerButton");

      if (googleButton) {
        googleButton.innerHTML = "";

        window.google.accounts.id.renderButton(googleButton, {
          theme: "outline",
          size: "large",
          width: 350,
          text: "continue_with",
        });
      }
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        window.location.href = "/owner-dashboard";
      } else {
        console.error("LOGIN FAILED:", data.message);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-4">
            Queue<span className="text-primary">Less</span>
          </Link>

          <Link to="/owner-signup" className="btn btn-outline-primary">
            Owner Sign-In
          </Link>
        </div>
      </nav>

      {/* Login Section */}
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                {/* Icon */}
                <div className="text-center mb-4">
                  <div
                    className="bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "75px", height: "75px" }}
                  >
                    <i className="bi bi-shop fs-1"></i>
                  </div>

                  <h2 className="fw-bold">Shop Owner Login</h2>

                  <p className="text-muted">
                    Login to manage your queues and business
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>

                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Remember + Forgot */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />

                      <label className="form-check-label" htmlFor="remember">
                        Remember me
                      </label>
                    </div>

                    {/* <a href="#" className="text-decoration-none">
                      Forgot Password?
                    </a> */}
                  </div>

                  {/* Login */}
                  <button type="submit" className="btn btn-dark btn-lg w-100">
                    Login as Shop Owner
                  </button>
                </form>

                {/* Signup */}
                <div className="text-center mt-4">
                  <span className="text-muted">
                    Don't have a shop owner account?{" "}
                  </span>

                  <Link
                    to="/owner-signup"
                    className="text-decoration-none fw-semibold"
                  >
                    Create Account
                  </Link>
                </div>

                {/* google Login */}
                <div
                  id="googleOwnerButton"
                  className="d-flex justify-content-center w-100 m-2"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
