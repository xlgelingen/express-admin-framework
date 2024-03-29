import request from "@/utils/request.js";
import API from "@/consts/api.js";

const tokenService = {
  varifyToken({token}) {
    return request.post(API.varifyToken,{token});
  }
};

export default tokenService;