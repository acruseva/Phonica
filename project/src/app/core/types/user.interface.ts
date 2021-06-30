import { Identifiable, IdType } from "./common-types";

export interface IUser extends Identifiable {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: Role;
    avatar?: string;
  }
  
  export enum Role {
      CUSTOMER = 1, OPERATOR, ADMIN
  }
  
  export class User implements IUser {
    static typeId = 'User';
    constructor(
          public id: IdType,
          public username: string,
          public email: string,
          public password: string,
          public firstName?: string,
          public lastName?: string,
          public role: Role = Role.CUSTOMER,
          public avatar?: string) {
      }
  
  }
  