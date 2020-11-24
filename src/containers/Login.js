import React from "react";
import { Message, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authLogin } from "../store/actions/auth";
import DjangoCSRFToken from "django-react-csrftoken";
import validate from "../validetors/validateLogin";

import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../static/css/login.min.css";

class LoginForm extends React.Component {
  state = {
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const validateOutcome = validate(this.state);
    const validateError = validateOutcome.validateError;
    this.state = validateOutcome.state;
    if (validateError) {
      const { email, password } = this.state;
      this.props.login(email, password);
    } else {
      this.forceUpdate();
    }
  };

  render() {
    const { error, loading, token } = this.props;
    const { email, password } = this.state;
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
          <Form onSubmit={this.handleSubmit}>
            <fieldset>
              <legend>Zaloguj się</legend>
              <Form.Group className="form-group reset-input ">
                <Form.Label className="form-label">Email address</Form.Label>
                <div className="input-icons reset-control">
                  <Form.Control
                    className="form-control input-field"
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Adres email"
                    required={true}
                    onChange={this.handleChange}
                  />
                  <i className="icon-user icon"></i>
                  {this.state.emailError && (
                    <div className="input-error">{this.state.emailError}</div>
                  )}
                </div>
              </Form.Group>
              <Form.Group className="form-group reset-input">
                <Form.Label className="form-label">Password</Form.Label>
                <div className="input-icons">
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Hasło"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                  />
                  <i className="icon-lock icon"></i>
                  {this.state.passwordError && (
                    <div className="input-error">
                      {this.state.passwordError}
                    </div>
                  )}
                </div>
              </Form.Group>
              <Button
                color="blue"
                fluid
                size="large"
                className="button"
                loading={loading}
                disabled={loading}
              >
                Zarejestruj
              </Button>
            </fieldset>
          </Form>
        </div>
        <Message>
          Jesteś tu nowy? <NavLink to="/signup">Zarejestruj się</NavLink>
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
    login: (email, password) => dispatch(authLogin(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
