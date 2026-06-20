import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../src/config/axios";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  last_login_time: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Pagination: 10 items per page
  const fetchUsers = async (page: number = 1, searchQuery: string = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=10&search=${searchQuery}`);
      const data = res.data.users || res.data;
      setUsers(data.data || data);
      setCurrentPage(data.current_page || 1);
      setLastPage(data.last_page || 1);
    } catch (err: any) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };
 
  // Tooltip Initializer:
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    const tooltipList = [...tooltipTriggerList].map(
      (el) => new bootstrap.Tooltip(el),
    );
    return () => tooltipList.forEach((t) => t.dispose());
  }, [users]);

  const handleBulkAction = async (action: string) => {
    if (action !== "delete_unverified" && selectedIds.length === 0) return;
    try {
      await api.post("/users/bulk-action", { ids: selectedIds, action });
      Toast.fire({ icon: "success", title: `Action '${action}' done.` });
      setSelectedIds([]);
      fetchUsers(currentPage);
    } catch (err: any) {
      Toast.fire({ icon: "error", title: "Action failed!" });
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      // logout api
      await api.post("/logout");

      // success toast
      Toast.fire({
        icon: "success",
        title: "Logged out successfully!",
      });
    } catch (error) {
      console.error("Logout failed", error);
      //
      Toast.fire({
        icon: "error",
        title: "Logout failed, redirecting...",
      });
    } finally {
      // token remove localStorage থ
      localStorage.removeItem("token");

      // navigate login page 
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage, search]);

  return (
    <div className="container-fluid mt-4 px-3">
      <div className="d-flex justify-content-between mb-4">
        <h3>User Management</h3>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white p-3 d-flex gap-2 align-items-center flex-wrap">
  {/* button group */}
  <div className="d-flex gap-2 flex-grow-1">
    <span data-bs-toggle="tooltip" data-bs-title="Block Selected">
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => handleBulkAction("block")}
        disabled={selectedIds.length === 0}
      >
        <i className="bi bi-lock-fill"></i> Block
      </button>
    </span>
    <span data-bs-toggle="tooltip" data-bs-title="Unblock Selected">
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => handleBulkAction("unblock")}
        disabled={selectedIds.length === 0}
      >
        <i className="bi bi-unlock-fill"></i>
      </button>
    </span>
    <span data-bs-toggle="tooltip" data-bs-title="Delete Selected">
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => handleBulkAction("delete")}
        disabled={selectedIds.length === 0}
      >
        <i className="bi bi-trash-fill"></i>
      </button>
    </span>
    <span data-bs-toggle="tooltip" data-bs-title="Delete Unverified">
      <button
        className="btn btn-sm btn-outline-warning"
        onClick={() => handleBulkAction("delete_unverified")}
      >
        <i className="bi bi-person-x-fill"></i>
      </button>
    </span>
  </div>

  {/* search box */}
  <div style={{ width: '200px' }}>
    <input
      type="text"
      className="form-control form-control-sm"
      placeholder="Search users..."
      value={search} 
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>

        {/* responsive table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-3" style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? users.map((u) => u.id) : [],
                      )
                    }
                  />
                </th>
                <th style={{ minWidth: "120px" }}>Name</th>
                <th style={{ minWidth: "150px" }}>Email</th>
                <th>Status</th>
                <th style={{ minWidth: "150px" }}>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.includes(user.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((i) => i !== user.id)
                              : [...prev, user.id],
                          )
                        }
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${user.status === "active" ? "bg-success" : "bg-warning"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{user.last_login_time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-white d-flex justify-content-between align-items-center">
          <small>
            Page {currentPage} of {lastPage}
          </small>
          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
