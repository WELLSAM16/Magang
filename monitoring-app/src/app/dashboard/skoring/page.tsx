"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import KeywordManagerModal from '@/components/KeywordManagerModal';

export default function SkoringPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);

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

    const exportToExcel = () => {
        if (!posts || posts.length === 0) {
            alert("Tidak ada data untuk diekspor!");
            return;
        }

        // Format data sesuai permintaan
        const excelData = posts.map((post, index) => ({
            "Nomor": index + 1,
            "Kategori": post.scoring?.kategori || "-",
            "Tanggal": new Date(post.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            "Username": post.username || "-",
            "Judul Pemberitaan": post.caption || "-",
            "Link": post.permalink,
            "Kategori Media": post.scoring?.tierName || post.scoring?.platform || "Tidak diketahui"
        }));

        // Buat worksheet dan workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Skoring");

        // Nama file menyesuaikan tanggal filter (jika ada)
        let filename = "Laporan_Skoring.xlsx";
        if (startDate || endDate) {
            filename = `Laporan_Skoring_${startDate || 'awal'}_sampai_${endDate || 'akhir'}.xlsx`;
        }

        // Trigger download
        XLSX.writeFile(workbook, filename);
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link href="/dashboard" className="btn" style={{ textDecoration: 'none', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '8px 16px', borderRadius: '8px', color: 'var(--text-color)', fontWeight: 'bold' }}>
                        &larr; Back
                    </Link>
                    <h1 className="text-gradient" style={{ margin: 0 }}>Skoring Dashboard</h1>
                </div>
                <button className="btn btn-primary" onClick={() => setIsKeywordModalOpen(true)}>
                    Kelola Keyword
                </button>
            </div>
            
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Start Date</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <button className="btn btn-primary" onClick={fetchSkoringData} disabled={loading}>
                    {loading ? 'Loading...' : 'Filter'}
                </button>
            </div>

            {error && <div style={{ color: '#ff4d4f', marginBottom: '20px' }}>{error}</div>}

            <div className="glass-panel" style={{ overflowX: 'auto', maxHeight: '60vh', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                            <th style={{ padding: '12px' }}>Date</th>
                            <th style={{ padding: '12px' }}>Media</th>
                            <th style={{ padding: '12px' }}>Platform</th>
                            <th style={{ padding: '12px' }}>Metric (Max)</th>
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
                            <tr key={post.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                <td style={{ padding: '12px' }}>{new Date(post.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</td>
                                <td style={{ padding: '12px', maxWidth: '200px' }}>
                                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                        <a href={post.permalink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '500' }}>
                                            {post.caption ? post.caption.substring(0, 50) + '...' : 'View Post'}
                                        </a>
                                    </div>
                                </td>
                                <td style={{ padding: '12px' }}>{post.scoring?.platform}</td>
                                <td style={{ padding: '12px' }} title={`Likes: ${post.likes || 0}, Views: ${post.plays || post.views || post.impressions || 0}`}>
                                    {post.used_metric_value || post.likes || 0}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', fontSize: '0.85em', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                        {post.scoring?.kategori}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {post.scoring?.keywords?.map((kw: string, i: number) => (
                                            <span key={i} style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--card-border)', fontSize: '0.8em' }}>
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {post.scoring?.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                    className="btn" 
                    onClick={exportToExcel} 
                    disabled={loading || posts.length === 0}
                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                >
                    Download Excel
                </button>
            </div>

            <KeywordManagerModal 
                isOpen={isKeywordModalOpen} 
                onClose={() => {
                    setIsKeywordModalOpen(false);
                    fetchSkoringData();
                }} 
            />
        </div>
    );
}
