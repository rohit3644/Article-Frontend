import React from "react";
import { withRouter, Redirect } from "react-router-dom";

class AdminDashboard extends React.PureComponent {
  render() {
    if (localStorage.getItem("api_token") === null) {
      return <Redirect to="/login" />;
    } else if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("is_admin") === "No"
    ) {
      return <Redirect to="/user-dashboard" />;
    }
    return <div>This is admin dashboard page after login</div>;
  }
}

export default withRouter(AdminDashboard);
