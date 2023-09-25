import { UserSignIn, UserSignUp } from '@dtos/auth.dtos';
import { UserUpdate } from '@dtos/users.dtos';
export type ISignInUser = UserSignIn;
export type ISignUpUser = UserSignUp;

interface IUser {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface ISignInResponse extends IUser {
  cookie?: string;
}

export type IUpdateUserRequest = UserUpdate;
export type IUpdateUserResponse = IUser;
