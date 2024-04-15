<script setup>
// import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, computed } from 'vue';
import { useStore } from '@/stores/index.js';
// import { getEditUser } from '@/utils/user.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import userService from '@/services/user';
import Cookies from 'js-cookie';

const store = useStore();
// const route = useRoute();
// const router = useRouter();

const usersAll = store.users;

const pageIndex = ref(1);
const pageSize = ref(10);

const paginationCurrent = ref(1);
const paginationTotal = usersAll.length

// 使用 slice 方法获取分页后的用户数组
const startIndex = computed(() => (pageIndex.value - 1) * pageSize.value);

// 使用 slice 方法获取分页后的用户数组
const tableUsers = computed(() => usersAll.slice(startIndex.value, startIndex.value + pageSize.value));
const antDrawerVisible = ref(false);

const userId = ref();
const loginUserID = store.user.id;
console.log('用户编辑/登录用户ID：', loginUserID)
var editUser = reactive({});
const originUser = reactive({});
// const showDrawer = () => {
//   antDrawerVisible.value = true;
// };

// onMounted();

const formRef = ref()

const smsRules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],

    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^1[3456789]\d{9}$/,
            message: '目前只支持中国大陆的手机号码',
            trigger: 'blur'
        }
    ],

    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            message: '密码不能少于8位，必须包含字母和数字，不能有特殊字符',
            trigger: 'blur'
        }
    ],

    role: [
        { required: true, message: '请选择角色', trigger: 'change' }
    ],
}

const dialogVisible = ref(false)


function handleOnChange(index, size) {
    pageIndex.value = index;
    pageSize.value = size;
}

function handelEditUser(e) {
    userId.value = e.target.dataset.id;
    antDrawerVisible.value = true;
    privateSetUserInfo(userId.value);
}

async function privateSetUserInfo(userId) {
    try {
        // var userInfo = await getEditUser({ id: userId });
        // console.log('用户编辑/userInfo', userInfo)
        // Object.assign(originUser, userInfo);
        // Object.assign(editUser, userInfo);
        let userInfoArr = usersAll.filter((item) => {
            return item.id == Number(userId)
        })
        let userInfo = userInfoArr[0]
        Object.assign(originUser, userInfo);
        Object.assign(editUser, userInfo);
        // console.log('用户编辑/editUser', editUser);
        // console.log('用户编辑/originUser', originUser);
    } catch (error) {
        console.error('获取编辑用户信息失败：', error);
    }
}

async function handleConfirm() {
    dialogVisible.value = false;

    const isValid = await formRef.value.validate();
    if (!isValid) {
        // 如果验证不通过，则直接返回，不执行后续操作
        return;
    }

    await userService.editUser({ id: userId.value, name: editUser.name, phone: editUser.phone, password: editUser.password, role: editUser.role }).then(function (data) {
        if (data.code === 200) {
            ElMessage({
                message: '修改成功！',
                type: 'success',
            })
        } else {
            ElMessage({
                message: '修改失败！',
                type: 'error',
            })
            console.log(data);
        }
    }).catch(function (error) {
        console.log(error);
    });
    const TOKEN_KEY = 'web_token';
    Cookies.remove(TOKEN_KEY);
    setTimeout(() => {
        location.reload()
    }, 700)
}

function handleConcel() {
    Object.assign(editUser, originUser);
    dialogVisible.value = false;
}

