import { BaseAPI } from "../../baseAPI";
import { ApiException } from "../apiException";


type SearchObj = {
  [key: string]: string;
};

export class UserAPI extends BaseAPI {
  endpointUrl = "https://example.com/api/users";
  headers = {
    "content-type": "application/json",
    "Authorization": `Bearer ${this.token}`,
  };
  errorExceptionClass = ApiException;

  async search (searchObj: SearchObj) {
    let requestQuery = "?active=true";
    Object.keys(searchObj).forEach((key: string) => {
      requestQuery += `&${key}=${searchObj[key]}`;
    });
    return await this.get(requestQuery);
  }
}
