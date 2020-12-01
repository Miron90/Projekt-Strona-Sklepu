import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  token: null,
  admin: null,
  loginError: null,
  registerError: null,
  loading: false,
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    admin: action.admin,
    loginError: null,
    RegisterError: null,
    loading: false,
  });
};

const authLoginFail = (state, action) => {
  return updateObject(state, {
    loginError: action.loginError,
    RegisterError: null,
    admin: null,
    loading: false,
  });
};
const authRegisterFail = (state, action) => {
  console.log(action);
  return updateObject(state, {
    registerError: action.registerError,
    loginError: null,
    admin: null,
    loading: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    admin: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_LOGIN_FAIL:
      return authLoginFail(state, action);
    case actionTypes.AUTH_REGISTER_FAIL:
      return authRegisterFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
