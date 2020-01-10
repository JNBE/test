<style lang="less">
@import "./home.less";
</style>
<template>
  <!-- <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="primary" :active-name="currentMenu">
          <div class="layout-nav">
            <div class="layout-logo">
              <img src="../static/images/logo.png" alt />
              <div class="layout-title">驮道后台管理系统</div>
            </div>
      
            <!-- <MenuItem name="notice-admin">
                            <i class="iconfont icon-jigou"></i>
                            <router-link :to="{name:'notice-admin'}">公告管理</router-link>
                        </MenuItem>
                        <MenuItem name="news-admin">
                            <i class="iconfont icon-gongzuodanwei"></i>
                            <router-link :to="{name:'news-admin'}">资讯管理</router-link>
  </MenuItem>-->
  <!--<MenuItem name="system-count">
              <i class="iconfont icon-dfergnairr"></i>
              <router-link :to="{name:'system-count'}">首页</router-link>
            </MenuItem>
            <MenuItem name="custom-admin">
              <i class="iconfont icon-kehuguanli"></i>
              <router-link :to="{name:'custom-admin'}">客户管理</router-link>
            </MenuItem>
            <MenuItem name="system-admin">
              <i class="iconfont icon-xitongshezhi"></i>
              <router-link :to="{name:'system-admin'}">系统设置</router-link>
            </MenuItem>

            <div class="layout-user">
              <a href="javascript:void(0)" @click="show">
                <span class="username">{{userName}}({{userRole}})</span>
                <Icon type="arrow-down-b"></Icon>
              </a>
              <div class="my" v-show="showDropdown">
                <ul>
                  <li @click="info">个人信息</li>
                  <li @click="edit">密码修改</li>
                  <li @click="exit">退出</li>
                </ul>
              </div>
            </div>
          </div>
        </Menu>
      </Header>
      <Content>
        <router-view></router-view>
      </Content> 
  </Layout>-->
  <div class="home-page">
    <Menu mode="horizontal" theme="primary" :active-name="currentMenu">
      <div class="nav-menu">
        <div class="nav-logo">
          <img src="../static/images/logo.png" alt />
          <div class="nav-title">驮道后台管理系统</div>
        </div>
        <MenuItem name="system-count">
          <i class="iconfont icon-dfergnairr"></i>
          <router-link :to="{name:'system-count'}">首页</router-link>
        </MenuItem>
        <MenuItem name="custom-admin">
          <i class="iconfont icon-kehuguanli"></i>
          <router-link :to="{name:'custom-admin'}">客户管理</router-link>
        </MenuItem>
        <MenuItem name="system-admin">
          <i class="iconfont icon-xitongshezhi"></i>
          <router-link :to="{name:'system-admin'}">系统设置</router-link>
        </MenuItem>

        <div class="nav-user">
          <a href="javascript:void(0)" @click="show">
            <span class="username">{{userName}}({{userRole}})</span>
            <Icon type="arrow-down-b"></Icon>
          </a>
          <div class="my" v-show="showDropdown">
            <ul>
              <li @click="info">个人信息</li>
              <li @click="edit">密码修改</li>
              <li @click="exit">退出</li>
            </ul>
          </div>
        </div>
      </div>
    </Menu>
    <div class="home-content">
      <router-view></router-view>
    </div>
    <Modal :mask-closable="false" v-model="showInfoModal" title="个人信息" width="400">
      <Form ref="myinfoForm" :model="myinfo" :rules="infoRule" :label-width="80">
        <FormItem label="账号" prop="account">
          <Input v-model="myinfo.account" placeholder="请输入登录账号"></Input>
        </FormItem>
        <FormItem label="用户名" prop="name">
          <Input v-model="myinfo.name" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="登录密码" prop="pwd">
          <Input type="password" v-model="myinfo.pwd" placeholder="请输入登录密码"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="myinfo.phone" placeholder="请输入手机号"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="saveInfo">保存</Button>
      </div>
    </Modal>
    <Modal :mask-closable="false" v-model="showKeyModal" title="修改密码" width="400">
      <Form ref="mykeyForm" :model="mykey" :rules="keyRule" :label-width="80">
        <FormItem label="旧密码" prop="oldKey">
          <Input type="password" v-model="mykey.oldKey" placeholder="旧登录密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newKey">
          <Input type="password" v-model="mykey.newKey" placeholder="新登录密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmKey">
          <Input type="password" v-model="mykey.confirmKey" placeholder="确认新的登录密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="saveKey">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import common from "../libs/common";
