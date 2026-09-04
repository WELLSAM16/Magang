import { NextResponse } from 'next/server';
import { Composio } from "@composio/core";

// Initialize Composio client
const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
});

export async function GET() {
    try {
        const entityId = process.env.COMPOSIO_ENTITY_ID || "ovule-proxy";
        
        const response = await composio.tools.execute({
            action: "INSTAGRAM_GET_IG_USER_MEDIA",
            params: {}, // Empty params if it requires some params, it will return validation error
            entityId: entityId
        });

        if (!response) {
            throw new Error("No response from Composio");
        }

        // Return the response data
        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Error fetching Instagram data via Composio:", error);
        return NextResponse.json(
            { error: "Failed to fetch Instagram data", details: error.message, errorObj: error },
            { status: 500 }
        );
    }
}
