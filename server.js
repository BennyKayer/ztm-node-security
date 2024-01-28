const fs = require("fs")
const https = require("https")
const path = require("path")
const express = require("express")
const helmet = require('helmet')
const passport = require("passport")
const { Strategy } = require("passport-google-oauth20")
const cookieSession = require("cookie-session")

require("dotenv").config();

const ENVS = {
    gglClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    gglClientId: process.env.GOOGLE_CLIENT_ID,
    sessionSecret1: process.env.SESSION_SECRET_1,
    sessionSecret2: process.env.SESSION_SECRET_2
}

const PORT = 8010

function verifyCallback(accessToken, refreshToken, profile, done) {
    // Save the user that's come back from google to db here
    console.log(`Google profile`, profile);
    done(null, profile)
}

passport.use(new Strategy({
    clientID: ENVS.gglClientId,
    clientSecret: ENVS.gglClientSecret,
    callbackURL: "https://localhost:8010/auth/google/callback"
}, verifyCallback));

// Save the session to the cookies
passport.serializeUser((user, done) => {
    // Sending the whole user makes cookies big
    // just get the id and search in deserialize
    done(null, user.id)
})

// Read the session from the cookie
passport.deserializeUser((id, done) => {
    // User.findById(id) can be done here
    done(null, id)
})

const app = express()

function checkLoggedIn(req, res, next) {
    console.log(`Current user id is ${req.user}`);
    // const isLoggedIn = req.user;
    const isLoggedIn = req.isAuthenticated() && req.user
    if (!isLoggedIn) {
        return res.status(401).json({error: "You must log in!"})
    }
    next()
}

// Helmet goes at the top
// it adds a ton of security headers
app.use(helmet())
// keys - why not just key?
// changing it will invalidate all stuff signed with it
// that's why setting a 2nd secret as a rotation secret is a good practice
// sign with new but still accept the old one
app.use(cookieSession({
    name: 'session',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    keys: [ENVS.sessionSecret1, ENVS.sessionSecret2]
}))
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate('google', {
    scope: ["email", "profile", "https://www.googleapis.com/auth/calendar"]
}))

app.get("/auth/google/callback", passport.authenticate('google', 
{
    failureRedirect: "/failure", successRedirect: "/", session: true,
}))
// Can handle this manually with the next param
// app.get("/auth/google/callback", passport.authenticate('google', 
// {
//     session: false,
// }, (res, req) => {
//     console.log('Google called us back!');
// }))

app.get("/auth/logout", (req, res) => {

})

app.get('/failure', (req, res) => {
    return res.send('Failed to log in!')
})

// app.get("/secret", checkLoggedIn, checkPermissions, (req, res) => {
app.get("/secret", checkLoggedIn, (req, res) => {
    return res.send("Your personal secret is 42")
})

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "public", "index.html"))
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