import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Input,
  Dropdown,
  Pagination,
  Form,
  Message,
  Icon,
  Popup,
} from "semantic-ui-react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import validate from "../validetors/valideSignUp";
import "../static/sass/profileEditor.css";
import "../static/css/fontello.css";
import DjangoCSRFToken from "django-react-csrftoken";

class ProfileEditor extends React.Component {
  state = {
    username: "",
    email: "",
    password1: "",
    password2: "",
    usernameError: "",
    emailError: "",
    password1Error: "",
    password2Error: "",
    token: "",
    eidted: false,
  };

  // wysylanie() {
  //   axios.post("adres", { 'dane'}).then()
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const validateOutcome = validate(this.state);
    const validateError = validateOutcome.validateError;
    this.state = validateOutcome.state;
    if (validateError) {
      const { username, email, password1, password2 } = this.state;
      axios
        .post("http://127.0.0.1:8000/updateuser/", {
          username: username,
          password1: password1,
          password2: password2,
          token: this.state.token,
        })
        .then((res) => {
          console.log(res.data);
          if (!res.data.error) {
            this.state.eidted = true;
          } else {
            this.state.eidted = false;
            productsClass.state.error = res.data.error;
          }
          this.forceUpdate();
        })
        .catch((err) => {
          console.log(err);
          this.state.eidted = false;
        });
      // wysylanie()
      // this.props.signup(username, email, password1, password2);
    } else {
      this.forceUpdate();
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { registerError, loading, token } = this.props;
    this.state.token = token;
    if (!token) {
      return <Redirect to="/" />;
    }
    if (this.state.eidted) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <div className="error">
          {registerError &&
            (this.props.registerError.message ? (
              <p>{this.props.registerError.message}</p>
            ) : (
              <p>{this.props.registerError}</p>
            ))}
        </div>
        <div className="signUpForm">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <DjangoCSRFToken />
            <fieldset>
              <legend>Edytuj profil</legend>
              <div className="form-group">
                <label className="control-label" htmlFor="username">
                  Nazwa użytkownika
                </label>
                <Popup
                  trigger={
                    <span
                      style={{
                        marginLeft: "20px",
                        fontSize: "16px",
                        backgroundColor: "#e0e0e0",
                        padding: "8px",
                      }}
                    >
                      ?
                    </span>
                  }
                >
                  1. Minimum 8 liter bądź cyfr <br></br> 2. Pierwsza litera musi
                  być wielka
                </Popup>
                <div className="input-icons">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nazwa użytkownika"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                    value={this.state.username}
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
                <label className="control-label" htmlFor="password1">
                  Nowe hasło
                </label>
                <Popup
                  trigger={
                    <span
                      style={{
                        marginLeft: "20px",
                        fontSize: "16px",
                        backgroundColor: "#e0e0e0",
                        padding: "8px",
                      }}
                    >
                      ?
                    </span>
                  }
                >
                  1. Hasło musi zawierać 8 znaków
                </Popup>
                <div className="input-icons">
                  <input
                    id="password1"
                    name="password1"
                    type="password"
                    placeholder="Nowe hasło"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                    value={this.state.password1}
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
                <Popup
                  trigger={
                    <span
                      style={{
                        marginLeft: "20px",
                        fontSize: "16px",
                        backgroundColor: "#e0e0e0",
                        padding: "8px",
                      }}
                    >
                      ?
                    </span>
                  }
                >
                  1. Hasło musi zawierać 8 znaków
                </Popup>
                <div className="input-icons">
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    placeholder="Powtórz hasło"
                    className="form-control input-field"
                    required={true}
                    onChange={this.handleChange}
                    value={this.state.password2}
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
                    Zapisz zmiany
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
    registerError: state.auth.registerError,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (username, email, password1, password2) =>
      dispatch(authSignup(username, email, password1, password2)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditor);
