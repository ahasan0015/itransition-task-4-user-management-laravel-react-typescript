// pages/NotFound.tsx
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 text-center">
          {/* Error Code */}
          <div className="mb-4">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <div className="display-6 text-muted">Page Not Found</div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <p className="lead text-muted">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-muted">
              It might have been moved or deleted.
            </p>
          </div>

          {/* Actions */}
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/" className="btn btn-primary btn-lg px-5">
              Go Home
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg px-5">
              Sign In
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-5">
            <small className="text-muted">
              Need help?{' '}
              <Link to="/contact" className="text-primary text-decoration-none">
                Contact Support
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;