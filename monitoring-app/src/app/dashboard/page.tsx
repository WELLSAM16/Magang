"use client";

import { useState, useEffect } from "react";

interface Post {
  id: string;
  caption: string;
  media_type: string;
  permalink: string;
  timestamp: string;
  username: string;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saved: number;
  plays: number;
}

function formatDate(ts: string) {
  if (!ts) return "-";
  const date = new Date(ts);
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getFormatLabel(mediaType: string) {
  switch (mediaType) {
    case "VIDEO": return { label: "Reels", color: "#9333ea" };
    case "CAROUSEL_ALBUM": return { label: "Carousel", color: "#0ea5e9" };
    default: return { label: "Image", color: "#10b981" };
  }
}

function calcER(post: Post): string {
  const total = post.likes + post.comments + post.shares + post.saved;
  const base = post.reach || 1;
  return ((total / base) * 100).toFixed(1) + "%";
}

function FormatBadge({ mediaType }: { mediaType: string }) {
  const { label, color } = getFormatLabel(mediaType);
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "white",
      background: color,
      letterSpacing: "0.03em",
    }}>
      {label}
    </span>
  );
}

function MetricBox({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{
      background: "var(--glass-bg)",
      border: "1px solid var(--glass-border)",
      borderRadius: "16px",
      padding: "20px 24px",
      flex: 1,
      minWidth: "140px",
    }}>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: "1.9rem", fontWeight: 700, color }}>
        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    async function fetchInstagram() {
      try {
        const res = await fetch("/api/instagram");
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to fetch Instagram data");
        }

        const list: Post[] = Array.isArray(data.posts) ? data.posts : [];

        // Fallback mock jika kosong
        if (list.length === 0) {
          list.push(
            { id: "mock1", caption: "🎉 Peluncuran produk terbaru kita! Jangan sampai kehabisan promonya ya #launch", media_type: "IMAGE", permalink: "https://instagram.com", timestamp: new Date().toISOString(), username: "demo", reach: 6861, impressions: 11714, likes: 95, comments: 7, shares: 4, saved: 2, plays: 0 },
            { id: "mock2", caption: "🎬 After Movie: Gen-Zummit 2025", media_type: "VIDEO", permalink: "https://instagram.com", timestamp: new Date(Date.now() - 86400000).toISOString(), username: "demo", reach: 10831, impressions: 22345, likes: 270, comments: 5, shares: 11, saved: 5, plays: 18540 },
            { id: "mock3", caption: "Youth Ranger Indonesia turut ambil bagian dalam Gen-Zummit 2025, sebuah acara…", media_type: "CAROUSEL_ALBUM", permalink: "https://instagram.com", timestamp: new Date(Date.now() - 172800000).toISOString(), username: "demo", reach: 10633, impressions: 24392, likes: 480, comments: 2, shares: 30, saved: 20, plays: 0 },
          );
        }

        setPosts(list);
        setLastUpdated(new Date().toLocaleTimeString("id-ID"));
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchInstagram();
    const interval = setInterval(fetchInstagram, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalReach = posts.reduce((a, p) => a + p.reach, 0);
  const totalImpressions = posts.reduce((a, p) => a + p.impressions, 0);
  const totalLikes = posts.reduce((a, p) => a + p.likes, 0);
  const totalComments = posts.reduce((a, p) => a + p.comments, 0);
  const totalShares = posts.reduce((a, p) => a + p.shares, 0);
  const totalSaved = posts.reduce((a, p) => a + p.saved, 0);

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: "2.2rem", margin: 0 }}>Dashboard Analytics</h1>
          <p style={{ margin: "6px 0 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Monitoring performa Instagram secara real-time
            {lastUpdated && <span style={{ marginLeft: "12px", color: "var(--success)", fontSize: "0.8rem" }}>● Diperbarui: {lastUpdated}</span>}
          </p>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--success)", fontSize: "0.85rem" }}>
          <span className="live-indicator"></span> Live System Active
        </span>
      </header>

      {/* Ringkasan Metrik */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "16px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Ringkasan Akun (Agregat)</h2>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <MetricBox label="Total Postingan" value={posts.length} color="var(--primary)" />
          <MetricBox label="Total Jangkauan" value={totalReach} color="#8b5cf6" />
          <MetricBox label="Total Tayangan" value={totalImpressions} color="#0ea5e9" />
          <MetricBox label="Total Suka" value={totalLikes} color="var(--danger)" />
          <MetricBox label="Total Komentar" value={totalComments} color="var(--success)" />
          <MetricBox label="Total Simpan" value={totalSaved} color="#f59e0b" />
          <MetricBox label="Total Bagikan" value={totalShares} color="#ec4899" />
        </div>
      </section>

      {/* Tabel Detail */}
      <section>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>Instagram — Arsip & Explorer</h2>
          </div>

          {error && (
            <div style={{ padding: "12px 24px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", fontSize: "0.875rem" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["TANGGAL", "FORMAT", "JUDUL / HOOK", "TAYANGAN", "JANGKAUAN", "SUKA", "KOMENTAR", "BAGIKAN", "SIMPAN", "ER"].map(col => (
                    <th key={col} style={{
                      padding: "12px 16px",
                      textAlign: col === "JUDUL / HOOK" ? "left" : "center",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isLoaded ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                      <div style={{ display: "inline-block", width: "20px", height: "20px", border: "2px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginRight: "10px", verticalAlign: "middle" }}></div>
                      Memuat data dari Instagram...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                      Tidak ada postingan ditemukan.
                    </td>
                  </tr>
                ) : (
                  posts.map((post, i) => {
                    const hook = post.caption
                      ? (post.caption.length > 60 ? post.caption.substring(0, 60) + "…" : post.caption)
                      : "No Caption";
                    const er = calcER(post);

                    return (
                      <tr key={post.id} style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.15s",
                        background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent")}
                      >
                        <td style={{ padding: "13px 16px", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                          {formatDate(post.timestamp)}
                        </td>
                        <td style={{ padding: "13px 16px", textAlign: "center" }}>
                          <FormatBadge mediaType={post.media_type} />
                        </td>
                        <td style={{ padding: "13px 16px", maxWidth: "320px" }}>
                          <a href={post.permalink} target="_blank" rel="noopener noreferrer" style={{
                            color: "var(--text)",
                            textDecoration: "none",
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
                          >
                            {hook}
                          </a>
                        </td>
                        {[
                          { val: post.impressions, color: "#0ea5e9" },
                          { val: post.reach, color: "#8b5cf6" },
                          { val: post.likes, color: "var(--danger)" },
                          { val: post.comments, color: "var(--success)" },
                          { val: post.shares, color: "#ec4899" },
                          { val: post.saved, color: "#f59e0b" },
                        ].map(({ val, color }, idx) => (
                          <td key={idx} style={{ padding: "13px 16px", textAlign: "center", fontWeight: 600, color }}>
                            {val.toLocaleString("id-ID")}
                          </td>
                        ))}
                        <td style={{ padding: "13px 16px", textAlign: "center", fontWeight: 700, color: "#facc15" }}>
                          {er}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
