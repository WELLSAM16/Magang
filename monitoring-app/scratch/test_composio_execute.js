const { Composio } = require("@composio/core");
process.loadEnvFile("../.env.local");

async function main() {
    try {
        const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
        console.log("Executing action INSTAGRAM_GET_IG_USER_MEDIA via @composio/core...");
        
        // Let's get the entity and execute the tool
        const response = await composio.tools.execute({
            action: "INSTAGRAM_GET_IG_USER_MEDIA",
            params: {},
            entityId: "ovule-proxy"
        });
        
        console.log("Action output:", response);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
