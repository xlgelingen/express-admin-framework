import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      users: null,
      user: null,
      roles: null,
      permissions: [],
      allPermissions:[],
      navRoutes:[]
    }
  },
  actions: {
    setUsers(usersInfo) {
      this.users= usersInfo
    },
    setUser(userInfo){
      this.user= userInfo
    },
    setRoles(rolesInfo){
      this.roles = rolesInfo
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setAllPermissions(permissions) {
      this.allPermissions = permissions
    },
    setNavRoutes(navRoutes){
      this.navRoutes = navRoutes
    }
  }
})

export default useStore
