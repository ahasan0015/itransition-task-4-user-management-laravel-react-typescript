import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios"; 

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            
            const response = await api.post('/register', formData);
            alert(response.data.message || "Registration successful!");
            navigate('/login');
        } catch (error: any) {
            alert(error.response?.data?.error || "Registration failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-0 min-vh-100 d-flex bg-white select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div className="row g-0 w-100">
                <div className="col-12 col-md-6 d-flex flex-column justify-content-between p-5 min-vh-100">
                    <div className="mb-4">
                        <h3 className="fw-bold text-primary tracking-wider" style={{ letterSpacing: '1.5px', fontSize: '24px' }}>THE APP</h3>
                    </div>

                    <div className="mx-auto w-100 my-auto" style={{ maxWidth: '380px' }}>
                        <div className="mb-4">
                            <small className="text-muted d-block mb-1 fs-6">Manage your workforce</small>
                            <h2 className="fw-bold text-dark" style={{ letterSpacing: '-0.5px', fontSize: '32px' }}>Create an Account</h2>
                        </div>

                        <form onSubmit={handleRegister}>
                            {/* Full Name */}
                            <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                                <label className="text-muted d-block small mb-0" style={{ fontSize: '11px', fontWeight: '500' }}>Full Name</label>
                                <input type="text" className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark" 
                                    placeholder="Ahasan Habib" required value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>

                            {/* E-mail */}
                            <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                                <label className="text-muted d-block small mb-0" style={{ fontSize: '11px', fontWeight: '500' }}>E-mail</label>
                                <input type="email" className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark" 
                                    placeholder="test@example.com" required value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>

                            {/* Password */}
                            <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                                <label className="text-muted d-block small mb-0" style={{ fontSize: '11px', fontWeight: '500' }}>Password</label>
                                <input type="password" className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark" 
                                    placeholder="••••••••" required value={formData.password} 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-semibold py-2 rounded" disabled={loading}>
                                {loading ? 'Processing...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>

                    <div className="d-flex justify-content-start align-items-center w-100 mt-4" style={{ fontSize: '13px' }}>
                        <span className="text-muted">
                            Already have an account? <Link to="/login" className="text-primary text-decoration-underline fw-medium">Sign in</Link>
                        </span>
                    </div>
                </div>

                <div className="col-12 col-md-6 d-none d-md-block position-relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(109, 40, 217, 0.1) 100%)' }}></div>
                </div>
            </div>
        </div>
    );
}