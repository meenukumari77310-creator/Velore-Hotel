import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
export const getStripe = ()=> {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51Rm8WkPRoNmRV9gmDKPSn5trUbyNYm55uSpE4MYviN4VoygddRVuzARJb9DN0exzcdwRqp0Y9yiVXQo6UTOEPvDd00bf9ILvD1');
  }
  return stripePromise;
}
