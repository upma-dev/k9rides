import dotenv from 'dotenv';
dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

async function testQr() {
  const response = await fetch(`https://api.razorpay.com/v1/payments/qr_codes`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "upi_qr",
      name: `Test Taxi Fare`,
      usage: "single_use",
      fixed_amount: true,
      payment_amount: 1000,
      description: `Taxi fare for test`,
      close_by: Math.floor(Date.now() / 1000) + 30 * 60,
      notes: {
        rideId: "123",
        driverId: "456",
        serviceType: "ride",
        source: "driver_collect_amount",
      },
    })
  });

  const payload = await response.json();
  console.log("QR API Status:", response.status);
  console.log("QR API Response:", payload);
}

testQr().catch(console.error);
