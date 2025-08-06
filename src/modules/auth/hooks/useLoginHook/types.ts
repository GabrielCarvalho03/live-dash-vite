import { NavigateFunction } from "react-router-dom";
import { LoginDataSchema } from "./LoginSchema";

export type user = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  status: "Active" | "Inactive";
  createdAt: string;
  userType: string;
  permitions: string[];
  firstLogin: boolean;
  hourFuse: string;
};

export interface LoginType {
  loginisLoading: boolean;
  setLoginisLoading: (value: boolean) => void;

  user: user | null;
  setUser: (user: user | null) => void;
  handleGetUser: (
    data: LoginDataSchema,
    navigate: NavigateFunction
  ) => Promise<void>;

  handleGetUserById: () => Promise<user | null>;

  logout: (route: any) => Promise<void>;
  getRandomColor: () => string;
}
