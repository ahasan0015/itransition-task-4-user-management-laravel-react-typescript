import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../src/config/axios";

interface User {
  id: number;
  name: string;
  title: string;
  email: string;
  status: string;
  last_seen: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === users.length ? [] : users.map((u) => u.id),
    );
  };

  return (
    <div className="container-fluid mt-4 px-3">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold h5">User Management</h3>
        <Link to="/login" className="btn btn-sm btn-outline-danger">
          Logout
        </Link>
      </div>

      <div className="card border shadow-sm">
        {/* Toolbar */}
        <div className="card-header bg-white p-3 d-flex flex-wrap gap-2 align-items-center">
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-primary" title="Block">
              <i className="bi bi-lock-fill"></i> Block
            </button>
            <button className="btn btn-sm btn-outline-secondary" title="Unlock">
              <i className="bi bi-unlock-fill"></i>
            </button>
            <button className="btn btn-sm btn-outline-danger" title="Delete">
              <i className="bi bi-trash-fill"></i>
            </button>
            <button className="btn btn-sm btn-outline-warning" title="Sweep">
              <i className="bi bi-brush"></i>
            </button>
          </div>
          <input
            type="text"
            className="form-control form-control-sm ms-auto"
            style={{ maxWidth: "150px" }}
            placeholder="Filter"
          />
        </div>

        {/* Responsive Table Wrapper with both scrollbars */}
        <div
          className="table-responsive"
          style={{ maxHeight: "500px", overflowY: "auto", overflowX: "auto" }}
        >
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
              <tr>
                <th style={{ width: "40px" }} className="px-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={toggleSelectAll}
                    checked={
                      selectedIds.length === users.length && users.length > 0
                    }
                  />
                </th>
                <th style={{ minWidth: "150px" }}>Name</th>
                <th style={{ minWidth: "200px" }}>Email</th>
                <th style={{ minWidth: "100px" }}>Status</th>
                <th style={{ minWidth: "150px" }}>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={
                      selectedIds.includes(user.id) ? "table-primary" : ""
                    }
                  >
                    <td className="px-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>
                    <td>
                      <div className="fw-bold">{user.name}</div>
                      <small className="text-muted">
                        {user.title || "N/A"}
                      </small>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.status}</td>
                    <td>{user.last_seen}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
