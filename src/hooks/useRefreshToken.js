import axios from "../api/axios";
import { useAuthContext } from "../contexts/authContext";

const useRefreshToken = () => {
  const { updateTokens, removeToken, removeUser } = useAuthContext();

  /**
   * refresh the access token using refresh token
   * if refresh token is also expired, user is logged out and forced to log in again
   * @returns
   */
  const refresh = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DEV_SERVER_URL + "/auth/refresh",
        {
          withCredentials: true,
        }
      );
      // update access token in context and local storage
      updateTokens(response.data.accessToken);
      return response.data.accessToken;
    } catch (err) {
      // console.log(err);
      removeToken();
      removeUser();
    }
  };

  return refresh;
};

export default useRefreshToken;
