# japi
JAPI is a Javascript client service for REST based APIs integration. Japi considers each api resource to be an object, there by leveraging on the power of object oriented design to improve code reusabilty by eliminating code redundancy and boilerplate code for every API endpoint call. 

## Goals:

 - Improve code reuserbility
 - Eliminate API calls boilerplate code
 - Achieve cleaner frontend API service


Japi provide you with an extensible `BaseAPI` class that implements basic request CRUD operation, and allow you as a developer to extend it for more specific api operations like resource searching etc, leveraging on the pre-defined methods like `get`, `create`, `update`, and `delete`.

## Examples

Lets say we have a backend API sitting at `https://example.com/api` and we're trying to implement a frontend service that will handle connecting to different resources withing the API.

### Configuration for Basic CRUD operations

 Lets say we want to connect to `users` resource at `https://example.com/api/users` and we want our frontend service to handle CRUD operations for the users resourse. All we need to do is what is shown below:

 ```js
import { BaseAPI } from "japi";
import { ApiException } from "../apiException";


export class UserAPI extends BaseAPI {
  endpointUrl = "https://example.com/api/users";    // (required)
  headers = {
    "content-type": "application/json",
    "Authorization": `Bearer ${this.token}`,
  };
  errorExceptionClass = ApiException;               // A custom Exception class (required)
}
 ```
The above code is the most basic configuration for `japi`, we start by importing `BaseAPI` class from `japi` and supply to it some required info like the resource endpoint url, the API required headers, and `errorExceptionClass` which is required as it is going to be called when something went wrong in the API communication with the status code as argument. below is the example usage for the configuration above:

```js
import { UserAPI } from "./serviceConf";

const userData = {
  name: "Ahmad Ameen",
  email: "ahmadmameen7@gmail.com",
  phone: "+2348083431164",
}

const userCreateData = {
  ...userData,
  password: "************"
}

const token = "token-yeuyyu7834yudfshdhgrje7h"

const userAPI = new UserAPI(token);

const allUsers = userAPI.get();
const singleUser = userAPI.get(1)                               // 1 is the user id
const usersSearchResult = userAPI.search({
  active: true, 
  name: "Ahmad Ameen"
})

const userCreateResponse = userAPI.create(userCreateData)
const userUpdateResponse = userAPI.update(1, userData)          // 1 is the user id
const userDeleteResponse = userAPI.delete(1)                    // 1 is the user id
```

## Configuration with more specific operations

Using same analogy as before, for the sake of example, let say you want to connect to a user profiles details which is sitting at `https://example.com/api/users/<id>/profiles`:

```js
import * as Sentry from '@sentry/react';
import { BaseAPI } from "japi";
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
  errorLoggingFunc = Sentry.captureException;      // error logging function that accept error object as argument like Sentry (optional)

  async getUserProfiles (userId: number) {
    this.setEndpointUrl(this.endpointUrl + `/${userId}/profiles`);
    return await this.get();
  }

  async getUserProfile (userId: number, profileId: number) {
    this.setEndpointUrl(this.endpointUrl + `/${userId}/profiles`);
    return await this.get(profileId);
  }
}
```
below is the example usage for the configuration above:

```js
import { UserAPI } from "./serviceConf";

const userData = {
  name: "Ahmad Ameen",
  email: "ahmadmameen7@gmail.com",
  phone: "+2348083431164",
}

const userCreateData = {
  ...userData,
  password: "************"
}

const token = "token-yeuyyu7834yudfshdhgrje7h"

const userAPI = new UserAPI(token);

const allUsers = userAPI.get();
const singleUser = userAPI.get(1);                               // 1 is the user id
const usersSearchResult = userAPI.search({
  active: true, 
  name: "Ahmad Ameen"
})

const allUserProfiles = userAPI.getUserProfiles(1);
const singleUserProfile = userAPI.getUserProfile(1, 2);          // 1 is the userId, and 2 is the ProfileId 

const userCreateResponse = userAPI.create(userCreateData);
const userUpdateResponse = userAPI.update(1, userData);          // 1 is the user id
const userDeleteResponse = userAPI.delete(1);                    // 1 is the user id
```

Another different example of configuration with specific usecase is when you need your service to return a specific part of the request response. Below is an example:

```js
import { BaseAPI } from "japi";


type FilterType = SearchObj[];

export class PatientAPI extends BaseAPI {
  endpointUrl = `http://example.com/fhir/rest/v1/fhir/Patient`;
  headers = {
    "content-type": "application/fhir+json",
    "Authorization": `Bearer ${this.token}`,
  };

  async searchPatients(searchObj) {
    const data = this.search(searchObj);
    return data.entry;
  }
}
```

below is the example usage for the configuration above:

```js
import { PatientAPI } from "./serviceConf";


const token = "token-yeuyyu7834yudfshdhgrje7h";

const patientAPI = new PatientAPI(token);

const searchObj = {
  active: "true",
  name: name,
  count: limit || "",
  _getpagesoffset: offset || "",
}

const patientSearchResult = patientAPI.searchPatients(searchObj)    // returns entry part of the search() response
```

## Configuration parameters
| param               | required | description                                                                             |
|---------------------|----------|-----------------------------------------------------------------------------------------|
| endpointUrl         | 'Yes'    | The API resource url you're configuring for                                             |
| headers             | 'No'     | The required API request headers                                                        |
| errorExceptionClass | 'Yes'    | Exception class to be called when request failed, the class should accept a status code |
| errorLoggingFunc    | 'No'     | Error logging function to be called when request failed (e.g `Sentry.captureException`) |

## Pre-defined methods
| name                | description                                                 | argument(s)                                     |
|---------------------|-------------------------------------------------------------|-------------------------------------------------|
| setEndpointUrl      | This method update the set endpointUrl with the provide url | url: string
| get                 | This method query the given resource url to retrieve list of record or get retrieve single record if an id is provided | id?: number |
| search              | This method query the given resource url to retrieve list of record based on the provided search params | searchObj: Object |
| create              | This method create a new record in the given resource | createData: Object                                    |
| update              | This method update a record in the given resource     | id: number, updateData: Object
| delete              | This method delete a record in the given resource     | id: number


## Contribute
Join me by [github issues](https://github.com/mameen7/japi/issues) or pull-requests
