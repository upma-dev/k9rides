import dotenv from 'dotenv';
dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

async function testPaymentLink() {
  const response = await fetch(`https://api.razorpay.com/v1/payment_links`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: 1000,
      currency: "INR",
      accept_partial: false,
      reference_id: "test_" + Date.now(),
      description: `Taxi fare for test`,
      upi_link: true,
      expire_by: Math.floor(Date.now() / 1000) + 30 * 60,
    })
  });

  const payload = await response.json();
  console.log("Link API Status:", response.status);
  console.log("Link API Response:", payload);
}

testPaymentLink().catch(console.error);
