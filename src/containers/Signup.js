import React from "react";
import { Button, Grid, Header, Message, Segment } from "semantic-ui-react";

import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authSignup } from "../store/actions/auth";
import DjangoCSRFToken from "django-react-csrftoken";
import validate from "../validetors/valideSignUp";

import "bootstrap/dist/css/bootstrap.min.css";
import "../static/css/signUp.min.css";
import "../static/css/fontello.css";

class RegistrationForm extends React.Component {
  state = {
    username: "",
    email: "",
    password1: "",
    password2: "",
    usernameError: "",
    emailError: "",
    password1Error: "",
    password2Error: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    //wykonja validacje po stronie klienta
    const validateOutcome = validate(this.state);
    const validateError = validateOutcome.validateError;
    this.state = validateOutcome.state;
    if (validateError) {
      const { username, email, password1, password2 } = this.state;
      this.props.signup(username, email, password1, password2);
    } else {
      this.forceUpdate();
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { username, email, password1, password2 } = this.state;
    const { error, loading, token } = this.props;
    if (token) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <div className="error">
          {error &&
            (this.props.error.message ? (
              <p>{this.props.error.message}</p>
            ) : (
              <p>{this.props.error}</p>
            ))}
        </div>
        <div className="signUpForm">
          <DjangoCSRFToken />

          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Stwórz konto</legend>
              <div className="form-group">
                <label className="control-label" htmlFor="username">
                  Nazwa użytkownika
                </label>
                <div className="input-icons">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nazwa użytkownika"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                  />
                  <i className="icon-user icon"></i>
                  {this.state.usernameError && (
                    <div className="input-error">
                      {this.state.usernameError}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="control-label" htmlFor="email">
                  Email
                </label>
                <div className="input-icons">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                  />
                  <i className="icon-mail-alt icon"></i>
                  {this.state.emailError && (
                    <div className="input-error">{this.state.emailError}</div>
                  )}
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="control-label" htmlFor="password1">
                  Hasło
                </label>
                <div className="input-icons">
                  <input
                    id="password1"
                    name="password1"
                    type="password"
                    placeholder="Hasło"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                  />
                  <i className="icon-lock icon"></i>
                  {this.state.password1Error && (
                    <div className="input-error">
                      {this.state.password1Error}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="control-label" htmlFor="password2">
                  Powtórz hasło
                </label>
                <div className="input-icons">
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    placeholder="Powtórz hasło"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                  />
                  <i className="icon-lock icon"></i>
                  {this.state.password2Error && (
                    <div className="input-error">
                      {this.state.password2Error}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label" htmlFor=""></label>
                <div className="signup-btn">
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    Zarejestruj
                  </Button>
                </div>
              </div>
              <div className="float-none"></div>
            </fieldset>
          </form>
        </div>
        <Message className="message">
          Jesteś już zarejestrowany <NavLink to="/login">Zaloguj się</NavLink>
        </Message>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (username, email, password1, password2) =>
      dispatch(authSignup(username, email, password1, password2)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
