require("dotenv").config();

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: env("aa849b001@smtp-brevo.com"),
          pass: env( "your_brevo_api_key"),
        },
      },
      settings: {
        defaultFrom: "markpetays78@gmail.com",
        defaultReplyTo: "markpetays78@gmail.com",
      },
    },
  },
});