export interface IServiceResponse<T = unknown> {
  ok: boolean;
  err?: string;
  data?: T;
}
