import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (request: NextRequest) => {
  try {
    const { amount } = await request.json();
    const customer = await stripe.customers.create({});
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      mode: "payment",
      success_url: `http://localhost:3000/payment-success?amount=${amount}`,
      cancel_url: "http://localhost:3000/payment-cancel",
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: "Lotion",
            },
            currency: "USD",
            unit_amount: amount * 100,
          },
        },
      ],
    });
    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error : ${error}` },
      { status: 500 }
    );
  }
};
