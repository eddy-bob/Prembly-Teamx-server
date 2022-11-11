export interface customErrorInterface {
  statusCode: number;
  message: string;
}
export default class customError extends Error implements customErrorInterface {
  statusCode: number;
  constructor(message?: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode as number;
    Object.setPrototypeOf(this, customError.prototype);
  }
}
