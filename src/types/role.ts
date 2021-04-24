import User from "./user";

export default interface Role extends Parse.Object {
  name: string;
  users: Parse.Relation<Role, User>;
  roles: Parse.Relation<Role, Role>;
  type: string;
}