const fs = require("fs")
const https = require("https")
const path = require("path")
const express = require("express")
const helmet = require('helmet')

require("dotenv").config();

const ENVS = {
    gglClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    gglClientId: process.env.GOOGLE_CLIENT_ID
}

const PORT = 8010

const app = express()

function checkLoggedIn(req, res, next) {
    const isLoggedIn = true;
    if (!isLoggedIn) {
        return res.status(401).json({error: "You must log in!"})
    }
    next()
}

// Helmet goes at the top
// it adds a ton of security headers
app.use(helmet())

app.get("/auth/google", (req, res) => {

})

app.get("/auth/google/callback", (req, res) => {

})

app.get("/auth/logout", (req, res) => {

})

// app.get("/secret", checkLoggedIn, checkPermissions, (req, res) => {
app.get("/secret", checkLoggedIn, (req, res) => {
    return res.send("Your personal secret is 42")
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// http and https are both build in
// these 2 files are generated using openssl command
// openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365
// see one note for what it means
https.createServer({
    cert: fs.readFileSync("cert.pem"),
    key: fs.readFileSync("key.pem"),
}, app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
})