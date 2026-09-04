import { ComposioToolSet } from "composio-core";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const composio = new ComposioToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

async function main() {
    try {
        console.log("Fetching action from actionsModel.get...");
        const action = await composio.client.actionsModel.get({ actionName: "INSTAGRAM_GET_IG_USER_MEDIA" });
        console.log("Action found:", action);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
