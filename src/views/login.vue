<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <Card :bordered="false">
      <div class="login-card-header">
        <img src="../static/images/logo.png" alt />
        <div>驮道后台管理系统</div>
      </div>
      <div class="form-con">
        <Form ref="loginForm" :model="loginForm" :rules="loginRules" :label-width="60">
          <FormItem label="账号" prop="account" class="accountInput">
            <Input v-model="loginForm.account" placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="密码" prop="password" class="pwdInput">
            <Input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              @on-enter="login"
            ></Input>
          </FormItem>
          <FormItem>
            <Button @click="login">登录</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import common from "../libs/common";
export default {
  data() {
    return {
      loginForm: {
        account: "",
        password: ""
      },
      loginRules: {
        account: [
          { required: true, message: "账号不能为空", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "user.login",
              token: null,
              parameter: {
                account: this.loginForm.account,
                password: this.loginForm.password
              }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "登录错误",
                  content: r.data.error
                });
                return;
              } else {
                Cookies.set("user.account", r.data.result.account);
                Cookies.set("user.id", r.data.result.id);
                Cookies.set("user.name", r.data.result.name);
                Cookies.set("user.role", r.data.result.role);
                Cookies.set("user.token", r.data.result.token);
                common.user.readload();
                if (this.$route.query.redirect) {
                  let redirect = this.$route.query.redirect;
                  this.$router.replace(redirect);
                } else {
                  this.$router.replace({
                    path: "/home"
                  });
                }
              }
            });
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    }
  }
};
</script>
