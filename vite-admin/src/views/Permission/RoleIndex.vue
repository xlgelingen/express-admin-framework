<script setup>
import { useStore } from '@/stores/index.js';

const store = useStore();
const rolesAll = store.roles;

</script>
<template>
    <div class="content-table">
        <div class="content-addRole">
            <router-link  class="addRole-btn" :to="{ name: 'RoleCreate' }">新增角色</router-link>
        </div>
        <table class="table-container">
            <tr>
                <th>
                    <div class="table-th">名称</div>
                </th>
                <th>
                    <div class="table-th">展示名称</div>
                </th>
                <th>
                    <div class="table-th">描述</div>
                </th>
                <th>
                    <div class="table-th">创建时间</div>
                </th>
                <th>
                    <div class="table-th">操作</div>
                </th>
            </tr>
            <template v-for="role in rolesAll" :key="role.id">
                <tr class="table-role">
                    <td>{{ role.slug }}</td>
                    <td>{{ role.name }}</td>
                    <td>{{ role.describe }}</td>
                    <td>{{ role.create_time }}</td>
                    <td><a class="role-edit" :data-id="role.id" :href="`/permission/role/${role.id}/edit`">编辑</a>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>
<style type="text/css" lang="less" scoped>
.content-addRole {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    cursor: pointer;

    .addRole-btn {
        color: #fff;
        background: #1890ff;
        box-shadow: 0 2px 0 rgba(5, 175, 255, 0.1);
        padding: 10px 15px;
        border-radius: 6px;
        width: fit-content;
        transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

        &:hover {
            color: #fff;
            background: #40a9ff;
        }
    }
}

.role-edit {
    color: #1890ff;
    font-size: 14px;
    cursor: pointer;
    // transition: all 0.3s ease-in;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
        color: #409eff;
        font-weight: 600;
    }
}

.content-table {
    padding: 16px 24px;
    border-radius: 10px;
}

.table-container {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    border-radius: 15px 15px 0 0;
}



.table-container tr:first-child {
    background-color: #fafafa;
}

.table-container th {
    font-weight: 600;
    text-align: left;
    border-bottom: 1px solid #0000000F;
    padding: 12px 0;

    .table-th {
        border-right: 1px solid #0000000F;
        padding: 0 8px;
    }
}

.table-container th:last-child .table-th {
    border: none;
}

.table-container td {
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 8px;
}

.table-container tr td {
    text-align: left;
}
</style>