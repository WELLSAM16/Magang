"use client";

import React, { useState, useEffect } from 'react';

export default function SkoringPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchSkoringData = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            
            const res = await fetch(`/api/skoring?${params.toString()}`);
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || data.details || 'Failed to fetch data');
            }
            
            setPosts(data.posts || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on mount
    useEffect(() => {
        fetchSkoringData();
    }, []); // eslint-disable-line

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '20px' }}>Skoring Dashboard</h1>
            
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Start Date</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#222', color: '#fff' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#222', color: '#fff' }}
                    />
                </div>
                <button className="btn btn-primary" onClick={fetchSkoringData} disabled={loading}>
                    {loading ? 'Loading...' : 'Filter'}
                </button>
            </div>

            {error && <div style={{ color: '#ff4d4f', marginBottom: '20px' }}>{error}</div>}

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '12px' }}>Date</th>
                            <th style={{ padding: '12px' }}>Media</th>
                            <th style={{ padding: '12px' }}>Platform</th>
                            <th style={{ padding: '12px' }}>Likes</th>
                            <th style={{ padding: '12px' }}>Kategori</th>
                            <th style={{ padding: '12px' }}>Keywords</th>
                            <th style={{ padding: '12px' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 && !loading && (
                            <tr>
                                <td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>No posts found</td>
                            </tr>
                        )}
                        {posts.map((post) => (
                            <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px' }}>{new Date(post.timestamp).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', maxWidth: '200px' }}>
                                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ color: '#00e5ff' }}>
                                            {post.caption ? post.caption.substring(0, 50) + '...' : 'View Post'}
                                        </a>
                                    </div>
                                </td>
                                <td style={{ padding: '12px' }}>{post.scoring?.platform}</td>
                                <td style={{ padding: '12px' }}>{post.likes}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.2)', fontSize: '0.85em' }}>
                                        {post.scoring?.kategori}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {post.scoring?.keywords?.map((kw: string, i: number) => (
                                            <span key={i} style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontSize: '0.8em' }}>
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#00e5ff' }}>
                                    {post.scoring?.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
