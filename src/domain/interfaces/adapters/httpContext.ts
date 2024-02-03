export interface IResponse {
  statusCode: number;
  body: unknown;
}

export interface IRequest {
  headers: Record<string, unknown>;
  body: unknown;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
}

export interface IHttpContext {
  getRequest(): IRequest;
  send(response: IResponse): void;
}
