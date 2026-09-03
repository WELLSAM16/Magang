"use client";

import { useState, useEffect } from "react";

interface TargetData {
  id: string;
  title: string;
  status: "Active" | "Paused";
}

export default function TargetManagement() {
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TargetData | null>(null);
  const [formData, setFormData] = useState({ title: "", status: "Active" as "Active" | "Paused" });

  useEffect(() => {
    const saved = localStorage.getItem("mock_targets");
    if (saved) {
      setTargets(JSON.parse(saved));
    } else {
      const initial: TargetData[] = [
        { id: "1", title: "Postingan Promo Musim Panas", status: "Active" },
        { id: "2", title: "Behind the Scenes", status: "Active" },
      ];
      setTargets(initial);
      localStorage.setItem("mock_targets", JSON.stringify(initial));
    }
  }, []);

  const saveToStorage = (newTargets: TargetData[]) => {
    setTargets(newTargets);
    localStorage.setItem("mock_targets", JSON.stringify(newTargets));
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      saveToStorage(targets.filter(t => t.id !== id));
    }
  };

  const handleOpenModal = (target?: TargetData) => {
    if (target) {
      setEditTarget(target);
      setFormData({ title: target.title, status: target.status });
    } else {
      setEditTarget(null);
      setFormData({ title: "", status: "Active" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Judul wajib diisi");

    if (editTarget) {
      saveToStorage(targets.map(t => t.id === editTarget.id ? { ...t, ...formData } : t));
    } else {
      const newTarget: TargetData = {
        id: Date.now().toString(),
        title: formData.title,
        status: formData.status
      };
      saveToStorage([...targets, newTarget]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header className="responsive-header">
        <div>
          <h1 className="text-gradient" style={{ fontSize: "2.5rem", margin: 0 }}>Kelola Target</h1>
          <p style={{ margin: "5px 0 0 0" }}>Tambahkan target akun atau postingan (Hanya Admin)</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Tambah Target</button>
      </header>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul / Target</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {targets.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center" }}>Tidak ada data</td></tr>
            ) : (
              targets.map(target => (
                <tr key={target.id}>
                  <td>{target.id}</td>
                  <td style={{ fontWeight: 500 }}>{target.title}</td>
                  <td>
                    <span style={{ 
                      padding: "4px 8px", 
                      background: target.status === "Active" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                      color: target.status === "Active" ? "var(--success)" : "var(--danger)", 
                      borderRadius: "4px", fontSize: "0.8rem" 
                    }}>
                      {target.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn" 
                      style={{ padding: "6px 12px", marginRight: "10px", background: "rgba(255, 255, 255, 0.1)" }}
                      onClick={() => handleOpenModal(target)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: "6px 12px" }}
                      onClick={() => handleDelete(target.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
        }}>
          <div className="glass-panel" style={{ padding: "30px", width: "100%", maxWidth: "500px" }}>
            <h2 style={{ marginBottom: "20px" }}>{editTarget ? "Edit Target" : "Tambah Target Baru"}</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Judul / Username</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan target..." 
                />
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Status</label>
                <select 
                  className="input-field"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  style={{ backgroundColor: "rgba(30, 41, 59, 0.9)" }}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn" style={{ background: "rgba(255,255,255,0.1)" }} onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
