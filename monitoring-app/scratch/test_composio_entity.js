const { Composio } = require("@composio/core");
process.loadEnvFile("../.env.local");

async function main() {
    try {
        const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
        console.log("Fetching connected accounts for ovule-proxy...");
        const entity = composio.client.getEntity("ovule-proxy");
        const accounts = await entity.getConnections();
        console.log("Connected accounts:", accounts);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
