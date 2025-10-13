// POST /api/create-checkout-session
import dotenv from "dotenv";
import Stripe from "stripe";
import Payment from "../models/payment.js";


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { dish, userInfo, quantity = 1 } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: dish.title,
              images: [dish.image],
            },
            unit_amount: Math.round(dish.price * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    const payment = new Payment({
      ...userInfo,
      dishId: dish._id,
      dishName: dish.title,
      dishImage: dish.image,
      dishPrice: dish.price,
      quantity,
      totalAmount: quantity * dish.price,
      sessionId: session.id,
      status: "pending",
      country: userInfo.country || "Unknown",
      address: userInfo.address || "N/A",
    });

    await payment.save();

    res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Stripe session creation error:", err.message);
    res.status(500).json({ message: "Stripe error", error: err.message });
  }
};

