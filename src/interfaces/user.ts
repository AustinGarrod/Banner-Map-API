export default interface IUser {
  username: string;
  password: string;
  salt: string;
  permissions: string[];
}