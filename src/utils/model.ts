import { Parse } from "../config/Consts";

export interface Model {
  className: string;
  id: string;
  [attr: string]: any;
}

export function toModel(o: Parse.Object): Model {
  const json: any = o.toJSON();
  json.className = o.className;
  json.id = o.id;
  return Object.freeze(json);
}