export class ResponseError extends Error {
  public error: number;
  constructor(message: string, status: number = 500) {
    super(message);

    Error.captureStackTrace(this);

    this.error = status;
  }
}
export type NewError = Error & { error: number };
