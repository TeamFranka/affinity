import { Model, MinimalModelData } from "./model";

export interface UserData extends MinimalModelData {
  username: string;
}

export default class User extends Model {
  username: string;
  email?: string;
  name?: string;
  sessionToken?: string;
  settings?: {
    welcomeDone?: boolean,
    [key: string]: any,
  };

  constructor(options: UserData) {
    super(options);
    this.username = options.username;
  }
}