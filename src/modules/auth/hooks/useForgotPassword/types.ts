import { NavigateFunction } from "react-router-dom";
import {
  ForgotPasswordDataInStep1,
  ForgotPasswordDataInStep2,
} from "./forgotPassordSchema";

export type handleChangePasswordProps = {
  data: ForgotPasswordDataInStep2;
  token: string;
  navigate: NavigateFunction;
};

export interface ForgotPasswordTypes {
  forgotStep: number;
  setForgotStep: (value: number) => void;

  forgotPasswordIsLoading: boolean;
  setForgotPasswordIsLoading: (value: boolean) => void;

  forgotPasswordIsSuccess: boolean;
  setForgotPasswordIsSuccess: (value: boolean) => void;

  handleChangePassword: ({
    data,
    token,
    navigate,
  }: handleChangePasswordProps) => Promise<void>;
  handleSendEmailWithToken: (data: ForgotPasswordDataInStep1) => Promise<void>;
}
