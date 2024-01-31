export interface IPasswordEncryptor {
  encryptor(password: string): Promise<string>;
  passwordCompare(password: string, passwordEncrypt: string): Promise<boolean>;
}
