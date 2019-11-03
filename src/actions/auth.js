import { checkTokenExists, setToken } from "../helpers/auth";
import axios from "axios";

export const SET_USER_DATA = "SET_USER_DATA";
export const GET_USER_DATA = "GET_USER_DATA";
export const SET_AUTHENTICATED = "SET_AUTHENTICATED";

const fetchUser = () => {
  let url = "/me";
  if (process.env.NODE_ENV === "production") {
    url = "/me";
  } else {
    // Dev server runs on port 3000
    url = "http://localhost:3000/me";
  }

  return axios
    .get(url)
    .then(({ data: { data } }) => Promise.resolve(data))
    .catch(error => Promise.reject(error));
};

export const setUserData = user => ({
  type: SET_USER_DATA,
  user
});

export const getUserData = user => ({
  type: "GET_USER_DATA",
  user
});

export const setAuthenticated = authenticated => ({
  type: SET_AUTHENTICATED,
  authenticated
});

export const signInUser = dispatch => async credentials => {
  var url = "http://localhost:8080/login";
  if (process.env.NODE_ENV === "production") {
    url = "/login";
  } else {
    url = "http://localhost:8080/login";
  }

  try {
    const data = await axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      data: {
        email: credentials.email,
        password: credentials.password
      }
    });
    setToken(data.token);
    dispatch(setUserData(data));
    dispatch(setAuthenticated(true));
    return Promise.resolve(data);
  } catch (error) {
    console.log(error); //<--- Go down one more stream
    return Promise.reject(error);
  }
};

export const registerUser = dispatch => async credentials => {
  var url = "/register";
  if (process.env.NODE_ENV === "production") {
    url = "/register";
  } else {
    // Dev server runs on port 3000
    // url = "http://localhost:5000/api/register";
    url =
      "http://localhost:8080/register?email=" +
      credentials.email +
      "&password=" +
      credentials.password;
  }

  try {
    const data = await axios.post(url, credentials);
    setToken(data.token);
    dispatch(setUserData(data));
    dispatch(setAuthenticated(true));
    return Promise.resolve(data);
  } catch (error) {
    console.log(error); //<--- Go down one more stream
    return Promise.reject(error);
  }
};

export function clearAuth(dispatch) {
  setToken(null);
  dispatch(setUserData(null));
  dispatch(setAuthenticated(false));
}

export const logoutUser = dispatch => cb => {
  return clearAuth(dispatch);
};

export const facebookSignIn = dispatch => async credentials => {
  var url = "/connect/facebook";
  if (process.env.NODE_ENV === "production") {
    url = "/connect/facebook";
  } else {
    // url = "http://localhost:8443/connect/facebook";
    url = "http://localhost:8080/connect/facebook";
  }

  try {
    const data = await axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
    });
    setToken(data.token);
    dispatch(setUserData(data));
    dispatch(setAuthenticated(true));
    return Promise.resolve(data);
  } catch (error) {
    // console.log(error);
    return Promise.reject(error);
  }
};

export const initAuthFromExistingToken = cb => dispatch => {
  checkTokenExists()
    .then(token => {
      setToken(token);
      fetchUser()
        .then(data => {
          dispatch(setUserData(data));
          dispatch(setAuthenticated(true));
          cb();
        })
        .catch(anyError => {
          dispatch(clearAuth());
          cb();
        });
    })
    .catch(anyError => {
      dispatch(clearAuth());
      cb();
    });
};
