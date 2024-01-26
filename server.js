const path = require("path")
const express = require("express")

const PORT = 8010;

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
})