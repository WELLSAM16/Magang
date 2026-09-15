import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('d:/Magang/monitoring-app/.env.local') });
dotenv.config({ path: path.resolve('d:/Magang/monitoring-app/.env') });

const COMPOSIO_BASE = "https://backend.composio.dev/api/v3.1/tools/execute";

async function callComposio(apiKey: string, entityId: string, tool: string, args: object) {
    const res = await fetch(`${COMPOSIO_BASE}/${tool}`, {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
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

async function test() {
    const entityId = process.env.COMPOSIO_ENTITY_ID;
    const apiKey = process.env.COMPOSIO_API_KEY;

    if (!entityId || !apiKey) {
        console.error("Missing keys", { entityId, apiKey });
        return;
    }

    try {
        const mediaData = await callComposio(apiKey, entityId, "INSTAGRAM_GET_USER_MEDIA", {
            ig_user_id: "me",
            fields: "id,caption,media_type"
        });
        const mediaList = Array.isArray(mediaData?.data) ? mediaData.data : [];
        console.log("Media Count:", mediaList.length);

        for (const post of mediaList.slice(0, 3)) {
            console.log(`\nTesting post ${post.id} (${post.media_type})`);
            
            let metricsToRequest = "impressions,reach,saved,engagement";
            if (post.media_type === "VIDEO") {
                metricsToRequest = "plays,reach,saved,shares,total_interactions";
            } else if (post.media_type === "CAROUSEL_ALBUM") {
                metricsToRequest = "carousel_album_impressions,carousel_album_reach,carousel_album_saved,carousel_album_engagement";
            }
            
            try {
                const insightsData = await callComposio(apiKey, entityId, "INSTAGRAM_GET_POST_INSIGHTS", {
                    ig_post_id: post.id,
                    metric: metricsToRequest
                });
                console.log(JSON.stringify(insightsData, null, 2));
            } catch (err: any) {
                console.error("Error for post:", err.message);
                
                // try fallback
                try {
                    const fallback = await callComposio(apiKey, entityId, "INSTAGRAM_GET_POST_INSIGHTS", {
                        ig_post_id: post.id,
                        metric: "impressions,reach,saved"
                    });
                    console.log("Fallback insights:", JSON.stringify(fallback, null, 2));
                } catch (err2: any) {
                    console.error("Fallback error:", err2.message);
                }
            }
        }
    } catch (err: any) {
        console.error("Top level error:", err);
    }
}

test();
