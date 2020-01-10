<style lang="less" scoped>
@import "./member.less";
</style>
<template>
  <div class="members-admin-container">
    <div class="title">会员信息表</div>
    <Form :model="search" inline :label-width="80" style="display:flex; justify-content:flex-end">
      <FormItem label="会员">
        <Input v-model="search.memberName" placeholder="请输入会员名称" style="width: 200px" clearable></Input>
      </FormItem>
      <FormItem style="margin-left:-80px">
        <Button type="primary" @click="findMember">查找</Button>
      </FormItem>
    </Form>

    <div>
      <Table border :columns="memberColumns" :data="members"></Table>
    </div>
    <div class="page">
      <Page
        :total="dataCount"
        :page-size="pageSize"
        show-elevator
        @on-change="searchMemberPageChanged"
      ></Page>
    </div>

    <Modal v-model="showMemberFormWindow" title="会员资料" width="600" :mask-closable="false">
      <Form
        ref="memberForm"
        :model="member"
        :label-width="70"
        :rules="memberRule"
        label-position="left"
      >
        <Row>
          <Col span="12">
            <InputBox label="会员昵称" prop="name">
              <Input v-model="member.name" placeholder="请输入会员昵称"></Input>
            </InputBox>
          </Col>
            <Col span="12">
            <InputBox label="联系人" prop="linkman">
              <Input v-model="member.linkman" placeholder="请输入联系人"></Input>
            </InputBox>
          </Col>
        </Row>

        <Row>
          <Col span="24">
            <InputBox label="所属企业" prop="company">
              <Input v-model="member.company" placeholder="请输入所属企业名称"></Input>
            </InputBox>
          </Col>
        </Row>

        <Row>
          <Col span="24">
            <InputBox label="联系电话" prop="phone">
              <Input v-model="member.phone" placeholder="请输入联系电话" clearable></Input>
            </InputBox>
          </Col>
        </Row>

        <Row type="flex" justify="center">
          <Col span="12">
            <InputBox prop="gender">
              <RadioGroup v-model="member.gender">
                <Radio label="先生"></Radio>
                <Radio label="女士"></Radio>
              </RadioGroup>
            </InputBox>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="success" @click="save" style="width:120px;">保存</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import common from "../../../libs/common";
import InputBox from "../../components/inputbox";
export default {
  components: {
    InputBox
  },
  data() {
    return {
      dataCount: 0,
      pageIndex: 1,
      pageSize: 20,
      search: {
        memberName: ""
      },
      showMemberFormWindow: false,
      members: [],
      member: {},
      memberRule: {
        name: [
          {
            required: true,
            message: "会员昵称不能为空",
            trigger: "change"
          }
        ],
        phone: [
          {
            validator: this.checkPhone,
            trigger: "change,blur"
          }
        ]
      },
      memberColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          align: "center",
          title: "昵称",
          key: "name"
        },
        {
          align: "center",
          title: "联系人",
          key: "linkman"
        },
        {
          align: "center",
          title: "角色",
          key: "role",
          render: (h, params) => {
            return h("div", [
              h("span", common.roleKind.parse(params.row.role))
            ]);
          }
        },
        {
          align: "center",
          title: "状态",
          key: "state",
          render: (h, params) => {
            return h("div", [
              h("span", common.memberState.parse(params.row.state))
            ]);
          }
        },
        {
          align: "center",
          title: "注册时间",
          key: "createTime",
          render: (h, params) => {
            return h(
              "span",
              common.dateFromat(
                new Date(params.row.createTime),
                "yyyy-MM-dd hh:mm:ss"
              )
            );
          }
        },
        {
          align: "center",
          title: "操作",
          key: "action",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: !this.allowRole
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
                    type: "text",
                    size: "small",
                    disabled: !this.allowRole
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.reset(params.index);
                    }
                  }
                },
                "重置"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: !this.allowRole
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.lock(params.index);
                    }
                  }
                },
                params.row.state === "locked" ? "解锁" : "锁定"
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    allowRole() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager,
        common.roleKind.promoter
      ]);
    }
  },
  mounted() {
    this.reload();
  },
  methods: {
    findMember() {
      this.pageIndex = 1;
      this.reload();
    },
    reload() {
      this.$ajax
        .post("/api", {
          method: "member.find",
          token: common.user.token,
          parameter: {
            page: this.pageIndex,
            size: this.pageSize,
            filter: this.search.memberName,
            state: common.memberState.normal
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取会员列表错误",
              content: r.data.error
            });
            return;
          }
          console.log("获取会员列表", r.data.result);
          this.dataCount = r.data.result.count;
          this.members = r.data.result.rows;
        });
    },
    searchMemberPageChanged: function(page) {
      this.pageIndex = page;
      this.reload();
    },
    edit: function(index) {
      this.index = index;
      let info = this.members[index];
      this.$ajax
        .post("/api", {
          method: "member.fetch",
          token: common.user.token,
          parameter: {
            id: info.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取会员信息失败",
              content: r.data.error
            });
            return;
          }
          console.log('会员信息：',r);
          let member = r.data.result;
          this.member = member;
          this.showMemberFormWindow = true;
        });
    },
    save: function() {
      this.$refs.memberForm.validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "member.update",
              token: common.user.token,
              parameter: this.member
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "保存会员信息失败",
                  content: r.data.error
                });
                return;
              }
              this.showMemberFormWindow = false;
              let info = this.member;
              this.$set(this.members, this.index, info);
            });
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    reset: function(index) {
      this.current_index = index;
      let info = this.members[this.current_index];
      info.role = "guest";

      this.$Modal.confirm({
        title: "重置会员身份",
        content: "确定要重置成" + common.roleKind.parse(info.role) + "吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "member.reset",
              token: common.user.token,
              parameter: {
                id: info.id
              }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "重置会员身份失败",
                  content: r.data.error
                });
                return;
              }
              this.members[this.current_index] = info;
              this.$Message.success("重置会员身份成功");
            });
        }
      });
    },
    lock: function(index) {
      this.index = index;
      let info = this.members[index];
      console.log("info.state", info.state);
      let method = "";
      let title = "";
      if (info.state == "locked") {
        method = "member.unlock";
        title = "解锁会员身份";
      } else {
        method = "member.lock";
        title = "锁定会员身份";
      }

      this.$Modal.confirm({
        title: title,
        content: "确定要" + title + "吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: method,
              token: common.user.token,
              parameter: {
                id: info.id
              }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "锁定会员失败",
                  content: r.data.error
                });
                return;
              }
              if (info.state == "locked") {
                info.state = "normal";
                this.$Message.success("解锁会员成功");
              } else {
                info.state = "locked";
                this.$Message.success("锁定会员成功");
              }
              this.$set(this.members, this.index, info);
            });
        }
      });
    },
    checkPhone(rule, value, callback, source, options) {
      let phoneErrors = [];
      if (value) {
        value = value.replace(/\ +/g, ""); //替换空格
        value = value.replace(/\，/g, ","); //替换中文逗号
        let phones = value.split(",");
        for (let phone of phones) {
          let errorMsg = "";
          if (phone) {
            let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            let isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
            let flag = isMob.test(phone) || isPhone.test(phone);
            if (flag == false) errorMsg = "号码{ " + phone + " }格式错误！";
          }
          if (errorMsg) phoneErrors.push(errorMsg);
        }
      }
      callback(phoneErrors);
    },

  }
};
</script>
