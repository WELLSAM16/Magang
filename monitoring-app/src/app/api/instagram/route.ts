import { NextResponse } from 'next/server';

const COMPOSIO_BASE = "https://backend.composio.dev/api/v3.1/tools/execute";
const CONNECTED_ACCOUNT_ID = "ca_CyvFBCne1dTD";

async function callComposio(apiKey: string, entityId: string, tool: string, args: object) {
    const res = await fetch(`${COMPOSIO_BASE}/${tool}`, {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            connected_account_id: CONNECTED_ACCOUNT_ID,
            entity_id: entityId,
            arguments: args
        })
    });
    const json = await res.json();
    if (!res.ok || json.error) {
        throw new Error(typeof json.error === 'string' ? json.error : JSON.stringify(json.error));
    }
    return json.data;
}

export async function GET() {
    try {
        const entityId = process.env.COMPOSIO_ENTITY_ID;
        const apiKey = process.env.COMPOSIO_API_KEY;

        if (!entityId || !apiKey) {
            throw new Error("Missing Composio credentials in environment variables");
        }

        // Step 1: Ambil daftar media
        const mediaData = await callComposio(apiKey, entityId, "INSTAGRAM_GET_USER_MEDIA", {
            ig_user_id: "me",
            fields: "id,caption,media_type,permalink,timestamp,username"
        });

        const mediaList: any[] = Array.isArray(mediaData)
            ? mediaData
            : Array.isArray(mediaData?.data)
                ? mediaData.data
                : [];

        // Step 2: Untuk setiap post, ambil Insights secara paralel
        const postsWithInsights = await Promise.all(
            mediaList.map(async (post: any) => {
                try {
                    const insightsData = await callComposio(apiKey, entityId, "INSTAGRAM_GET_POST_INSIGHTS", {
                        ig_post_id: post.id
                    });

                    // Parse metrik dari Insights
                    const metrics: Record<string, number> = {};
                    const items: any[] = Array.isArray(insightsData?.data) ? insightsData.data : [];
                    items.forEach((item: any) => {
                        const val = item?.values?.[0]?.value ?? 0;
                        metrics[item.name] = typeof val === 'number' ? val : 0;
                    });

                    return {
                        id: post.id,
                        caption: post.caption || "",
                        media_type: post.media_type || "IMAGE",
                        permalink: post.permalink || "#",
                        timestamp: post.timestamp || "",
                        username: post.username || "",
                        // Metrik dari Insights
                        reach: metrics['reach'] ?? 0,
                        impressions: metrics['impressions'] ?? 0,
                        likes: metrics['likes'] ?? 0,
                        comments: metrics['comments'] ?? 0,
                        shares: metrics['shares'] ?? 0,
                        saved: metrics['saved'] ?? 0,
                        plays: metrics['plays'] ?? metrics['video_views'] ?? 0,
                    };
                } catch {
                    // Jika insights gagal, kembalikan data dasar dengan metrik 0
                    return {
                        id: post.id,
                        caption: post.caption || "",
                        media_type: post.media_type || "IMAGE",
                        permalink: post.permalink || "#",
                        timestamp: post.timestamp || "",
                        username: post.username || "",
                        reach: 0,
                        impressions: 0,
                        likes: 0,
                        comments: 0,
                        shares: 0,
                        saved: 0,
                        plays: 0,
                    };
                }
            })
        );

        return NextResponse.json({ posts: postsWithInsights });
    } catch (error: any) {
        console.error("Error fetching Instagram data:", error);
        return NextResponse.json(
            { error: "Failed to fetch Instagram data", details: error.message },
            { status: 500 }
        );
    }
}
