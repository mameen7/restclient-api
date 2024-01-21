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
const singleUser = userAPI.get(1) // 1 is the user id
const usersSearchResult = userAPI.search({name: "Ahmad Ameen"})

const userCreateResponse = userAPI.create(userCreateData)
const userUpdateResponse = userAPI.update(1, userData) // 1 is the user id
const userDeleteResponse = userAPI.delete(1) // 1 is the user id

