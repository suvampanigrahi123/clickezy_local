import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Initialize razorpay object
    const paymentDetails = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SEC,
    });

   

    const options = {
      amount: paymentDetails.amount * 100,
      currency: paymentDetails.currency,
      receipt: paymentDetails.receipt,
      payment_capture: paymentDetails.payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    // Handle any other HTTP method
  }
}
