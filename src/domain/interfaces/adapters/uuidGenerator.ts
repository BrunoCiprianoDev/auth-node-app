export interface IuuidGenerator {
  generate(): Promise<string>;
}
