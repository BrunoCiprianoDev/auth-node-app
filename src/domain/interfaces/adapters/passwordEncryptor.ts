export interface IPasswordEncryptor {
  encryptor(password: string): Promise<string>;
}
