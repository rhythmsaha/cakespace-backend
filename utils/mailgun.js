const mailgun = require("mailgun-js");
require("dotenv/config");

var API_KEY = process.env.MAILGUN_API_KEY;
var DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

function sendMail(sender_email, receiver_email, email_subject, email_body) {
    const data = {
        from: sender_email,
        to: receiver_email,
        subject: email_subject,
        text: email_body,
    };

    mg.messages().send(data, (error, body) => {
        if (error) console.log(error);
        else console.log(body);
    });
}

// var sender_email = "Rhythm Saha <support@rhythmsaha.me>";
// var receiver_email = "rs.2001.saha@gmail.com";
// var email_subject = "Test Email";
// var email_body = "Greetings from hythm Saha";
// sendMail(sender_email, receiver_email, email_subject, email_body);

module.exports = sendMail;
