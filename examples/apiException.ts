export class ApiException extends Error {
  statusCode?: number;
  message: string;

  constructor(statusCode?: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message || "Unexpected error occured";

    switch (this.statusCode) {
      case 400:
        this.message = "Bad request";
        break;
      case 401:
        this.message = "Not authorized";
        break;
      case 403:
        this.message = "Forbidden";
        break;
      case 404:
        this.message = "Not found";
        break;
      case 408:
        this.message = "Time Out";
        break;
      case 500:
        this.message = "Server Down";
        break;
      default:
        this.message;
        break;
    }
  }
}

export default ApiException;
