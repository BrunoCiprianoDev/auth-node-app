export interface IDbClient {
  getInstance(): unknown;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
