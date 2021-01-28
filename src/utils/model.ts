import { Parse } from "../config/Consts";

export function cleanData(data: any): any {
  for (const key of ["className", "objectId"]) {
    delete data[key];
  }
  return data;
}

export class SaveModel {
  readonly className: string;
  readonly objectId: string;
  updates: any;

  constructor(className: string, objectId: string, updates: any){
    this.className = className;
    this.objectId = objectId;
    this.updates = updates;
  }

  toParse(): Parse.Object {
    const Model = Parse.Object.extend(this.className);
    const model = new Model({id: this.objectId});
    model.set(this.updates);
    return model;
  }
}

export class CreateModel {
  readonly className: string;
  [attr: string]: any;

  constructor(className: string, data: any){
    this.className = className;
    Object.assign(this, data);
  }

  toParse(): Parse.Object {
    const Model = Parse.Object.extend(this.className);
    const model = new Model(this);
    model.unset("className");
    return model
  }
}

export class Model {
  readonly className: string;
  readonly objectId: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  [attr: string]: any;

  constructor(className: string, objectId: string, obj: any){
    this.className = className;
    this.objectId = objectId;
    Object.assign(this, cleanData(obj));
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

  prepareSave(updates: any): SaveModel {
    return new SaveModel(
      this.className,
      this.objectId,
      updates
    )
  }
}


export function toModel(o: Parse.Object | Parse.User): Model {
  const m = new Model(o.className, o.id, o.toJSON ? o.toJSON() : o);
  return m
}