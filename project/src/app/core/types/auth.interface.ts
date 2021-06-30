import { User } from "./user.interface";


export interface Authenticate {
    username: string;
    password: string;
}

export interface AuthenticationResult {
  auth: boolean;
  token: string;
  user: User;
}
