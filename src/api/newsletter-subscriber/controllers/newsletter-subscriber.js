async function addToBrevo(email) {
  try {
  console.log("Sending to Brevo:", email);
  
  const response = await fetch(
    "https://api.brevo.com/v3/contacts",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(process.env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    }
  );
  
  const text = await response.text();
  
  console.log("BREVO newsletter_status:", response.status);
  console.log("BREVO RESPONSE:", text);
  
  return text;
  
  } catch (error) {
  console.error("BREVO ERROR:", error);
  }
  }
  
  module.exports = {
  async subscribe(ctx) {
  try {
  const email = ctx.request.body?.email?.trim().toLowerCase();
  
    if (!email) {
      return ctx.badRequest("Email is required");
    }
  
    const existing = await strapi.db
      .query("api::newsletter-subscriber.newsletter-subscriber")
      .findOne({
        where: { email },
      });
  
    // New subscriber
    if (!existing) {
      const subscriber = await strapi.documents(
        "api::newsletter-subscriber.newsletter-subscriber"
      ).create({
        data: {
          email,
          newsletter_status: "subscribed",
        },
        status: "published",
      });
  
      await addToBrevo(email);
  
      return {
        success: true,
        message: "Subscribed successfully",
        data: subscriber,
      };
    }
  
    // Already subscribed
    if (existing.newsletter_status === "subscribed") {
      return {
        success: false,
        message: "Already subscribed",
      };
    }
  
    // Re-subscribe
    const updated = await strapi.documents(
      "api::newsletter-subscriber.newsletter-subscriber"
    ).update({
      documentId: existing.documentId,
      data: {
        newsletter_status: "subscribed",
      },
      status: "published",
    });
  
    await addToBrevo(email);
  
    return {
      success: true,
      message: "Subscription reactivated",
      data: updated,
    };
  } catch (error) {
    console.error("SUBSCRIBE ERROR:", error);
    return ctx.internalServerError(error.message);
  }
  
  },
  
  async unsubscribe(ctx) {
  try {
  const email = ctx.request.body?.email?.trim().toLowerCase();
  
    if (!email) {
      return ctx.badRequest("Email is required");
    }
  
    const subscriber = await strapi.db
      .query("api::newsletter-subscriber.newsletter-subscriber")
      .findOne({
        where: { email },
      });
  
    if (!subscriber) {
      return {
        success: false,
        message: "Subscriber not found",
      };
    }
  
    if (subscriber.newsletter_status === "unsubscribed") {
      return {
        success: false,
        message: "Already unsubscribed",
      };
    }
  
    const updated = await strapi.documents(
      "api::newsletter-subscriber.newsletter-subscriber"
    ).update({
      documentId: subscriber.documentId,
      data: {
        newsletter_status: "unsubscribed",
      },
      status: "published",
    });
  
    return {
      success: true,
      message: "Successfully unsubscribed",
      data: updated,
    };
  } catch (error) {
    console.error("UNSUBSCRIBE ERROR:", error);
    return ctx.internalServerError(error.message);
  }
  
  },
  };