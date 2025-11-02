import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};
