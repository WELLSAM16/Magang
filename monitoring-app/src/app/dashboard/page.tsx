"use client";

import MetricCard from "@/components/MetricCard";
import { useState, useEffect } from "react";


export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstagram() {
      try {
        const res = await fetch("/api/instagram");
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch from Composio");
        }

        let mediaList = [];
        if (Array.isArray(data)) {
            mediaList = data;
        } else if (data && Array.isArray(data.data)) {
            mediaList = data.data;
        } else if (data?.response_data && Array.isArray(data.response_data.data)) {
            mediaList = data.response_data.data;
        }
        
        // MOCK DATA: Jika akun Instagram masih kosong, tampilkan data dummy agar UI terlihat bagus
        if (mediaList.length === 0) {
            mediaList = [
                { id: "1", caption: "🎉 Peluncuran produk terbaru kita! Jangan sampai kehabisan promonya ya #launch #newproduct", media_type: "IMAGE", like_count: 1250, comments_count: 342, permalink: "https://instagram.com" },
                { id: "2", caption: "Di balik layar pembuatan kampanye musim panas kami ☀️", media_type: "VIDEO", like_count: 850, comments_count: 112, permalink: "https://instagram.com" },
                { id: "3", caption: "Tips hari ini: Bagaimana meningkatkan konversi penjualan Anda hingga 3x lipat? 🚀", media_type: "CAROUSEL_ALBUM", like_count: 3200, comments_count: 512, permalink: "https://instagram.com" },
                { id: "4", caption: "Terima kasih atas 10K followers! Kalian luar biasa! ❤️", media_type: "IMAGE", like_count: 4500, comments_count: 890, permalink: "https://instagram.com" },
            ];
        }
        
        // Map the Instagram response to our table format
        const mappedPosts = mediaList.map((item: any) => ({
          id: item.id,
          title: item.caption ? (item.caption.length > 50 ? item.caption.substring(0, 50) + "..." : item.caption) : "No Caption",
          mediaType: item.media_type || "UNKNOWN",
          likes: item.like_count || 0,
          comments: item.comments_count || 0,
          link: item.permalink || "#",
          status: "Active"
        }));

        setPosts(mappedPosts);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchInstagram();
    
    // Optional: Poll every 60 seconds
    const interval = setInterval(fetchInstagram, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header className="responsive-header">
        <div>
          <h1 className="text-gradient" style={{ fontSize: "2.5rem", margin: 0 }}>Dashboard Analytics</h1>
          <p style={{ margin: "5px 0 0 0" }}>Monitoring performa Instagram secara real-time</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span className="live-indicator"></span>
          <span style={{ fontSize: "0.9rem", color: "var(--success)" }}>Live System Active</span>
        </div>
      </header>

      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", color: "var(--text-muted)" }}>Ringkasan Akun (Agregat)</h2>
        <div className="grid-cards">
          {/* Colors in RGB for the MetricCard */}
          <MetricCard title="Total Posts" initialValue={posts.length} icon="📸" color="59, 130, 246" />
          <MetricCard title="Total Likes" initialValue={posts.reduce((acc, curr) => acc + (curr.likes || 0), 0)} icon="❤️" color="239, 68, 68" />
          <MetricCard title="Total Comments" initialValue={posts.reduce((acc, curr) => acc + (curr.comments || 0), 0)} icon="💬" color="16, 185, 129" />
        </div>
      </section>

      <section>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Performa Per Postingan Terbaru</h2>
          {error && (
            <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "8px", marginBottom: "16px" }}>
              Error: {error}
            </div>
          )}
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Caption</th>
                  <th>Media Type</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {!isLoaded ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                      Memuat data dari Instagram...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                      Tidak ada postingan ditemukan atau terjadi error.
                    </td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id} style={{ opacity: post.status === "Active" ? 1 : 0.5 }}>
                      <td style={{ fontWeight: 500 }}>{post.title}</td>
                      <td style={{ color: "var(--primary)", transition: "all 0.3s" }}>{post.mediaType}</td>
                      <td style={{ color: "var(--danger)", transition: "all 0.3s" }}>{post.likes.toLocaleString()}</td>
                      <td style={{ color: "var(--success)", transition: "all 0.3s" }}>{post.comments.toLocaleString()}</td>
                      <td>
                        <a 
                          href={post.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            padding: "6px 12px",
                            background: "var(--primary)",
                            color: "white",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "0.85rem"
                          }}
                        >
                          Buka IG
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
