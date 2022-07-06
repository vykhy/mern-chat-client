import axios from "../api/axios";
import { useAuthContext } from "../contexts/authContext";

const useRefreshToken = () => {
  const { updateTokens } = useAuthContext();

  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });
    console.log(response.data);
    updateTokens(response.data.accessToken);
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
