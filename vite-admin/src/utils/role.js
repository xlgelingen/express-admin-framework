import roleService from '@/services/role';

export async function getEditRole(roleId) {
  const roleInfo = await roleService
    .getEditRole(roleId)
    .then(function (data) {
      return data.roleInfo;
    })
    .catch(function (error) {
      console.log(error);
    });
  return roleInfo
}
