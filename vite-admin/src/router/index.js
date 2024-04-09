import { createRouter, createWebHistory } from 'vue-router';
import cookies from 'js-cookie';
import routes from './routes';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css' // nprogress样式
import userService from '@/services/user';
import roleService from '@/services/role';
import permissionService from '@/services/permission';
import tokenService from '@/services/token';
import { useStore } from '@/stores/index.js';
// import { useRoute } from 'vue-router';

// const route = useRoute();

const TOKEN_KEY = 'web_token';
const appRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //全局的滚动行为 scrollBehavior，用于控制页面切换时的滚动位置
  scrollBehavior(to, from, savedPosition) {
    // `to` 和 `from` 都是路由路径
    // `savedPosition` 如果不存在可以为 null
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  }
});
// 只触发一次的锁
//添加了一个名为 firstInit 的属性，用于标记应用程序是否已经初始化过
appRouter.firstInit = false;

//beforeEach 导航守卫，用于在每次路由切换之前执行一些逻辑
appRouter.beforeEach(async (to, from, next) => {
  //启动了进度条 NProgress.start()；以提示用户当前页面正在加载中。
  NProgress.start();

  //设置了页面的标题，根据路由元信息中的 title 字段
  if (to.meta.nav?.title) document.title = to.meta.nav.title;

  const store = useStore();
  const token = cookies.get(TOKEN_KEY);

  // 没有 TOKEN 的情况下的处理，要么跳走，要么去登录页面。
  if (!token && !['AccountLogin'].includes(to.name)) {
    next({ name: 'AccountLogin' });
    return;
  }

  // 有 TOKEN 的情况下只请求一次用户信息
  /* 如果存在 token 并且尚未初始化过用户信息（appRouter.firstInit 为 false），
  则尝试获取用户信息，并保存到 Vuex 的状态管理中 */
  if (token && !appRouter.firstInit) {
    try {
      const users = await userService
        .getUsers()
        .then(function (data) {
          return data.usersInfo;
        })
        .catch(function (error) {
          console.log(error);
          return;
        });
      store.setUsers(users);
      console.log('路由导航/store.users：', store.users);

      const roles = await roleService
        .getRoles()
        .then(function (data) {
          return data.rolesInfo;
        })
        .catch(function (error) {
          console.log(error);
          return;
        });
      console.log('路由导航/roles：', roles);
      store.setRoles(roles);
      // console.log('路由导航/store.roles：', store.roles, new Date());

      const allPermissions = await permissionService
        .getAllPermissions()
        .then(function (data) {
          return data.permissions;
        })
        .catch(function (error) {
          console.log(error);
          return;
        });
      console.log('路由导航/allPermissions：', allPermissions);
      store.setAllPermissions(allPermissions);
      // console.log('路由导航/store.allPermissions：', store.allPermissions, new Date());

      const user = await tokenService
        .varifyToken({ token })
        .then(function (data) {
          return data.user;
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log('路由导航/登录用户：', user);
      store.setUser(user);

      const userId = user.id;
      console.log('路由导航/登录用户ID：', userId);

      const permissions = await permissionService
        .getPermissions({ userId: userId })
        .then(function (data) {
          return data.permissions;
        })
        .catch(function (error) {
          console.log(error);
          return;
        });
      console.log('路由导航/登录用户权限：', permissions);
      store.setPermissions(permissions);
      // console.log('路由导航/store.permissions：', store.permissions, new Date());

      // 没有要去的页面的权限，就跳去Forbidden页面
      if (to.meta.permission && !permissions.includes(to.meta.permission) && !['Forbidden'].includes(to.name)) {
        next({ name: 'Forbidden' });
        return;
      }
      appRouter.firstInit = true;
      // console.log('路由导航/firstInit：',appRouter.firstInit,new Date())
    } catch (e) {
      console.error('Error:', e);
      next();
      return;
    }
  }

  next();
});

//使用了 afterEach 后置钩子，在路由导航完成后执行一些逻辑。这里用于结束进度条
// eslint-disable-next-line
appRouter.afterEach((to, from) => {
  //结束进度条
  NProgress.done();
});

export default appRouter;
