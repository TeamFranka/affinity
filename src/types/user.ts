export default interface User extends Parse.Attributes {
  createdAt: any;
  email: string;
  name: string;
  sessionToken: string;
  settings?: {
    welcomeDone?: boolean,
    [key: string]: any,
  };
  updatedAt: any;
  username: string;
}

export type ParseUser = Parse.User<User>