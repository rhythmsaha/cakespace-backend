const mg = require("mailgun-js");
require("dotenv/config");

const mailgun = () =>
    mg({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    });

const mailer = (to, subject, message) => {
    mailgun()
        .messages()
        .send(
            {
                from: `CakeSpace <CakeSpace@cakespace.cf>`,
                to: `${to}`,
                subject: `${subject}`,
                html: `<p>${message}</p>`,
            },
            (err, body) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Error in sending email" });
                } else {
                    console.log(body);
                    res.status(200).json({ message: "Sent email" });
                }
            }
        );
};

module.exports = mailgun;
