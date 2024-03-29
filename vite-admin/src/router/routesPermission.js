const RoleRoot = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/RoleRoot.vue');
const RoleIndex = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/RoleIndex.vue');
const RoleEdit = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/RoleEdit.vue');
const RoleCreate = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/RoleCreate.vue');
const UserRoot = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/UserRoot.vue');
const UserIndex = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/UserIndex.vue');
const UserEdit = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/UserEdit.vue');
const UserCreate = () =>
  import(/* webpackChunkName: "permission" */ '@/views/Permission/UserCreate.vue');

export default [
  {
    path: '/permission',
    name: 'Permission',
    redirect: { name: 'RoleIndex' },
    meta: {
      permission: 'role-index',
      nav: {
        icon: 'icon-setting',
        title: '权限设置'
      },
      breadcrumb: {
        name: '权限'
      }
    },
    children: [
      {
        path: 'role',
        name: 'RoleRoot',
        component: RoleRoot,
        redirect: {
          name: 'RoleIndex'
        },
        meta: {
          breadcrumb: {
            name: '角色列表'
          }
        },
        children: [
          {
            path: '',
            name: 'RoleIndex',
            component: RoleIndex,
            meta: {
              permission: 'role-index',
              nav: {
                icon: 'icon-role',
                title: '角色列表'
              }
            }
          },
          {
            path: ':id/edit',
            name: 'RoleEdit',
            component: RoleEdit,
            meta: {
              breadcrumb: {
                name: '编辑角色'
              }
            }
          },
          {
            path: 'create',
            name: 'RoleCreate',
            component: RoleCreate,
            meta: {
              breadcrumb: {
                name: '创建角色'
              }
            }
          }
        ]
      },
      {
        path: 'manager',
        name: 'UserRoot',
        component: UserRoot,
        redirect: {
          name: 'UserIndex'
        },
        meta: {
          breadcrumb: {
            name: '用户列表'
          }
        },
        children: [
          {
            path: '',
            name: 'UserIndex',
            component: UserIndex,
            meta: {
              permission: 'manager-index',
              nav: {
                icon: 'icon-user',
                title: '用户列表'
              }
            }
          },
          {
            path: ':id/edit',
            name: 'UserEdit',
            component: UserEdit,
            meta: {
              breadcrumb: {
                name: '编辑用户'
              }
            }
          },
          {
            path: 'create',
            name: 'UserCreate',
            component: UserCreate,
            meta: {
              breadcrumb: {
                name: '创建用户'
              }
            }
          }
        ]
      }
    ]
  }
];
