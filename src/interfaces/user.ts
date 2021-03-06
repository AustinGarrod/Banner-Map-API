import EPermissions from '../enumerations/permissions';

export default interface IUser {
  username: string;
  password: string;
  salt: string;
  permissions: EPermissions[];
}