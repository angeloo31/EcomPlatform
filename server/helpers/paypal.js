const paypal = require("paypal-rest-sdk");

console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
console.log("PAYPAL_CLIENT_SECRET:", process.env.PAYPAL_CLIENT_SECRET);

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = paypal;
