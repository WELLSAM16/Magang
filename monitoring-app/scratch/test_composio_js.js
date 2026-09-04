const { ComposioToolSet } = require("composio-core");
process.loadEnvFile("../.env.local");

const composio = new ComposioToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

async function main() {
    try {
        console.log("Executing action INSTAGRAM_GET_IG_USER_MEDIA...");
        const response = await composio.executeAction({
            action: "INSTAGRAM_GET_IG_USER_MEDIA",
            params: {},
            entityId: process.env.COMPOSIO_ENTITY_ID || "ovule-proxy"
        });
        console.log("Action output:", response);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
