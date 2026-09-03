"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    ...(user?.role === "admin" ? [{ name: "Kelola Target", href: "/admin/target", icon: "⚙️" }] : []),
  ];

  return (
    <div className="glass-panel sidebar-container">
      <div>
        <div className="sidebar-header" style={{ padding: "0 24px", marginBottom: "40px" }}>
          <h2 className="text-gradient" style={{ fontSize: "1.5rem" }}>IG Monitor</h2>
          <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>
            Role: <span style={{ color: user?.role === "admin" ? "var(--danger)" : "var(--success)", fontWeight: "bold", textTransform: "capitalize" }}>{user?.role}</span>
          </p>
        </div>

        <nav className="sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "0 12px" }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href}>
                <div 
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: isActive ? "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)" : "transparent",
                    borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    color: isActive ? "var(--text-main)" : "var(--text-muted)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{link.icon}</span>
                  <span style={{ fontWeight: isActive ? "600" : "400" }}>{link.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ padding: "0 24px" }}>
        <button 
          className="btn" 
          style={{ width: "100%", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
