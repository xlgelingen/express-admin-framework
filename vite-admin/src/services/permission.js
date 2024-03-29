import request from '@/utils/request.js'
import API from '@/consts/api.js'

const permissionService = {
  getAllPermissions: () => {
    return request.get(API.permissions)
  },
  getPermissions: (userId) => {
    return request.post(API.permissions,userId)
  },
}

export default permissionService