async function run() {
    try {
        const res = await fetch('http://localhost:3000/api/instagram');
        const data = await res.json();
        console.log(JSON.stringify(data.posts.slice(0, 5), null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
