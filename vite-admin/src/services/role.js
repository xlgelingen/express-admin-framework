import request from "@/utils/request.js";
import API from "@/consts/api.js";

const roleService = {
  getRoles() {
    return request.get(API.roles);
  },
  addRole(data) {
    return request.post(API.addRole,data);
  },
  getEditRole(roleId){
    return request.post(API.editRole,roleId);
  },
  editRole(data){
    return request.put(API.editRole,data);
  },
};

export default roleService;