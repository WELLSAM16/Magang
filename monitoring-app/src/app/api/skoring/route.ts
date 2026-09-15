import { NextResponse } from 'next/server';
import { GET as fetchInstagramData } from '../instagram/route';
import { calculatePostScore } from '@/lib/scoring';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Panggil endpoint instagram secara langsung
        const igResponse = await fetchInstagramData();
        if (!igResponse.ok) {
            return igResponse; // Teruskan error jika ada
        }

        const data = await igResponse.json();
        let posts = data.posts || [];

        // Filter berdasarkan tanggal jika ada
        if (startDateParam || endDateParam) {
            const startDate = startDateParam ? new Date(startDateParam) : new Date(0);
            const endDate = endDateParam ? new Date(endDateParam) : new Date();
            // Set end date ke akhir hari
            endDate.setHours(23, 59, 59, 999);

            posts = posts.filter((post: any) => {
                if (!post.timestamp) return false;
                const postDate = new Date(post.timestamp);
                return postDate >= startDate && postDate <= endDate;
            });
        }

        // Hitung skor untuk setiap post
        const scoredPosts = posts.map((post: any) => {
            const scoringInfo = calculatePostScore({
                media_type: post.media_type,
                likes: post.likes || 0,
                caption: post.caption || ''
            });

            return {
                ...post,
                scoring: scoringInfo
            };
        });

        return NextResponse.json({ posts: scoredPosts });
    } catch (error: any) {
        console.error("Error in skoring API:", error);
        return NextResponse.json(
            { error: "Failed to process scoring", details: error.message },
            { status: 500 }
        );
    }
}
