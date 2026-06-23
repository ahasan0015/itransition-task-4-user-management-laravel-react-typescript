import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Swal from "sweetalert2"; // Toast

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Toast Configuration
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      Toast.fire({ icon: "error", title: "Passwords do not match!" });
      return;
    }
    if (!formData.terms) {
      Toast.fire({ icon: "warning", title: "Please agree to the terms!" });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/register", formData);
      Toast.fire({
        icon: "success",
        title: response.data.message || "Registration successful!",
      });
      navigate("/login");
    } catch (error: any) {
      // 422 for validator
      if (error.response?.status === 422 && error.response.data?.errors) {
        const errors = error.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        Toast.fire({ icon: "error", title: errors[firstKey][0] });
      }
      //if server or newwork is shutdown
      else if (!error.response) {
        Toast.fire({
          icon: "error",
          title: "Server is currently unreachable. Please try again later.",
        });
      }
      // server error msg
      else if (error.response?.data?.message) {
        Toast.fire({ icon: "error", title: error.response.data.message });
      }
      else {
        Toast.fire({
          icon: "error",
          title: "An unexpected error occurred.",
        });
      }
    }
  };

  return (
    <div
      className="container-fluid p-0 min-vh-100 d-flex bg-white select-none"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="row g-0 w-100">
        <div className="col-12 col-md-6 d-flex flex-column justify-content-between p-5 min-vh-100">
          <div className="mb-4">
            <h3
              className="fw-bold text-primary tracking-wider"
              style={{ letterSpacing: "1.5px", fontSize: "24px" }}
            >
              THE APP
            </h3>
          </div>

          <div className="mx-auto w-100 my-auto" style={{ maxWidth: "380px" }}>
            <div className="mb-4">
              <small className="text-muted d-block mb-1 fs-6">
                Manage your workforce
              </small>
              <h2
                className="fw-bold text-dark"
                style={{ letterSpacing: "-0.5px", fontSize: "32px" }}
              >
                Create an Account
              </h2>
            </div>

            <form onSubmit={handleRegister}>
              <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                <label
                  className="text-muted d-block small mb-0"
                  style={{ fontSize: "11px", fontWeight: "500" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark"
                  placeholder="Ahasan Habib"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                <label
                  className="text-muted d-block small mb-0"
                  style={{ fontSize: "11px", fontWeight: "500" }}
                >
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark"
                  placeholder="test@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {/* Password Field */}
              <div className="mb-3 border rounded p-2 bg-light bg-opacity-25 d-flex align-items-center">
                <div className="flex-grow-1">
                  <label
                    className="text-muted d-block small mb-0"
                    style={{ fontSize: "11px", fontWeight: "500" }}
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} cursor-pointer text-muted`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-3 border rounded p-2 bg-light bg-opacity-25 d-flex align-items-center">
                <div className="flex-grow-1">
                  <label
                    className="text-muted d-block small mb-0"
                    style={{ fontSize: "11px", fontWeight: "500" }}
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark"
                    placeholder="••••••••"
                    required
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password_confirmation: e.target.value,
                      })
                    }
                  />
                </div>
                <i
                  className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} cursor-pointer text-muted`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  checked={formData.terms}
                  onChange={(e) =>
                    setFormData({ ...formData, terms: e.target.checked })
                  }
                />
                <label
                  className="form-check-label text-muted small"
                  htmlFor="terms"
                >
                  I agree to the terms and conditions
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold py-2 rounded"
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </form>
          </div>

          <div
            className="d-flex justify-content-start align-items-center w-100 mt-4"
            style={{ fontSize: "13px" }}
          >
            <span className="text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary text-decoration-underline fw-medium"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>

        <div
          className="col-12 col-md-6 d-none d-md-block position-relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(109, 40, 217, 0.1) 100%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
