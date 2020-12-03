const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});



const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'friendme_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'nsurajrajan',
            pass: 'surajpandit@06'
        }
    },
    google_client_id: "1076307452303-98qo8rtqk3a5hbq0iuaest11s8sugc8i.apps.googleusercontent.com",
    google_client_secret: "A_XajwCGyb3_BPpYKq6__T9Y",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'friendme',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: './public/assets',
    session_cookie_key: process.env.FRIENDME_SESSION_COOKIE_KEY,
    db: process.env.FRIENDME_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.FRIENDME_GMAIL_USERNAME,
            pass: process.env.FRIENDME_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.FRIENDME_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.FRIENDME_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.FRIENDME_GOOGLE_CALLBACK_RURL,
    jwt_secret: process.env.FRIENDME_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);