const handleClose = (done) => {
    ElMessageBox.confirm('确定要关闭对话框吗?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

async function handleSaveUser() {
    if (!userId.value || !editUser.name || !editUser.phone || !editUser.password || !editUser.role) {
        ElMessage({
            message: 'params empty!',
            type: 'error',
        })
    }

    const isValid = await formRef.value.validate();
    if (!isValid) {
        // 如果验证不通过，则直接返回，不执行后续操作
        return;
    }

    console.log('userID:', userId.value, "name: ", editUser.name, "phone: ", editUser.phone, "password:", editUser.password, "role:", editUser.role)

    if (userId.value == loginUserID) {
        dialogVisible.value = true;
        return
    }

    await userService.editUser({ id: userId.value, name: editUser.name, phone: editUser.phone, password: editUser.password, role: editUser.role }).then(function (data) {
        if (data.code === 200) {
            ElMessage({
                message: '修改成功！',
                type: 'success',
            })
            setTimeout(() => {
                if (userId.value !== loginUserID) {
                    location.reload()
                }
            }, 700)
        } else {
            ElMessage({
                message: '修改失败！',
                type: 'error',
            })
            console.log(data);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function handleResetForm() {
    Object.assign(editUser, originUser);
};

</script>
<template>
    <div class="content-table">
        <div class="content-addUser">
            <router-link class="addUser-btn" :to="{ name: 'UserCreate' }">新增用户</router-link>
        </div>
        <table class="table-container">
            <tr>
                <th>
                    <div class="table-th">
                        姓名
                    </div>
                </th>
                <th>
                    <div class="table-th">
                        电话
                    </div>
                </th>
                <th>
                    <div class="table-th">
                        密码
                    </div>
                </th>
                <th>
                    <div class="table-th">
                        创建时间
                    </div>
                </th>
                <th>
                    <div class="table-th">
                        操作
                    </div>
                </th>
            </tr>
            <template v-for="user in tableUsers" :key="user.id">
                <tr class="table-user">
                    <td>{{ user.name }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.password }}</td>
                    <td>{{ user.create_time }}</td>
                    <td>
                        <!-- <a class="user-edit" :data-id="user.id" :href="`/permission/manager/${user.id}/edit`">编辑</a> -->
                        <div class="user-edit" :data-id="user.id" @click="handelEditUser">编辑</div>
                    </td>
                </tr>
            </template>
        </table>

        <a-pagination v-model:current="paginationCurrent" size="small" show-quick-jumper :total="paginationTotal"
            show-size-changer @change="handleOnChange"
            :show-total="(total, range) => `第${range[0]}-${range[1]}条/总共 ${total}条`" class="table-pagination" />

        <el-dialog v-model="dialogVisible" title="Tips" width="500" :before-close="handleClose">
            <span>正在编辑的是登录用户，提交保存后需要重新登录，确定要提交吗？</span>
            <template #footer>
                <div class="dialog-footer">
                    <a-button @click="handleConcel">取消</a-button>
                    <a-button type="primary" @click="handleConfirm">
                        确定
                    </a-button>
                </div>
            </template>
        </el-dialog>

        <a-drawer :title="`正在编辑用户：${editUser.name}`" :width="720" :open="antDrawerVisible"
            :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }"
            @close="antDrawerVisible = false">
            <div class="content-form">
                <el-form ref="formRef" :model="editUser" :rules="smsRules" status-icon label-position="top">
                    <el-form-item prop="name" label="用户名">
                        <el-input type="text" placeholder="请输入用户名" v-model="editUser.name" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号">
                        <el-input type="number" placeholder="请输入手机号" v-model="editUser.phone"
                            autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input type="text" placeholder="请输入密码" v-model="editUser.password"
                            autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item prop="role" label="角色">
                        <el-select v-model="editUser.role" placeholder="请选择角色" autocomplete="on">
                            <el-option label="管理员" value="1" />
                            <el-option label="图书员" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <a-space>
                            <a-button type="primary" @click="handleSaveUser">保存</a-button>
                            <a-button @click="handleResetForm">重置</a-button>
                        </a-space>
                    </el-form-item>
                </el-form>
            </div>
            <template #extra>

            </template>
        </a-drawer>
    </div>
</template>
<style type="text/css" lang="less" scoped>
.content-addUser {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    cursor: pointer;

    .addUser-btn {
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

.user-edit {
    color: #1890ff;
    font-size: 14px;
    cursor: pointer;
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

.table-pagination {
    margin-top: 24px;
    text-align: right;
}
</style>