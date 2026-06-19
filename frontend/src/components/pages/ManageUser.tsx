import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../src/config/axios";
import * as bootstrap from "bootstrap";

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

  // data freshing function
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      // laraveel response structure handle 
      const userData = res.data.users || res.data;

      const formattedUsers = userData.map((user: any) => ({
        ...user,
        last_seen: user.last_login_time || "N/A",
      }));
      setUsers(formattedUsers);
    } catch (err: any) {
      console.error("API Error:", err.response?.status, err.message);
      if (err.response?.status === 401) {
        alert("Session expired! Please login again.");
        window.location.href = "/login"; 
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  //tooltip এর জন্য useEffect
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    const tooltipList = [...tooltipTriggerList].map(
      (el) => new bootstrap.Tooltip(el),
    );
    return () => tooltipList.forEach((t) => t.dispose());
  }, [users, selectedIds]);
  // Bulk Action Handler
  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;

    try {
      await api.post("/users/bulk-action", { ids: selectedIds, action });
      setSelectedIds([]);
      fetchUsers(); // server new data collection (Requirement #5)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      alert(`Action failed: ${errorMessage}`);
    }
  };

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold h5">User Management</h3>
        <Link to="/login" className="btn btn-sm btn-outline-danger">
          Logout
        </Link>
      </div>

      <div className="card border shadow-sm">
        {/* Toolbar Section */}
        <div className="card-header bg-white p-3 d-flex flex-wrap gap-2 align-items-center">
          <div className="btn-group">
            {/* Block Button */}
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Block Selected Users"
            >
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleBulkAction("block")}
                disabled={selectedIds.length === 0}
              >
                <i className="bi bi-lock-fill"></i>
              </button>
            </span>

            {/* Unblock Button */}
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Unblock Selected Users"
            >
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleBulkAction("unblock")}
                disabled={selectedIds.length === 0}
              >
                <i className="bi bi-unlock-fill"></i>
              </button>
            </span>

            {/* Delete Button */}
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Delete Selected Users"
            >
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleBulkAction("delete")}
                disabled={selectedIds.length === 0}
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            </span>

            {/* Delete Unverified Button */}
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Remove Unverified Users"
            >
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => handleBulkAction("delete_unverified")}
                disabled={selectedIds.length === 0}
              >
                <i className="bi bi-person-x-fill"></i>
              </button>
            </span>
          </div>

          {/* Filter (Right Aligned) */}
          <input
            type="text"
            className="form-control form-control-sm ms-auto"
            style={{ maxWidth: "180px" }}
            placeholder="Search users..."
            onChange={(e) => {
              /* এখানে সার্চ লজিক যোগ করুন */
            }}
          />
        </div>

        {/* Table Section */}
        <div
          className="table-responsive"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light sticky-top">
              <tr>
                <th style={{ width: "40px" }} className="px-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={toggleSelectAll}
                    // সিলেকশন লজিক ফিক্স
                    checked={
                      users.length > 0 && selectedIds.length === users.length
                    }
                    disabled={users.length === 0}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No users found.
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
                    <td>
                      {/* স্ট্যাটাস ব্যাজ যোগ করুন */}
                      <span
                        className={`badge ${user.status === "active" ? "bg-success" : "bg-warning"}`}
                      >
                        {user.status}
                      </span>
                    </td>
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
