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
          email: email,
          listIds: [Number(process.env.BREVO_LIST_ID)],
          updateEnabled: true,
        }),
      }
    );

    const result = await response.text();

    console.log("BREVO STATUS:", response.status);
    console.log("BREVO RESPONSE:", result);

    return result;
  } catch (error) {
    console.error("BREVO ERROR:", error);
  }
}

module.exports = addToBrevo;