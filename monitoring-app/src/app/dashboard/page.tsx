"use client";

import MetricCard from "@/components/MetricCard";
import { useState, useEffect } from "react";

// Mock data for posts
const initialPosts = [
  { id: 1, title: "Postingan Promo Musim Panas", views: 12500, likes: 4320, watchTime: 120 },
  { id: 2, title: "Behind the Scenes", views: 8900, likes: 2100, watchTime: 85 },
  { id: 3, title: "Q&A Session", views: 15400, likes: 5800, watchTime: 210 },
];

export default function Dashboard() {
  const [posts, setPosts] = useState(initialPosts);

  // Simulate global real-time updates for table data
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((currentPosts) => 
        currentPosts.map(post => ({
          ...post,
          views: post.views + Math.floor(Math.random() * 3),
          likes: post.likes + (Math.random() > 0.5 ? 1 : 0),
          watchTime: post.watchTime + (Math.random() > 0.8 ? 1 : 0)
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
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
          <MetricCard title="Total Views" initialValue={36800} icon="👁️" color="59, 130, 246" />
          <MetricCard title="Total Likes" initialValue={12220} icon="❤️" color="239, 68, 68" />
          <MetricCard title="Total Jam Tayang (Menit)" initialValue={415} icon="⏱️" color="16, 185, 129" />
        </div>
      </section>

      <section>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Performa Per Postingan</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul Postingan</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Watch Time (Min)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 500 }}>{post.title}</td>
                    <td style={{ color: "var(--primary)" }}>{post.views.toLocaleString()}</td>
                    <td style={{ color: "var(--danger)" }}>{post.likes.toLocaleString()}</td>
                    <td style={{ color: "var(--success)" }}>{post.watchTime.toLocaleString()}</td>
                    <td>
                      <span style={{ padding: "4px 8px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", borderRadius: "4px", fontSize: "0.8rem" }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