export default {
  data() {
    return {
      userName: common.user.name,
      userRole: common.roleKind.parse(common.user.role),
      currentMenu: null,
      showDropdown: false,
      showInfoModal: false,
      showKeyModal: false,
      myinfo: {
        account: "",
        name: "",
        phone: ""
      },
      mykey: {
        oldKey: "",
        newKey: "",
        confirmKey: ""
      },
      infoRule: {
        account: [
          { required: true, message: "账号不能为空", trigger: "change" }
        ],
        name: [
          { required: true, message: "用户名不能为空", trigger: "change" }
        ],
        pwd: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change"
          },
          {
            type: "string",
            min: 6,
            message: "密码不少于6个字符",
            trigger: "change"
          }
        ]
      },
      keyRule: {
        oldKey: [
          {
            required: true,
            message: "旧密码不能为空",
            trigger: "change"
          },
          {
            type: "string",
            min: 6,
            message: "密码不少于6个字符",
            trigger: "change"
          }
        ],
        newKey: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "change"
          },
          {
            type: "string",
            min: 6,
            message: "密码不少于6个字符",
            trigger: "change"
          },
          {
            validator: this.checkNewKey,
            trigger: "change"
          }
        ],
        confirmKey: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "change"
          },
          {
            type: "string",
            min: 6,
            message: "密码不少于6个字符",
            trigger: "change"
          },
          {
            validator: this.checkConfirmKey,
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.resetActiveMenu();
    this.loadInfo();
  },
  methods: {
    checkNewKey(rule, value, callback, source, options) {
      this.$refs.mykeyForm.validateField("confirmKey");
      callback();
    },
    checkConfirmKey(rule, value, callback, source, options) {
      if (this.mykey.confirmKey === this.mykey.newKey) {
        callback();
      } else {
        callback(["新密码与确认密码不致"]);
      }
    },
    checkAccount(rule, value, callback, source, options) {
      let errors = [];
      this.$ajax
        .post("/api", {
          method: "user.check.account",
          token: common.user.token,
          parameter: {
            account: value,
            userId: common.user.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            errors.push(r.data.error);
          } else if (r.data.result.exsists === true) {
            errors.push("账号已存在");
          }
          callback(errors);
        });
    },
    info() {
      this.showDropdown = false;
      this.showInfoModal = true;
    },
    loadInfo() {
      this.$ajax
        .post("/api", {
          method: "system.get.myinfo",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取个人信息错误",
              content: r.data.error
            });
            return;
          }
          this.myinfo = r.data.result;
        });
    },
    saveInfo() {
      this.$refs.myinfoForm.validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "system.save.myinfo",
              token: common.user.token,
              parameter: this.myinfo
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "保存个人信息错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("个人信息保存成功");
              this.showInfoModal = false;
            });
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    resetActiveMenu() {
      if (!this.currentMenu) {
        let names = JSON.parse(sessionStorage.getItem("routers"));
        let current = names[1] || "/admin/index/myinfo";
        this.currentMenu = current;
      }
    },
    show() {
      if (this.showDropdown == true) {
        this.showDropdown = false;
      } else {
        this.showDropdown = true;
      }
    },
    edit() {
      this.showDropdown = false;
      this.showKeyModal = true;
    },
    saveKey() {
      this.$refs.mykeyForm.validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "system.save.mykey",
              token: common.user.token,
              parameter: this.mykey
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "密码修改错误",
                  content: r.data.error
                });
                return;
              }
              this.showModal = false;
              this.$Message.success("密码修改成功");

              this.mykey.oldKey = "";
              this.mykey.newKey = "";
              this.mykey.confirmKey = "";
              this.showKeyModal = false;
            });
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    exit() {
      this.$router.replace({
        path: "/"
      });
    }
  }
};
</script>