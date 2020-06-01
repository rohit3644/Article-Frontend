import React from "react";
import { withRouter, Redirect } from "react-router-dom";

class UserDashboard extends React.PureComponent {
  render() {
    if (localStorage.getItem("api_token") === null) {
      return <Redirect to="/login" />;
    } else if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("is_admin") === "Yes"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }
    return <div>This is user dashboard page after login</div>;
  }
}

export default withRouter(UserDashboard);
