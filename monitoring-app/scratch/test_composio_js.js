const { ComposioToolSet } = require("composio-core");
process.loadEnvFile(".env.local");

const composio = new ComposioToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

async function main() {
    try {
        console.log("Fetching actions for Instagram...");
        const actions = await composio.client.actionsModel.list({ appNames: "instagram" });
        console.log("Actions:", actions.items.map(a => a.name));
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
