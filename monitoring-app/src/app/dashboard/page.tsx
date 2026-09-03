"use client";

import MetricCard from "@/components/MetricCard";
import { useState, useEffect } from "react";


export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read targets from Admin CRUD (localStorage)
    const savedTargets = localStorage.getItem("mock_targets");
    let baseTargets = [];
    
    if (savedTargets) {
      baseTargets = JSON.parse(savedTargets);
    } else {
      baseTargets = [
        { id: "1", title: "Postingan Promo Musim Panas", status: "Active" },
        { id: "2", title: "Behind the Scenes", status: "Active" },
        { id: "3", title: "Q&A Session", status: "Active" },
      ];
    }

    // Assign mock metrics to the targets
    const targetsWithMetrics = baseTargets.map((target: any, index: number) => ({
      ...target,
      views: 10000 + (index * 2500) + Math.floor(Math.random() * 1000),
      likes: 3000 + (index * 800) + Math.floor(Math.random() * 500),
      watchTime: 100 + (index * 30) + Math.floor(Math.random() * 20),
    }));

    setPosts(targetsWithMetrics);
    setIsLoaded(true);
  }, []);

  // Simulate global real-time updates for table data
  useEffect(() => {
    if (!isLoaded) return;
    
    const interval = setInterval(() => {
      setPosts((currentPosts) => 
        currentPosts.map(post => {
          // Only update active posts
          if (post.status !== "Active") return post;
          
          return {
            ...post,
            views: post.views + Math.floor(Math.random() * 5),
            likes: post.likes + (Math.random() > 0.4 ? 1 : 0),
            watchTime: post.watchTime + (Math.random() > 0.7 ? 1 : 0)
          };
        })
      );
    }, 3000);

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
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>
                      Belum ada target yang dimonitor. Tambahkan di menu Kelola Target.
                    </td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id} style={{ opacity: post.status === "Active" ? 1 : 0.5 }}>
                      <td style={{ fontWeight: 500 }}>{post.title}</td>
                      <td style={{ color: "var(--primary)", transition: "all 0.3s" }}>{post.views.toLocaleString()}</td>
                      <td style={{ color: "var(--danger)", transition: "all 0.3s" }}>{post.likes.toLocaleString()}</td>
                      <td style={{ color: "var(--success)", transition: "all 0.3s" }}>{post.watchTime.toLocaleString()}</td>
                      <td>
                        <span style={{ 
                          padding: "4px 8px", 
                          background: post.status === "Active" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
                          color: post.status === "Active" ? "var(--success)" : "var(--danger)", 
                          borderRadius: "4px", fontSize: "0.8rem" 
                        }}>
                          {post.status}
                        </span>
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
