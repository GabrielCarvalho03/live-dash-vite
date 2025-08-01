import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export const verifyUserToken = (router: AppRouterInstance) => {
  const token = localStorage.getItem("liveToken");
  console.log("token,", token);

  if (!token) {
    router.replace("//");
  }
};
