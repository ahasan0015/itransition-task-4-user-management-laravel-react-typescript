import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Swal from 'sweetalert2'; // SweetAlert2 import

//Toast configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/login", { ...credentials, remember });
      localStorage.setItem("token", response.data.token);
      
      // Success toast
      Toast.fire({ icon: 'success', title: 'Logged in successfully!' });
      
      navigate("/users");
    } catch (error: any) {
      // Error toast
      Toast.fire({ 
        icon: 'error', 
        title: error.response?.data?.error || "Invalid email or password!" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex bg-white select-none" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="row g-0 w-100">
        <div className="col-12 col-md-6 d-flex flex-column justify-content-between p-5 min-vh-100">
          <div className="mb-4">
            <h3 className="fw-bold text-primary tracking-wider" style={{ letterSpacing: "1.5px", fontSize: "24px" }}>THE APP</h3>
          </div>

          <div className="mx-auto w-100 my-auto" style={{ maxWidth: "380px" }}>
            <div className="mb-4">
              <small className="text-muted d-block mb-1 fs-6">Start your journey</small>
              <h2 className="fw-bold text-dark" style={{ letterSpacing: "-0.5px", fontSize: "32px" }}>Sign In to The App</h2>
            </div>

            <form onSubmit={handleLogin}>
              {/* E-mail Field */}
              <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                <label className="text-muted d-block small mb-0" style={{ fontSize: "11px", fontWeight: "500" }}>E-mail</label>
                <input 
                  type="email" 
                  className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark" 
                  placeholder="test@example.com"
                  required 
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>

              {/* Password Field */}
              <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                <label className="text-muted d-block small mb-0" style={{ fontSize: "11px", fontWeight: "500" }}>Password</label>
                <div className="d-flex align-items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark" 
                    placeholder="••••••••"
                    required 
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                  <span 
                    className="text-muted ms-2" 
                    style={{ cursor: "pointer", fontSize: "16px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </div>
              </div>

              {/* Remember Me */}
              <div className="mb-3 d-flex align-items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="form-check-input mt-0"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="ms-2 text-muted" style={{ fontSize: "13px" }}>Remember me</label>
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-semibold py-2 rounded" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="d-flex justify-content-between align-items-center w-100 mt-4" style={{ fontSize: "13px" }}>
            <span className="text-muted">
              Don't have an account? <Link to="/register" className="text-primary text-decoration-underline fw-medium">Sign up</Link>
            </span>
          </div>
        </div>

        {/* Right Geometric Background */}
        <div className="col-12 col-md-6 d-none d-md-block position-relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh" }}>
          <div className="position-absolute w-100 h-100" style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(109, 40, 217, 0.1) 100%)" }}></div>
        </div>
      </div>
    </div>
  );
}