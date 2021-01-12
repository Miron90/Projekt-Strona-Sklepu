import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Segment,
  Icon,
} from "semantic-ui-react";
import "../static/css/HomepageLayout.min.css";
import { Link } from "react-router-dom";

class HomepageLayout extends React.Component {
  render() {
    const { authenticated } = this.props;

    return (
      <React.Fragment>
        <div className="home-page">
          <h1>Witaj na stronie sklepu</h1>
          <p1>Czego potrzebujesz?</p1>
          <div className="home-page-button-list">
            {authenticated ? (
              <Link to="/product/show">
                <Button
                  color="black"
                  className="button-hompage-products"
                  variant="primary"
                  size="massive"
                >
                  Zobacz asortyment
                  <Icon name=" shopping basket" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  color="grey"
                  className="button-hompage-login"
                  variant="primary"
                  size="massive"
                >
                  Zaloguj się
                  <Icon name="right arrow" />
                </Button>
              </Link>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomepageLayout)
);
