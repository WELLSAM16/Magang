const { Composio } = require("@composio/core");
process.loadEnvFile("../.env.local");

async function main() {
    try {
        const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
        console.log("Fetching all connected accounts...");
        const connections = await composio.connectedAccounts.list();
        const response = await composio.tools.execute({
            action: "INSTAGRAM_GET_IG_USER_MEDIA",
            params: {},
            connectedAccountId: "ca_CyvFBCne1dTD"
        });
        console.log("Action output:", response);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
