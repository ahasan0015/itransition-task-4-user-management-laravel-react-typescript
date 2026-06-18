import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ManageUsers() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // স্ট্যাটিক ইউজার ডেটা
  const users = [
    { id: 1, name: "Clare, Alex", title: "N/A", email: "a_clare42@gmail.com", status: "Active", last_seen: "5 minutes ago" },
    { id: 2, name: "Morrison, Jim", title: "CFO, Meta Platforms, Inc.", email: "dmtimer9@dealyaari.com", status: "Active", last_seen: "less than a minute ago" },
    { id: 3, name: "Simone, Nina", title: "Regional Manager, Amazon.com, Inc.", email: "marishabelin@giftcode-ao.com", status: "Blocked", last_seen: "3 weeks ago" },
    { id: 4, name: "Zappa, Frank", title: "Architect, Meta Platforms, Inc.", email: "zappa_f@citybank.com", status: "Unverified", last_seen: "less than a minute ago" },
  ];

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === users.length ? [] : users.map(u => u.id));
  };

  return (
    <div className="container mt-5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">User Management</h2>
          <p className="text-muted small mb-0">Overview of all registered users in system applications</p>
        </div>
        <Link to="/login" className="btn btn-outline-danger btn-sm">Logout 🚪</Link>
      </div>

      {/* Table Container */}
      <div className="card border rounded shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-primary btn-sm fw-medium px-3">🔒 Block</button>
            <button className="btn btn-outline-secondary btn-sm" style={{ width: '34px' }}>🔓</button>
            <button className="btn btn-outline-danger btn-sm" style={{ width: '34px' }}>🗑️</button>
            <button className="btn btn-outline-warning btn-sm" style={{ width: '34px' }}>🧹</button>
          </div>
          <input type="text" className="form-control form-control-sm" style={{ maxWidth: '240px' }} placeholder="Filter" />
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-nowrap">
            <thead className="table-light text-secondary">
              <tr style={{ fontSize: '14px' }}>
                <th className="py-3 px-4" style={{ width: '40px' }}>
                  <input type="checkbox" className="form-check-input" onChange={toggleSelectAll} checked={selectedIds.length === users.length && users.length > 0} />
                </th>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Status</th>
                <th className="py-3 px-4">Last seen</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {users.map((user) => (
                <tr key={user.id} className={selectedIds.includes(user.id) ? 'table-primary' : ''}>
                  <td className="py-3 px-4">
                    <input type="checkbox" className="form-check-input" checked={selectedIds.includes(user.id)} onChange={() => toggleSelect(user.id)} />
                  </td>
                  <td className="py-3">
                    <div className="fw-semibold text-dark">{user.name}</div>
                    <div className="text-muted small">{user.title}</div>
                  </td>
                  <td className="py-3 text-secondary">{user.email}</td>
                  <td className="py-3 text-dark fw-medium">{user.status}</td>
                  <td className="py-3 px-4 text-secondary">{user.last_seen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}