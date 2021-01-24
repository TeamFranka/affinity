import { onBeforeRouteLeave } from "vue-router";
import { Parse } from "../config/Consts";

export class Model {
  readonly className: string;
  readonly objectId: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  [attr: string]: any;

  constructor(className: string, objectId: string, obj: any){
    this.className = className;
    this.objectId = objectId;
    Object.assign(this, obj);
  }

  toPointer(): Parse.Pointer {
    return {
      __type: "Pointer",
      className: this.className,
      objectId: this.objectId,
    }
  }

  isDataAvailable(): boolean {
    return !!this.createdAt
  }
}

export function toModel(o: Parse.Object | Parse.User): Model {
  const m = new Model(o.className, o.id, o.toJSON ? o.toJSON() : o);
  return m
}