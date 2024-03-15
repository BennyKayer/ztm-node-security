require("dotenv").config();

const ENVS = {
    gglClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    gglClientId: process.env.GOOGLE_CLIENT_ID,
    gglRedirectUrl: process.env.GOOGLE_REDIRECT_URL,
    sessionSecret1: process.env.SESSION_SECRET_1,
    sessionSecret2: process.env.SESSION_SECRET_2,
    port: process.env.PORT,
    isProduction: process.env.NODE_ENV ? process.env.NODE_ENV === "production" : false
}

module.exports = {
    ENVS
}