"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (role: "admin" | "user") => {
    if (!email || !password) {
      alert("Masukkan email dan password");
      return;
    }
    try {
      setIsLoggingIn(true);
      await login(email, password, role);
    } catch (error) {
       // Error handled in authContext
       setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
       <div className="container flex-center" style={{ minHeight: "100vh" }}>
          <p>Loading Authentication...</p>
       </div>
    );
  }

  return (
    <div className="container flex-center" style={{ minHeight: "100vh" }}>
      <div className="glass-panel" style={{ padding: "40px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <h2 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "20px" }}>
          Login ke Dashboard
        </h2>
        
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Email
          </label>
          <input
            type="email"
            className="input-field"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "30px", textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Password
          </label>
          <input
            type="password"
            className="input-field"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <button 
            className="btn btn-primary" 
            onClick={() => handleLogin("user")}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login sebagai User (Viewer)"}
          </button>
          
          <button 
            className="btn btn-primary" 
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" }}
            onClick={() => handleLogin("admin")}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login sebagai Admin (Full Access)"}
          </button>
        </div>

        <p style={{ marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
          *Jika email belum terdaftar, sistem akan otomatis membuatkan akun baru dengan Role yang Anda pilih.
        </p>
      </div>
    </div>
  );
}
