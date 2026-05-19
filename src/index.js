"use strict";

const nodemailer = require("nodemailer");

module.exports = {

  register() {},

  bootstrap({ strapi }) {

    console.log("BOOTSTRAP RUNNING");

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,

      auth: {
        user: process.env.BREVO_SENDER_EMAIL,
        pass: process.env.BREVO_API_KEY,
      },
    });

    strapi.db.lifecycles.subscribe({

      models: ["api::insight.insight"],

      async afterUpdate(event) {

        try {

          console.log("AFTER UPDATE RUNNING");

          const result = event.result;

          if (!result.publishedAt) {
            return;
          }

          const subscribers =
            await strapi.entityService.findMany(
              "api::subscriber.subscriber"
            );

          const emails = subscribers.map(
            (s) => s.email
          );

          if (!emails.length) {
            return;
          }

          await transporter.sendMail({

            from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,

            to: emails,

            subject: result.title,

            html: `
              <h1>${result.title}</h1>

              <p>${result.summary || ""}</p>

              <a href="${process.env.FRONTEND_URL}/article/${result.slug}">
                Read Article
              </a>
            `,
          });

          console.log(
            "EMAIL SENT TO SUBSCRIBERS"
          );

        } catch (err) {

          console.log("EMAIL ERROR");
          console.log(err);

        }
      },
    });
  },
};