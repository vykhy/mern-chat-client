import axios from "axios";

/**
 * axios instance for signing in or logging out
 */
export default axios.create();

/**
 * axios instance to be used where authentication and authorization is required
 * contains access token and user id of curren user
 */
export const axiosPrivate = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});
