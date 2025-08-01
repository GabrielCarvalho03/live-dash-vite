import Cookies from "js-cookie";
import { useAuthStore } from "../hooks/Auth/useAuth";

export const GetTokenUser = () => {
  const token = localStorage.getItem("liveToken");
  const { setToken } = useAuthStore.getState();

  if (token) {
    setToken(token);
  }

  return token;
};
