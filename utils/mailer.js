const nodemailer = require("nodemailer");

const transpoart = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = (mail, token) =>
  transpoart.sendMail(
    {
      from: process.env.GMAIL_MAIL,
      to: mail,
      subject: "Password Reset",
      html: `
    <button>
        <a href=http://localhost:3000/token=${token}>Change Password</a>
    </button>
    `,
    },
    function (error, info) {
      if (error) {
        console.log({
          status: true,
          respMesg: error,
        });
      } else {
        console.log({
          status: true,
          respMesg: "Email Sent Successfully",
          info,
        });
      }
    }
  );

module.exports = sendMail;