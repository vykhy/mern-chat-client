import axios from "../api/axios";
import { useAuthContext } from "../contexts/authContext";

const useRefreshToken = () => {
  const { updateTokens, removeToken, removeUser } = useAuthContext();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
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
