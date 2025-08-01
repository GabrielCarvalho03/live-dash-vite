import { useParams } from "react-router-dom";
import { ChangeNewPassword } from "../components/changeNewPassword";

export default function ForgotPasswordWithToken() {
  const { token } = useParams();

  console.log("token", token?.toString);
  return <ChangeNewPassword token={token?.toString() ?? ""} />;
}
