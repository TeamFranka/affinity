export default interface TTeam extends Parse.Object {
  objectId: string;
  name: string;
  slug: string;
  leaders: Parse.Pointer; // to Role
  members: Parse.Pointer; // to Role
  mods: Parse.Pointer; // to Role
  agents: Parse.Pointer; // to Role
  publishers: Parse.Pointer; // to Role
  subOf?: Parse.Pointer; // to Team
  membershipAccess?: 'open' | 'parent_open' | 'apply' | ' parent_apply' | 'invite'; // open is default
  avatar?: Parse.File;
  background?: Parse.File;
  customStyles?: string;
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
}