import userService from '@/services/user';

export async function getEditUser(userId) {
  const userInfo = await userService
    .getEditUser(userId)
    .then(function (data) {
      return data.userInfo;
    })
    .catch(function (error) {
      console.log(error);
    });
  return userInfo
}
