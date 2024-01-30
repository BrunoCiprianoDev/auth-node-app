export interface ITokenGenerator {
  getToken(...args: string[]): Promise<string>;
}
