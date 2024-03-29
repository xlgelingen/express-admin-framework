export function formatRoutes(routes, permissions) {
    //首先根据用户权限过滤路由，然后根据导航信息对路由进行进一步过滤和格式化，以便于在页面中显示导航菜单
    return filterNavRoutes(filterPermissionRoutes(routes, permissions))
  }
  
  //routes 表示要过滤的路由列表，permissions 表示用户拥有的权限列表。
  export function filterPermissionRoutes(routes, permissions) {
    const filterRoutes = []
    routes.forEach((data) => {
      const route = { ...data }
  //若当前路由具有 meta 属性且 meta 属性中包含 permission字段，notPermission为false，
  //否则 notPermission 为 true，表示当前路由没有设置权限
      const notPermission = !route.meta || !route.meta.permission
  //若notPermissionfalse，且用户拥有的权限列表有当前路由所需权限其中之一，hasPermission为true
      const hasPermission =
        !notPermission && route.meta.permission.split(',').some((item) => permissions.includes(item))
  //当前路由没有设置权限(notPermission为true)，或，用户拥有权限（hasPermission为true），passPermission为true
      const passPermission = notPermission || hasPermission
  //hasPath，用于标记当前路由是否具有可访问的子路由，默认为 true
      let hasPath = true
      if (route.children) {
        //如果有子路由，对当前路由的子路由进行过滤，并更新当前路由的子路由列表。
        route.children = filterPermissionRoutes(data.children, permissions)
        if (route.children.length === 0) {
   //如果经过过滤后的子路由列表为空，则将 hasPath 设置为 false，表示当前路由没有可访问的子路由。
          hasPath = false
        }
      }
      if (passPermission && hasPath) {
        //如果当前路由通过权限验证，并且具有可访问的子路由，则将其添加到过滤后的路由列表中。
        filterRoutes.push(route)
      }
    })
    return filterRoutes
  }
  
    //这个函数用于过滤路由，仅保留具有导航信息的路由，并将它们格式化为特定的结构
  export function filterNavRoutes(routes) {
    let result = []
    routes.forEach((data) => {
      if (data.meta && data.meta.nav) {
        let item = {
          name: data.name,
          meta: data.meta
        }
        if (data.children) {
          item.children = filterNavRoutes(data.children)
        }
        result.push(item)
      } else if (data.children) {
        filterNavRoutes(data.children).forEach((item) => {
          result.push(item)
        })
      }
    })
    return result
  }
  