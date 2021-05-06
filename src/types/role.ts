import Parse from "parse";
import { TModel } from "./globals";
import { ParseUser } from "./user";

export default interface TRole extends TModel {
  name: string;
  users: Parse.Relation<ParseRole, ParseUser>;
  roles: Parse.Relation<ParseRole, ParseRole>;
  type: string;
}

export type ParseRole = Parse.Object<TRole>;
