const passport = require("passport")


// SEC: Routes
const httpGoogleAuth =  passport.authenticate("google", {
        scope: ["email", "profile", "https://www.googleapis.com/auth/calendar"]
    })

const httpGoogleAuthCallback = passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
})


module.exports = {
    httpGoogleAuth,
    httpGoogleAuthCallback
}