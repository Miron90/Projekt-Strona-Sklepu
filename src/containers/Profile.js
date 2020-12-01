import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import "../static/css/index.min.css";

class Profile extends React.Component {
  render() {
    var { authenticated, gotPermission } = this.props;

    authenticated = localStorage.getItem("token");
    gotPermission = localStorage.getItem("admin");
    return (
      <React.Fragment>
        <div className="main-container">
          <div className="second-container">
            {authenticated && gotPermission == "true" ? (
              <Link to="/products">
                <h1>Sprawdź produkty</h1>
              </Link>
            ) : authenticated ? (
              <h1> Jestes legitny</h1>
            ) : (
              <Redirect to="/" />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    gotPermission: state.auth.admin,
  };
};

export default withRouter(connect(mapStateToProps)(Profile));
