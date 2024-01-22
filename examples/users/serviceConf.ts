import { BaseAPI } from "../../src/baseAPI";
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
}
