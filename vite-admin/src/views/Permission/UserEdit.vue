<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getEditUser } from '@/utils/user.js'
import { useStore } from '@/stores/index.js';
import { ElMessage, ElMessageBox } from 'element-plus'
import userService from '@/services/user';
import Cookies from 'js-cookie';

const store = useStore();
const route = useRoute();
const router = useRouter();

const userId = ref(route.params.id);
const loginUserID = store.user.id;
console.log('用户编辑/登录用户ID：', loginUserID)

var editUser = reactive({});

const originUser = reactive({});
const formRef =ref()

onMounted(async () => {
    try {
        var userInfo = await getEditUser({ id: userId.value });
        console.log('用户编辑/userInfo', userInfo)
        Object.assign(originUser, userInfo);
        Object.assign(editUser, userInfo);
        console.log('用户编辑/editUser', editUser);
        console.log('用户编辑/originUser', originUser);
    } catch (error) {
        console.error('获取编辑用户信息失败：', error);
    }
});

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

async function handleConfirm() {
    dialogVisible.value = false;

    const isValid = await formRef.value.validate();
    if (!isValid) {
        // 如果验证不通过，则直接返回，不执行后续操作
        return;
    }

    await editUserReq();
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

async function editUserReq() {
    await userService.editUser({ id: userId.value, name: editUser.name, phone: editUser.phone, password: editUser.password, role: editUser.role }).then(function (data) {
        if (data.code === 200) {
            ElMessage({
                message: '修改成功！',
                type: 'success',
            })
            setTimeout(() => {
                if (userId.value !== loginUserID) {
                    router.push({ name: 'UserIndex' }).then(() => {
                    window.location.reload();
                });
                }
            }, 700)
        } else {
            console.log(data);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

async function saveUser() {
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

    await editUserReq();
}

function resetForm() {
    Object.assign(editUser, originUser);
};


</script>
<template>
    <div class="content-form-wrapper">
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
        <div class="content-form">
            <el-form ref="formRef" :model="editUser" :rules="smsRules" status-icon label-position="top">
                <el-form-item prop="name" label="用户名">
                    <el-input type="text" placeholder="请输入用户名" v-model="editUser.name" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="手机号">
                    <el-input type="number" placeholder="请输入手机号" v-model="editUser.phone" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="text" placeholder="请输入密码" v-model="editUser.password" autocomplete="on"></el-input>
                </el-form-item>
                <el-form-item prop="role" label="角色">
                    <el-select v-model="editUser.role" placeholder="请选择角色" autocomplete="on">
                        <el-option label="管理员" value="1" />
                        <el-option label="图书员" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <a-button class="form-btn" style="margin-right: 8px;" type="primary" @click="saveUser">提
                        交</a-button>
                    <a-button class="form-btn" type="button" @click="resetForm">重 置</a-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style type="text/css" lang="less" scoped>
.content-form-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
}

.content-form {
    text-align: center;
    width: 400px;
    margin: 40px auto;
}
</style>