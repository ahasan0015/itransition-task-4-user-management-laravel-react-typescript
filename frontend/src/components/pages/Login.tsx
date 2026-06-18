import { Link } from "react-router-dom";

export default function Login() {
    return (
        <div className="container-fluid p-0 min-vh-100 d-flex bg-white select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div className="row g-0 w-100">
                
                {/* ─── বাম কলাম: সাইন-ইন ফর্ম ─── */}
                <div className="col-12 col-md-6 d-flex flex-column justify-content-between p-5 min-vh-100">
                    
                    {/* লোগো সেকশন */}
                    <div className="mb-4">
                        <h3 className="fw-bold text-primary tracking-wider" style={{ letterSpacing: '1.5px', fontSize: '24px' }}>
                            THE APP
                        </h3>
                    </div>

                    {/* মেইন ফর্ম হোল্ডার */}
                    <div className="mx-auto w-100 my-auto" style={{ maxWidth: '380px' }}>
                        <div className="mb-4">
                            <small className="text-muted d-block mb-1 fs-6">Start your journey</small>
                            <h2 className="fw-bold text-dark" style={{ letterSpacing: '-0.5px', fontSize: '32px' }}>Sign In to The App</h2>
                        </div>

                        <form onSubmit={(e) => e.preventDefault()}>
                            {/* ইমেইল ফিল্ড */}
                            <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                                <label className="text-muted d-block small mb-0" style={{ fontSize: '11px', fontWeight: '500' }}>E-mail</label>
                                <div className="d-flex align-items-center">
                                    <input 
                                        type="email" 
                                        className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark" 
                                        placeholder="test@example.com"
                                        required 
                                    />
                                    <span className="text-muted ms-2" style={{ fontSize: '18px' }}>✉</span>
                                </div>
                            </div>

                            {/* পাসওয়ার্ড ফিল্ড */}
                            <div className="mb-3 border rounded p-2 bg-light bg-opacity-25">
                                <label className="text-muted d-block small mb-0" style={{ fontSize: '11px', fontWeight: '500' }}>Password</label>
                                <div className="d-flex align-items-center">
                                    <input 
                                        type="password" 
                                        className="form-control border-0 p-0 bg-transparent shadow-none fs-6 text-dark" 
                                        placeholder="••••••••"
                                        required 
                                    />
                                    <span className="text-muted ms-2" style={{ cursor: 'pointer', fontSize: '16px' }}>👁</span>
                                </div>
                            </div>

                            {/* রিমেম্বার মি চেকবক্স */}
                            <div className="mb-4 form-check d-flex align-items-center gap-2 ps-0">
                                <input 
                                    type="checkbox" 
                                    className="form-check-input border rounded mt-0" 
                                    id="rememberMe"
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                <label className="form-check-label text-secondary small" htmlFor="rememberMe" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                    Remember me
                                </label>
                            </div>

                            {/* সাইন ইন বাটন */}
                            <button type="submit" className="btn btn-primary w-100 fw-semibold py-2 rounded" style={{ fontSize: '15px' }}>
                                Sign In
                            </button>
                        </form>
                    </div>

                    {/* ফুটার লিঙ্ক সেকশন */}
                    <div className="d-flex justify-content-between align-items-center w-100 mt-4" style={{ fontSize: '13px' }}>
                        <span className="text-muted">
                            Don't have an account? <Link to="/register" className="text-primary text-decoration-underline fw-medium" style={{ cursor: 'pointer' }}>Sign up</Link>
                        </span>
                        <span className="text-primary text-decoration-underline fw-medium" style={{ cursor: 'pointer' }}>Forgot password?</span>
                    </div>
                </div>

                {/* ─── ডান কলাম: জ্যামিতিক ব্যাকগ্রাউন্ড ─── */}
                <div 
                    className="col-12 col-md-6 d-none d-md-block position-relative"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '100vh'
                    }}
                >
                    <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(109, 40, 217, 0.1) 100%)' }}></div>
                </div>
            </div>
        </div>
    );
}