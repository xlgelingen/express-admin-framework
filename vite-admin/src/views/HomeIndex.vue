<template>
  <div class="page-body-content">
    <div class="role-list">
      <!-- <svg-icon name="ii-logo" width="64px" height="64px"></svg-icon> -->
      <div class="role-item">
        <h3>角色1：图书员</h3>
        <p style="margin-left: 20px;">权限： ["article-index", "article-category"]</p>
      </div>
      <div class="role-item">
        <h3>角色2：管理员</h3>
        <p style="margin-left: 20px;">权限： ["role-index", "manager-index", "article-index", "article-category"]</p>
      </div>
    </div>
  </div>
</template>
<style type="text/css" lang="less" scoped>
.page-body-content {
  margin: 30px 40px 0 40px;
  min-width: 900px;
  background-color: #fff;
  flex: 1;
}

.role-list{
  padding: 24px;
}
.role-item {
  margin-bottom: 20px;
}
</style>