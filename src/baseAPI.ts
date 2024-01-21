type Method = "GET" | "POST" | "PUT" | "DELETE";
type Headers = { [key: string]: string };


export class BaseAPI {
  headers: Headers;
  endpointUrl: string;
  errorExceptionClass: any;
  errorLoggingFunc?: (error: unknown) => void;
  token?: string;

  constructor(token?: string) {
    this.token = token;
    this.endpointUrl = "";
    this.headers = {"content-type": "application/json"};
    this.errorExceptionClass = Object;
  }

  async _apiCall(method: Method, query = "", data?: unknown) {
    const url = this.endpointUrl + query;
    try {
      const resp = await fetch(url, {
        method: method,
        headers: this.headers,
        body: JSON.stringify(data),
      });
      return await resp.json();
    } catch (error: any) {
      const statusCode = error.response?.status || undefined;
      this.errorLoggingFunc && this.errorLoggingFunc(error);
      throw new this.errorExceptionClass(statusCode);
    }
  }

  async get(arg?: number | string) {
    if (arg) {
      if (!Number.isNaN(Number(arg))) {
        arg = `/${arg}`
      }
      return await this._apiCall('GET', arg as string)
    }
    return await this._apiCall("GET");
  }

  async create(data: unknown, requestQuery?: string) {
    return await this._apiCall("POST", requestQuery, data);
  }

  async update(arg: number | string, data: unknown) {
    if (!Number.isNaN(Number(arg))) {
      arg = `/${arg}`;
    }
    return await this._apiCall("PUT", arg as string, data);
  }

  async delete(id: number | string) {
    return await this._apiCall("DELETE", `/${id}`);
  }
}
