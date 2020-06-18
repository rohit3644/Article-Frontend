import React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import Form from "./Form/Form";

class Stripe extends React.Component {
  render() {
    return (
      <>
        <StripeProvider
          apiKey={
            "pk_test_51Gv6GwK0qridE54QPYxHL5MCLM3GRjGrV8lfOl8Yqd40jiKLO1H48grP6Xu2UWgL7Y7coRTqRHBVqN5aYvaAo5Yg00A82rfzsQ"
          }
        >
          <Elements>
            <Form />
          </Elements>
        </StripeProvider>
      </>
    );
  }
}

export default Stripe;
