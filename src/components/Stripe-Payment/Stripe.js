import React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import Form from "./Form/Form";
import stripePublishKey from "../../env";

// Stripe payment component
class Stripe extends React.Component {
  render() {
    return (
      <>
        <StripeProvider apiKey={stripePublishKey}>
          <Elements>
            <Form />
          </Elements>
        </StripeProvider>
      </>
    );
  }
}

export default Stripe;
