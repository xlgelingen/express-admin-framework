import request from '@/utils/request.js'
import API from '@/consts/api.js'

const loginService = {
  phoneLogin: (data,config) => {
    return request.post(API.phoneLogin,data,config)
  },
  accountLogin: (data,config) => {
    return request.post(API.accountLogin,data,config)
  },
}

export default loginService