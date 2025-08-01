"use client";

import { SendEmailWithToken } from "../components/sendEmailWithToken";
import { SuceessSendEmail } from "../components/SucessSendEmail";
import { useForgotPassword } from "../hooks/useForgotPassword/useForgotPasswod";

export default function PageForgotPassword() {
  const { forgotPasswordIsSuccess } = useForgotPassword();
  return (
    <>
      {!forgotPasswordIsSuccess && <SendEmailWithToken />}
      {forgotPasswordIsSuccess && <SuceessSendEmail />}
    </>
  );
}
