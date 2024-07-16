export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidQueryParameterError extends AppError {
  constructor(public message: string) {
    super(400, message);
  }
}
