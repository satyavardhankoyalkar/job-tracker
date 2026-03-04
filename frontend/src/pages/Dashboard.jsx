import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const STATUS_CONFIG = {
  Applied:   { color: "#6366f1", bg: "rgba(99,102,241,0.15)",  dot: "#6366f1" },
  Interview: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", dot: "#f59e0b" },
  Offer:     { color: "#10b981", bg: "rgba(16,185,129,0.15)", dot: "#10b981" },
  Rejected:  { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  dot: "#ef4444" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Applied"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}30`,
      borderRadius: "999px", padding: "3px 10px",
      fontSize: "12px", fontWeight: 600, letterSpacing: "0.03em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: "rgba(18,18,28,0.7)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14,
      padding: "20px 24px",
      backdropFilter: "blur(12px)",
      flex: 1,
      minWidth: 120,
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: accent || "#fff" }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const token = localStorage.getItem("token");

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchApplications = async () => {
    const res = await API.get("/applications", authHeader);
    setApplications(res.data);
  };

  const addApplication = async () => {
    if (!company) return;
    setLoading(true);
    await API.post("/applications", { company, status, notes }, authHeader);
    resetForm();
    await fetchApplications();
    setLoading(false);
  };

  const deleteApplication = async (id) => {
    setDeleteId(id);
    await API.delete(`/applications/${id}`, authHeader);
    setDeleteId(null);
    fetchApplications();
  };

  const startEdit = (app) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditId(app.id);
    setCompany(app.company);
    setStatus(app.status);
    setNotes(app.notes);
  };

  const updateApplication = async () => {
    setLoading(true);
    await API.put(`/applications/${editId}`, { company, status, notes }, authHeader);
    resetForm();
    await fetchApplications();
    setLoading(false);
  };

  const resetForm = () => {
    setEditId(null);
    setCompany("");
    setStatus("Applied");
    setNotes("");
  };

  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      editId ? updateApplication() : addApplication();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => { fetchApplications(); }, []);

  const counts = {
    total: applications.length,
    applied: applications.filter(a => a.status === "Applied").length,
    interview: applications.filter(a => a.status === "Interview").length,
    offer: applications.filter(a => a.status === "Offer").length,
    rejected: applications.filter(a => a.status === "Rejected").length,
  };

  const filteredApplications = applications.filter(a => {
    const matchSearch = a.company.toLowerCase().includes(search.toLowerCase()) ||
      (a.notes && a.notes.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .dash-root {
          min-height: 100vh;
          background: #0a0a0f;
          padding: 0 0 60px;
          position: relative;
          overflow-x: hidden;
        }

        .dash-root::before {
          content: '';
          position: fixed;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%);
          top: -250px; right: -200px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .topbar {
          background: rgba(10,10,15,0.9);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          position: sticky; top: 0; z-index: 100;
          padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }

        .brand {
          display: flex; align-items: center; gap: 12px;
        }

        .brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }

        .brand-icon svg { width: 18px; height: 18px; fill: white; }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .logout-btn {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          display: flex; align-items: center; gap: 6px;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.4);
        }

        .dash-content {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px 0;
        }

        .page-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.8px;
          margin-bottom: 6px;
        }

        .page-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          margin-bottom: 32px;
        }

        .stats-row {
          display: flex;
          gap: 14px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .form-card {
          background: rgba(18,18,28,0.7);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px 28px;
          margin-bottom: 28px;
          backdrop-filter: blur(12px);
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }

        .form-title-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 2fr auto;
          gap: 12px;
          align-items: end;
        }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
        }

        .field-group label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 7px;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .field-input::placeholder { color: rgba(255,255,255,0.2); }

        .field-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        select.field-input option { background: #1a1a2e; }

        .action-btn {
          padding: 10px 22px;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
          height: 40px;
        }

        .action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .action-btn:active { transform: translateY(0); }

        .btn-add {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }

        .btn-update {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          box-shadow: 0 4px 14px rgba(245,158,11,0.3);
        }

        .btn-cancel {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.09) !important;
          margin-left: 8px;
        }

        .table-card {
          background: rgba(18,18,28,0.7);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(12px);
        }

        .table-header-row {
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }

        .table-header-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .table-count {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 12px;
          font-weight: 600;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead th {
          padding: 10px 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.025);
          text-align: left;
        }

        tbody tr {
          border-top: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }

        tbody tr:hover { background: rgba(255,255,255,0.03); }

        tbody td {
          padding: 14px 20px;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          vertical-align: middle;
        }

        .company-cell {
          font-weight: 500;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
        }

        .notes-cell {
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-actions { display: flex; gap: 8px; }

        .row-btn {
          border: none;
          border-radius: 7px;
          padding: 6px 13px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.15s, transform 0.12s;
        }

        .row-btn:hover { opacity: 0.82; transform: translateY(-1px); }
        .row-btn:active { transform: translateY(0); }

        .row-btn-edit {
          background: rgba(245,158,11,0.12);
          color: #f59e0b;
          border: 1px solid rgba(245,158,11,0.25);
        }

        .row-btn-delete {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.22);
        }

        .empty-state {
          padding: 64px 24px;
          text-align: center;
        }

        .empty-icon {
          width: 56px; height: 56px;
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
        }

        .empty-icon svg { width: 26px; height: 26px; fill: rgba(255,255,255,0.2); }

        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          margin-bottom: 6px;
        }

        .empty-sub { font-size: 13px; color: rgba(255,255,255,0.18); }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .search-filter-bar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-wrap svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 15px; height: 15px;
          fill: rgba(255,255,255,0.25);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 8px 14px 8px 36px;
          color: #fff;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input::placeholder { color: rgba(255,255,255,0.2); }

        .search-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .filter-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.4);
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }

        .filter-tab:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }

        .filter-tab.active-all    { background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.2); }
        .filter-tab.active-Applied   { background: rgba(99,102,241,0.18); color: #818cf8; border-color: rgba(99,102,241,0.35); }
        .filter-tab.active-Interview { background: rgba(245,158,11,0.15); color: #f59e0b; border-color: rgba(245,158,11,0.35); }
        .filter-tab.active-Offer     { background: rgba(16,185,129,0.15); color: #10b981; border-color: rgba(16,185,129,0.35); }
        .filter-tab.active-Rejected  { background: rgba(239,68,68,0.12); color: #f87171; border-color: rgba(239,68,68,0.3); }

        .results-count {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          white-space: nowrap;
        }
      `}</style>

      <div className="dash-root">
        {/* Loading Toast */}
        {loading && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 999,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            padding: "8px 16px", borderRadius: 10, fontSize: 13,
            fontWeight: 600, color: "#fff", fontFamily: "'Syne', sans-serif",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            display: "flex", alignItems: "center", gap: 8,
            animation: "fadeUp 0.2s ease",
          }}>
            <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
            Saving…
          </div>
        )}

        {/* Topbar */}
        <div className="topbar">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </div>
            <span className="brand-name">JobTrack</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            Logout
          </button>
        </div>

        <div className="dash-content">
          <h1 className="page-title">Applications</h1>
          <p className="page-sub">Track and manage your job hunt</p>

          {/* Stats */}
          <div className="stats-row">
            <StatCard label="Total" value={counts.total} accent="#fff" />
            <StatCard label="Applied" value={counts.applied} accent="#6366f1" />
            <StatCard label="Interviews" value={counts.interview} accent="#f59e0b" />
            <StatCard label="Offers" value={counts.offer} accent="#10b981" />
            <StatCard label="Rejected" value={counts.rejected} accent="#ef4444" />
          </div>

          {/* Form */}
          <div className="form-card">
            <div className="form-title">
              <span className="form-title-dot" />
              {editId ? "Edit Application" : "New Application"}
            </div>
            <div className="form-grid">
              <div className="field-group">
                <label>Company</label>
                <input className="field-input" placeholder="e.g. Google, Stripe…" value={company} onChange={e => setCompany(e.target.value)} onKeyDown={handleFormKeyDown} />
              </div>
              <div className="field-group">
                <label>Status</label>
                <select className="field-input" value={status} onChange={e => setStatus(e.target.value)}>
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className="field-group">
                <label>Notes</label>
                <input className="field-input" placeholder="Any notes…" value={notes} onChange={e => setNotes(e.target.value)} onKeyDown={handleFormKeyDown} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
                {editId ? (
                  <>
                    <button className="action-btn btn-update" onClick={updateApplication} disabled={loading}>
                      {loading && <span className="spinner" />}Update
                    </button>
                    <button className="action-btn btn-cancel" onClick={resetForm}>Cancel</button>
                  </>
                ) : (
                  <button className="action-btn btn-add" onClick={addApplication} disabled={loading || !company}>
                    {loading && <span className="spinner" />}Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="table-header-row">
              <span className="table-header-title">All Applications</span>
              <span className="table-count">{filteredApplications.length} / {applications.length}</span>
            </div>

            {/* Search + Filter Bar */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="search-filter-bar">
                <div className="search-wrap">
                  <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  <input
                    className="search-input"
                    placeholder="Search by company or notes…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="filter-tabs">
                  {["All", "Applied", "Interview", "Offer", "Rejected"].map(s => (
                    <button
                      key={s}
                      className={`filter-tab ${filterStatus === s ? (s === "All" ? "active-all" : `active-${s}`) : ""}`}
                      onClick={() => setFilterStatus(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                </div>
                <div className="empty-title">No applications yet</div>
                <div className="empty-sub">Add your first one above to get started</div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </div>
                <div className="empty-title">No results found</div>
                <div className="empty-sub">Try a different search or filter</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => (
                    <tr key={app.id}>
                      <td className="company-cell">{app.company}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td className="notes-cell">{app.notes || <span style={{ color: "rgba(255,255,255,0.18)" }}>—</span>}</td>
                      <td>
                        <div className="row-actions">
                          <button className="row-btn row-btn-edit" onClick={() => startEdit(app)}>Edit</button>
                          <button
                            className="row-btn row-btn-delete"
                            onClick={() => {
                              if (window.confirm("Delete this application?")) {
                                deleteApplication(app.id);
                              }
                            }}
                            disabled={deleteId === app.id}
                          >
                            {deleteId === app.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;