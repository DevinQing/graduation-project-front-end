<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">登录</div>
      <div class="login-form">
        <el-form :model="form" ref="loginRef" :rules="rules">
          <el-form-item prop="mobile">
            <el-input
              v-model="form.mobile"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="userPwd">
            <el-input
              v-model="form.userPwd"
              placeholder="请输入密码"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item>
            <div class="form-btn">
              <el-button type="primary" @click="submitForm" class="btn"
                >登录</el-button
              >
              <el-button @click="resetForm" style="margin: 0" class="btn"
                >重置</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { ElMessage } from 'element-plus'
import { userLogin } from '../api/users'
export default {
  name: 'Login',
  data() {
    return {
      form: {
        mobile: '12345678945',
        userPwd: '88888888'
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          }
        ],
        userPwd: [
          {
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          },
          {
            min: 8,
            max: 16,
            message: '密码长度必须为8-16位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['loginRef'].validate(async (valid) => {
        if (valid) {
          try {
            const params = { ...this.form }
            params.userPwd = md5(params.userPwd)
            const res = await userLogin(params)
            this.$store.commit('saveUserInfo', res)
            this.$router.push('/welcome')
            ElMessage.success('登录成功')
          } catch (err) {
            return false
          }
        }
      })
    },
    resetForm() {
      this.$refs['loginRef'].resetFields()
    }
  }
}
</script>

<style lang="scss">
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: beige;
  background-image: url('../assets/images/登录壁纸.jpg');
  background-size: cover;
  .login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 280px;
    background-color: #282c34;
    opacity: 0.8;
    .login-title {
      text-align: center;
      line-height: 50px;
      height: 50px;
      color: #378fef;
      font-size: 28px;
      font-weight: 600;
    }
    .login-form {
      padding: 30px;
      .form-btn {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        .btn {
          flex-basis: 45%;
        }
      }
    }
  }
}
</style>
