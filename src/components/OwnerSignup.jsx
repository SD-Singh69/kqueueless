import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OwnerSignup = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    ownerName: "",
    shopName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async (credential) => {
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
          body: JSON.stringify({
            credential,
          }),
        },
      );

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
      console.error("Google login error:", error);
      setError(error.message || "Google login failed");
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

    setError("");

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/owner/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerName: credentials.ownerName,
            shopName: credentials.shopName,
            email: credentials.email,
            phone: credentials.phone,
            password: credentials.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Owner registration failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/owner-dashboard");
    } catch (error) {
      console.error("Owner signup error:", error);
      setError(error.message || "Owner registration failed");
    } finally {
      setLoading(false);
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

          <Link to="/owner-login" className="btn btn-outline-dark">
            Owner Login
          </Link>
        </div>
      </nav>

      {/* Signup */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                {/* Heading */}
                <div className="text-center mb-4">
                  <div
                    className="bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: "75px",
                      height: "75px",
                    }}
                  >
                    <i className="bi bi-shop fs-1"></i>
                  </div>

                  <h2 className="fw-bold">Create Shop Owner Account</h2>

                  <p className="text-muted">
                    Register your business with QueueLess
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Owner Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Owner Name</label>

                    <input
                      type="text"
                      name="ownerName"
                      className="form-control form-control-lg"
                      placeholder="Enter your full name"
                      value={credentials.ownerName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Shop Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Shop / Business Name
                    </label>

                    <input
                      type="text"
                      name="shopName"
                      className="form-control form-control-lg"
                      placeholder="Enter your shop name"
                      value={credentials.shopName}
                      onChange={handleChange}
                      required
                    />
                  </div>

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

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-lg"
                      placeholder="Enter your phone number"
                      value={credentials.phone}
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
                      placeholder="Create a password"
                      value={credentials.password}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-lg"
                      placeholder="Confirm your password"
                      value={credentials.confirmPassword}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />
                  </div>

                  {/* Terms */}
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                      required
                    />

                    <label className="form-check-label" htmlFor="terms">
                      I agree to the QueueLess terms and conditions
                    </label>
                  </div>

                  {/* Create Account */}
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Shop Owner Account"}
                  </button>
                </form>

                {/* Google */}
                <div className="text-center my-3">
                  <span className="text-muted">OR</span>
                </div>

                <div
                  id="googleOwnerButton"
                  className="d-flex justify-content-center w-100"
                ></div>

                {/* Login */}
                <div className="text-center mt-4">
                  <span className="text-muted">
                    Already have an owner account?{" "}
                  </span>

                  <Link
                    to="/owner-login"
                    className="text-decoration-none fw-semibold"
                  >
                    Login
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

export default OwnerSignup;
