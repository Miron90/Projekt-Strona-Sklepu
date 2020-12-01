import axios from "axios";
import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, admin) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    admin: admin,
  };
};

export const authLoginFail = (error) => {
  return {
    type: actionTypes.AUTH_LOGIN_FAIL,
    loginError: error,
  };
};

export const authRegisterFail = (error) => {
  return {
    type: actionTypes.AUTH_REGISTER_FAIL,
    registerError: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/login/", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (!res.data.error) {
          const token = res.data.key;
          const admin = res.data.perm;
          const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
          localStorage.setItem("token", token);
          localStorage.setItem("admin", admin);
          localStorage.setItem("expirationDate", expirationDate);
          dispatch(authSuccess(token, admin));
          dispatch(checkAuthTimeout(3600));
        } else {
          dispatch(authLoginFail(res.data.error));
          return false;
        }
      })
      .catch((err) => {
        dispatch(authLoginFail(err));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/register/", {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
      })
      .then((res) => {
        if (!res.data.error) {
          const token = res.data.key;
          const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
          localStorage.setItem("token", token);
          localStorage.setItem("expirationDate", expirationDate);
          dispatch(authSuccess(token));
          dispatch(checkAuthTimeout(3600));
        } else {
          dispatch(authRegisterFail(res.data.error));
        }
      })
      .catch((err) => {
        dispatch(authRegisterFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, admin));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
