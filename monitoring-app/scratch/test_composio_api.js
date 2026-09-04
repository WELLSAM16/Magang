
process.loadEnvFile(".env.local");

async function main() {
    try {
        console.log("Fetching actions for Instagram via API...");
        const response = await fetch("https://backend.composio.dev/api/v3/actions?appNames=instagram", {
            headers: { "x-api-key": process.env.COMPOSIO_API_KEY }
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
main();
