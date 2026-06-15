const axios = require("axios");

module.exports = {
  async subscribe(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest("Email is required");
      }

      // Add or update contact in Brevo
      await axios.post(
        "https://api.brevo.com/v3/contacts",
        {
          email,
          updateEnabled: true
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Contact added:", email);

      // Send welcome email
      const emailResponse = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "Suretaas",
            email: "noreply@suretaas.com" // Verified sender in Brevo
          },
          to: [
            {
              email: email
            }
          ],
          subject: "Welcome to Suretaas!",
          htmlContent: `
            <h1>Welcome to Suretaas!</h1>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You will receive our latest articles and updates.</p>
            <p>Best Regards,<br><strong>Suretaas Team</strong></p>
          `
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Email sent:", emailResponse.data);

      return ctx.send({
        success: true,
        message: "Subscribed successfully. Welcome email sent."
      });

    } catch (error) {
      console.error(
        "Brevo Error:",
        error.response?.status,
        error.response?.data || error.message
      );

      return ctx.send({
        success: false,
        error: error.response?.data || error.message
      });
    }
  }
};