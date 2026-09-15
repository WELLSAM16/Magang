const fs = require('fs');
const path = require('path');

const envPath = path.resolve('d:/Magang/monitoring-app/.env.local');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : fs.readFileSync(path.resolve('d:/Magang/monitoring-app/.env'), 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/"/g, '');
});

const COMPOSIO_BASE = "https://backend.composio.dev/api/v3.1/tools/execute";

async function callComposio(apiKey, entityId, tool, args) {
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
    const entityId = env.COMPOSIO_ENTITY_ID;
    const apiKey = env.COMPOSIO_API_KEY;

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

        const imagePost = mediaList.find(p => p.media_type === 'IMAGE');
        if (imagePost) {
            console.log(`\nTesting Image Post ${imagePost.id}`);
            try {
                const insightsData = await callComposio(apiKey, entityId, "INSTAGRAM_GET_POST_INSIGHTS", {
                    ig_post_id: imagePost.id,
                    metric: "impressions,reach,saved,total_interactions,shares"
                });
                console.log("INSIGHTS DATA:", JSON.stringify(insightsData, null, 2));
            } catch (e) {
                console.error("Error fetching insights for image:", e.message);
            }
        }
    } catch (e) {
        console.error(e);
    }
}
test();
