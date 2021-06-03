import Parse from "parse";
import { Model, MinimalModelData } from "./model";

export interface TeamData extends MinimalModelData {
  name: string;
  slug: string;
}

export class Team extends Model {
  name: string;
  slug: string;
  leaders?: Parse.Pointer | Parse.Role; // to Role
  members?: Parse.Pointer | Parse.Role; // to Role
  mods?: Parse.Pointer | Parse.Role; // to Role
  agents?: Parse.Pointer | Parse.Role; // to Role
  publishers?: Parse.Pointer | Parse.Role; // to Role
  subOf?: Parse.Pointer | Parse.Object<Team>; // to Team
  membershipAccess?: 'open' | 'parent_open' | 'apply' | ' parent_apply' | 'invite'; // open is default
  avatar?: Parse.File;
  background?: Parse.File;
  customStyles?: Partial<CSSStyleDeclaration>;
  info?: string;
  canPost?: string;
  canComment?: string;
  canLike?: string;
  canCreatePicture?: string;
  canCreatePoll?: string;
  canCreateLink?: string;
  canCreateDocument?: string;
  canCreateFaqEntry?: string;
  canEditFaqEntry?: string;
  socialLinks?: string[];
  footerLinks?: string[];

  constructor(options: TeamData) {
    super(options);
    this.name = options.name;
    this.slug = options.slug;
  }
}