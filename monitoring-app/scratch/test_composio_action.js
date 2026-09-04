const { Composio } = require("@composio/core");
process.loadEnvFile("../.env.local");

async function main() {
    try {
        const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
        const actions = await composio.actions.get({ action: "INSTAGRAM_GET_IG_USER_MEDIA" });
        console.log(JSON.stringify(actions, null, 2));
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
