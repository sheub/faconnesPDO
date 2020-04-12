import { SET_AUTHENTICATED, SET_USER_DATA } from "../actions/auth";

// Default auth state
const defaultAuthState = {
  user: null,
  firstname: "",
  lastname: "",
  authenticated: false,
};

const authReducer = (state = defaultAuthState, action) => {
  // export default (state = { user: null, authenticated: false }, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return Object.assign({}, state, { user: action.user });
    case SET_AUTHENTICATED:
      return Object.assign({}, state, {
        authenticated: action.authenticated,
      });
    default:
      return state;
  }
};
export default authReducer;
export { authReducer, defaultAuthState };
