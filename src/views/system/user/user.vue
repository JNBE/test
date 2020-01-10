<style lang="less" scoped>
@import "./user.less";
</style>
<template>
    <div class="user-container">
       <div class="title">后台用户管理</div>
        <Button type="primary" @click="create" :disabled="!allowEdit">添加</Button>
        <Modal :mask-closable="false" v-model="showModel" title="后台用户信息">
            <Form ref="user" :model="user" :label-width="80" :rules="userRule">
                <FormItem label="账号" prop="account">
                    <Input v-model="user.account" placeholder="请输入登录时所用的账号"></Input>
                </FormItem>
                <FormItem label="姓名" prop="name">
                    <Input v-model="user.name" placeholder="请输入用户姓名"></Input>
                </FormItem>
                <FormItem label="角色" prop="role">
                    <Select v-model="user.role" placeholder="请选择角色">
                        <Option value="backstager" >客服</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
              <Button type="success" @click="save">保存</Button>
            </div>
        </Modal>
        <Table border :columns="userColumns" :data="users"></Table>
    </div>
</template>

<script>
import common from "../../../libs/common";
export default {
  data() {
    return {
      showModel: false,
      action: "",
      user: {
        id: "",
        name: "",
        password: "",
        account: "",
        phone: "",
        role: "backstager"
      },
      userRule: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "change"
          }
        ],
        account: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "change"
          },
          {
            validator: this.checkAccount
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change"
          }
        ]
      },
      userColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          align: "center",
          title: "账号",
          key: "account"
        },
        {
          align: "center",
          title: "姓名",
          key: "name"
        },

        {
          align: "center",
          title: "角色",
          key: "role",
          render: (h, params) => {
            return h("div", [
              h("span", params.row.role === "backstager" ? "客服" : "")
            ]);
          }
        },
        {
          align: "center",
          title: "操作",
          key: "action",
          width: 300,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    disabled: !this.allowEdit
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.index);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    disabled: !this.allowEdit
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      users: []
    };
  },
  computed: {
    allowEdit() {
      return common.user.hasRoles([common.roleKind.admin]);
    }
  },
  mounted: function() {
    if (!this.allowEdit) return;
    this.$ajax
      .post("/api", {
        method: "user.list",
        token: common.user.token,
        parameter: null
      })
      .then(r => {
        if (r.data.code !== 0) {
          this.$Modal.error({
            title: "获取用户列表错误",
            content: r.data.error
          });
          return;
        }
        this.users = r.data.result;
      });
  },
  methods: {
    checkAccount(rule, value, callback, source, options) {
      let errors = [];
      this.$ajax
        .post("/api", {
          method: "user.check.account",
          token: common.user.token,
          parameter: {
            account: value,
            userId: this.user.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            alert(r.data.error);
            errors.push(r.data.error);
          } else if (r.data.result.exsists === true) {
            errors.push("账号已存在");
          }
          callback(errors);
        });
    },
    create() {
      this.$ajax
        .post("/api", {
          method: "user.create",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "添加用户错误",
              content: r.data.error
            });
            return;
          }
          this.user = r.data.result;
          this.action = "create";
          this.showModel = true;
        });
    },
    remove(index) {
      let user = this.users[index];
      this.$Modal.confirm({
        title: "删除",
        content: "是否确认删除所选中用户？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "user.delete",
              token: common.user.token,
              parameter: { id: user.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "删除用户错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("删除用户成功");
              this.users.splice(index, 1);
            });
        }
      });
    },
    edit(index) {
      this.index = index;
      let user = this.users[index];
      this.user = JSON.parse(JSON.stringify(user));
      this.action = "edit";
      this.showModel = true;
    },
    save() {
      this.$refs["user"].validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: this.action === "create" ? "user.insert" : "user.update",
              token: common.user.token,
              parameter: this.user
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "添加用户错误",
                  content: r.data.error
                });
                return;
              }
              this.showModel = false;
              if (this.action === "create") {
                this.users.push(this.user);
              } else {
                this.$set(this.users, this.index, this.user);
              }
            });
          this.showModel = false;
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    }
  }
};
</script>