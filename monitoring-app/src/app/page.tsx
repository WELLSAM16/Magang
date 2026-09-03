import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex-center" style={{ minHeight: "100vh", flexDirection: "column", gap: "20px" }}>
      <div className="glass-panel" style={{ padding: "40px", textAlign: "center", maxWidth: "600px" }}>
        <h1 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          Instagram Monitoring
        </h1>
        <p style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
          Monitor your Instagram post metrics (Views, Likes, Watch Time) in real-time with our premium dashboard.
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <Link href="/login">
            <button className="btn btn-primary">Go to Login</button>
          </Link>
          <Link href="/dashboard">
            <button className="btn" style={{ background: "rgba(255, 255, 255, 0.1)" }}>View Dashboard</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
