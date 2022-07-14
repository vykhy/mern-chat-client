import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuthContext } from "../contexts/authContext";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { accessToken } = useAuthContext();

  /**
   * set interceptors for the axiosPrivate instance
   * automatically sets access token in header
   * and user id in header so that we can access it easily to perfom DB queries
   */
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      // we can write a callback that changes the value before returning it to update the state
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      // return response like normal if there is no error
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // if there is error and the error code is 403
        // it is because of expired token, thus we refresh the token
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        // reject other errors
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
