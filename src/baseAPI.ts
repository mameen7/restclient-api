type Method = "GET" | "POST" | "PUT" | "DELETE";

type Headers = { [key: string]: string };

type SearchObj = {
  [key: string]: string;
};

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

  setEndpointUrl (url: string) {
    this.endpointUrl = url
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

  async search (searchObj: SearchObj) {
    let requestQuery = "?";
    Object.keys(searchObj).forEach((key: string, i: number) => {
      requestQuery += `${key}=${searchObj[key]}${i < (Object.keys(searchObj).length - 1) ? "&" : ""}`;
    });
    return await this.get(requestQuery);
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
