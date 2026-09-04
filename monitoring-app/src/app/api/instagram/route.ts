import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const entityId = process.env.COMPOSIO_ENTITY_ID;
        const apiKey = process.env.COMPOSIO_API_KEY;

        if (!entityId || !apiKey) {
            throw new Error("Missing Composio credentials in environment variables");
        }

        const res = await fetch("https://backend.composio.dev/api/v3.1/tools/execute/INSTAGRAM_GET_IG_USER_MEDIA", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                connected_account_id: "ca_CyvFBCne1dTD",
                entity_id: entityId,
                arguments: {
                    ig_user_id: "me"
                }
            })
        });

        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(data.error || JSON.stringify(data) || "Failed to fetch from Composio REST API");
        }

        // Return the response data
        return NextResponse.json(data.data || data);
    } catch (error: any) {
        console.error("Error fetching Instagram data via Composio REST API:", error);
        return NextResponse.json(
            { error: "Failed to fetch Instagram data", details: error.message },
            { status: 500 }
        );
    }
}
