import { checkTokenExists, setToken } from "../helpers/auth";
import axios from 'axios';

export const SET_USER_DATA = "SET_USER_DATA";
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

export const setAuthenticated = authenticated => ({
  type: SET_AUTHENTICATED,
  authenticated
});

export const signInUser = dispatch => credentials => {

  var url = "http://localhost:8080/login";
    if (process.env.NODE_ENV === "production") {
      url = "/login";
    } else {
      url = "http://localhost:8080/login";
    }

    return axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      data: {
        email: credentials.email,
        password: credentials.password
      }
    }).then((data) => {
        setToken(data.token);
        dispatch(setUserData(data));
        dispatch(setAuthenticated(true));
        return Promise.resolve(data);
      }
    ).catch(error => {
      console.log(error); //<--- Go down one more stream
      return Promise.reject(error);
   });
};

// export const googleSignIn = credentials => dispatch => {
//   var url = "/api/google/signin";
//   if (process.env.NODE_ENV === "production") {
//     url = "/api/google/signin";
//   } else {
//     // Dev server runs on port 5000
//     url = "http://localhost:5000/api/google/signin";
//   }
//   return axios
//     .post(url, credentials)
//     .then(({ data: { data, meta } }) => {
//       setToken(meta.token);
//       dispatch(setUserData(data));
//       dispatch(setAuthenticated(true));
//       return Promise.resolve({ data, meta });
//     })
//     .catch(error => {
//       return Promise.reject(error);
//     });
// };

export const registerUser = credentials => dispatch => {
  var url = "/api/register";
  if (process.env.NODE_ENV === "production") {
    url = "/api/register";
  } else {
    // Dev server runs on port 3000
    // url = "http://localhost:5000/api/register";
    url =
      "http://localhost:8080/register?email=" +
      credentials.email +
      "&password=" +
      credentials.password;
  }

  return axios
    .post(url, credentials)
    .then(({ data: { data, meta } }) => {
      setToken(meta.token);
      dispatch(setUserData(data));
      dispatch(setAuthenticated(true));
      return Promise.resolve({ data, meta });
    })
    .catch(error => {
      console.log(error); //<--- Go down one more stream
      return Promise.reject(error);
    });
};

export function clearAuth(dispatch) {
  setToken(null);
  dispatch(setUserData(null));
  dispatch(setAuthenticated(false));
};

export const logoutUser = dispatch => cb => {
    return clearAuth(dispatch)
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
