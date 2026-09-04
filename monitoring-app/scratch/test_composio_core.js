const { Composio } = require("@composio/core");
process.loadEnvFile("../.env.local");

async function main() {
    try {
        const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
        const tools = await composio.tools.getRawComposioTools({ toolkits: ["instagram"] });
        console.log("Tools:", tools.map(t => t.name));
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
