require("dotenv").config();

console.log("EMAIL:");
console.log(process.env.BREVO_SENDER_EMAIL);

console.log("KEY:");
console.log(process.env.BREVO_API_KEY);