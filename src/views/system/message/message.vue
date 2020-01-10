<style lang="less"scoped>
@import "./message.less";
</style>

<template>
  <div class="message-admin-container">
    <div class="title">大众消息表</div>

    <Row>
      <Col span="8">
        <Button type="primary" @click="create" :disabled="!allowRole">添加</Button>
      </Col>
      <Col span="16">
        <Form ref="searchForm" :model="search" inline :label-width="60">
          <FormItem label="消息类型">
            <!-- <Input v-model="search.kind" placeholder="请输入企业名称" clearable></Input> -->
            <Select v-model="search.kind">
              <Option :value="kindAll">全部</Option>
              <Option :value="kindCargo">货源</Option>
              <Option :value="kindVehicle">车源</Option>
            </Select>
          </FormItem>
          <FormItem label="起始地">
            <Input
              v-model="search.start"
              placeholder="请输入起始地"
              icon="ios-more"
              @on-click="showCityModel('searchStart')"
            ></Input>
          </FormItem>
          <FormItem label="到达地">
            <Input
              v-model="search.end"
              placeholder="请输入到达地"
              icon="ios-more"
              @on-click="showCityModel('searchEnd')"
            ></Input>
          </FormItem>

          <FormItem style="margin-left:-50px">
            <Button type="primary" @click="findMessage">查找</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>

    <Table border :columns="messageColumns" :data="messages"></Table>

    <div class="page">
      <Page
        :total="dataCount"
        :page-size="pageSize"
        :current="pageIndex"
        show-elevator
        @on-change="searchMessagePageChanged"
      ></Page>
    </div>

    <Modal v-model="showMessageFormModal" title="新建大众消息" width="700">
      <div style="height:300px; overflow:auto; padding:5px;">
        <Form
          ref="messageForm"
          :model="message"
          :label-width="70"
          :rules="messageRule"
          label-position="left"
        >
          <Row type="flex" justify="start">
            <Col>
              <InputBox label="起始地" prop="start" placement="bottom">
                <Input
                  v-model="message.start"
                  placeholder="请输入起始地"
                  icon="ios-more"
                  @on-click="showCityModel('start')"
                />
              </InputBox>
            </Col>
            <Col offset="1">
              <InputBox label="消息类型" prop="kind">
                <RadioGroup v-model="message.kind">
                  <Radio :label="kindCargo">
                    <span>货源</span>
                  </Radio>
                  <Radio :label="kindVehicle">
                    <span>车源</span>
                  </Radio>
                </RadioGroup>
              </InputBox>
            </Col>
          </Row>
          <br />
          <Row
            type="flex"
            align="middle"
            justify="start"
            v-for="(item,index) in message.end"
            :key="index"
          >
            <Col>
              <InputBox :label="index==0?'到达地':''">
                <Input
                  v-model="item.end"
                  placeholder="请输入到达地"
                  icon="ios-more"
                  @on-click="showCityModel('end',index)"
                />
              </InputBox>
            </Col>
            <Col offset="1">
              <InputBox :label="index==0?'内容':''">
                <Input v-model="item.content" placeholder="请输入消息内容" />
              </InputBox>
            </Col>
            <Col v-if="message.end.length > 1">
              <Button type="text" @click="on_del_end(index)" icon="ios-close" style="color:#f00">删除</Button>
            </Col>
            <br />
          </Row>

          <br />
          <Row type="flex" justify="center" algin="middle">
            <Col span="6" style="color:#0c0">
              <Button type="text" @click="on_add_end" icon="ios-add" style="color:#0c0">添加到达地</Button>
            </Col>
          </Row>
          <br />

          <Row>
            <Col span="24">
              <InputBox label="联系电话" prop="phone">
                <Input v-model="message.phone" placeholder="请输入联系电话"></Input>
              </InputBox>
            </Col>
          </Row>
          <Row>
            <Col span="24">注：如果需要填写多个号码，请用逗号进行分隔。如：130***,132***</Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" @click="send" style="width:120px;">发布</Button>
      </div>
    </Modal>

    <Modal v-model="showMessageDetailModal" title="大众消息详情" width="600">
      <div style="height:150px; overflow:auto; padding:5px;">
        <Form :model="detail" :label-width="70" label-position="left">
          <Row>
            <Col span="12">
              <InputBox label="起始地" :plain="true">
                <span>{{detail.start}}</span>
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="到达地" :plain="true">
                <span>{{detail.end}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="消息内容" :plain="true">
                <span>{{detail.content}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="联系电话" :plain="true">{{detail.phone}}</InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="消息类型" :plain="true">{{detail.kind == kindCargo ? '货源':'车源' }}</InputBox>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer"></div>
    </Modal>

    <Modal v-model="showCityWindow" title="选择城市" width="300">
      <div style="height:300px; overflow:auto">
        <Tree ref="cityTree" :data="cityTree" @on-select-change="selectCity"></Tree>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import common from "../../../libs/common";
import cityUtil from "../../../libs/city";
import InputBox from "../../components/inputbox";
export default {
  components: {
    InputBox
  },
  data() {
    return {
      dataCount: 0,
      pageIndex: 1,
      pageSize: 10,
      //全部消息
      kindAll: 0x0004,
      //货源类型
      kindCargo: 0x0004 | 0x0100,
      //车源类型
      kindVehicle: 0x0004 | 0x0200,
      search: {
        keyword: "",
        kind: 0x0004,
        start: "",
        end: ""
      },
      messages: [],
      messageColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          align: "center",
          title: "消息类型",
          width: 100,
          key: "kind",
          render: (h, params) => {
            return h("div", [
              h("span", common.messageKind.parse(params.row.kind))
            ]);
          }
        },
        {
          align: "center",
          title: "起始地",
          key: "start"
        },
        {
          align: "center",
          title: "到达地",
          key: "end"
        },
        {
          align: "center",
          title: "发送人",
          width: 150,
          key: "senderName"
        },
        {
          align: "center",
          title: "发送时间",
          key: "time",
          width: 170,
          render: (h, params) => {
            return h(
              "span",
              common.dateFromat(
                new Date(params.row.time),
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
                    type: "primary",
                    size: "small",
                    disabled: !this.allowRole
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.getDetail(params.index);
                    }
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    disabled: !this.allowRole
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.delete(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      detail: {},
      message: {},
      messageRule: {
        kind: [
          {
            validator: this.checkMessageKind,
            trigger: "change,blur"
          }
        ],
        start: [
          {
            validator: this.checkCity,
            trigger: "change,blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: this.checkPhone,
            trigger: "change"
          }
        ]
      },
      showMessageFormModal: false,
      showMessageDetailModal: false,
      showCityWindow: false,
      messageContent: "",
      cityTree: []
    };
  },
  computed: {
    allowRole() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager
      ]);
    }
  },
  mounted() {
    this.reload();
  },
  methods: {
    findMessage() {
      this.pageIndex = 1;
      this.reload();
    },
    reload() {
      this.$ajax
        .post("/api", {
          method: "message.find",
          token: common.user.token,
          parameter: {
            page: this.pageIndex,
            size: this.pageSize,
            kind: this.search.kind,
            start: this.search.start,
            end: this.search.end,
            keyword: this.search.keyword
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取大众消息列表错误",
              content: r.data.error
            });
            return;
          }
          console.log("预览大众消息", r.data.result);
          this.dataCount = r.data.result.count;
          let messages = r.data.result.rows;
          for (let message of messages) {
            message.kind = parseInt(message.kind);
          }
          this.messages = messages;
        });
    },
    searchMessagePageChanged: function(page) {
      this.pageIndex = page;
      this.reload();
    },
    create() {
      this.$refs.messageForm.resetFields();
      this.message = {};
      this.$ajax
        .post("/api", {
          method: "message.issue.public.create",
          token: common.user.token,
          parameter: {
            userId: common.user.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "创建新消息错误",
              content: r.data.error
            });
            return;
          }
          console.log("创建新消息（create）", r.data.result);
          this.message = r.data.result;

          let endList = this.message.end || [{ end: "", content: "" }];
          this.message.end = endList;

          this.messageContent = "";
          this.showMessageFormModal = true;
        });
    },
    showCityModel(cityType, index) {
      this.selectCityType = cityType;
      if (index != null && typeof index != undefined)
        this.current_end_index = index;
      this.showCityWindow = true;
      this.cityTree = cityUtil.getTree();
    },
    selectCity(city) {
      let address = city[0];
      let selectCityType = this.selectCityType;
      switch (selectCityType) {
        case "start":
          this.message.start = address.site;
          break;
        case "end":
          let index = this.current_end_index;
          this.message.end = this.message.end || [{ end: "", content: "" }];
          if (index != null && typeof index != undefined)
            this.message.end[index].end = address.site;
          break;
        case "searchStart":
          this.search.start = address.site;
          break;
        case "searchEnd":
          this.search.end = address.site;
          break;
      }
      this.showCityWindow = false;
    },
    on_add_end() {
      this.message.end = this.message.end || [];
      this.message.end.push({
        end: "",
        content: ""
      });
    },
    on_del_end(index) {
      this.message.end = this.message.end || [];
      this.message.end.splice(index, 1);
    },
    resetContent() {
      let message = this.message;
      let isCargo = message.kind == this.kindCargo;

      let start = common.formatCity(message.start);

      let list = [];
      let endList = message.end || [];
      endList = endList.filter(item => item.end != "" || item.content != "");
      for (let item of endList) {
        let str = common.formatCity(item.end);
        if (item.content && item.content.length > 0)
          str = str + "(" + item.content + ")";
        list.push(str);
      }
      let end = list.join(";");

      this.messageContent = start + " ➙ " + end;
    },
    send() {
      let message = this.message;
      message.phone = message.phone || "";
      message.phone = message.phone.replace(/\ +/g, "");
      message.phone = message.phone.replace(/\，/g, ","); //替换中文逗号
      message.phones = message.phone.split(",");

      message.end = message.end.filter(item => item.end.replace(/\s+/g,"") != "");
      if (message.end.length == 0) {
        this.$Message.error("到达地不能为空");
        message.end.push({ end: "", content: "" });
        return;
      }

      this.$refs.messageForm.validate(valid => {
        if (valid) {
          this.resetContent();
          console.log("message: ", message);
          this.$Modal.confirm({
            title: "发布大众消息",
            content: this.messageContent,
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
              this.$ajax
                .post("/api", {
                  method: "message.issue.send",
                  token: common.user.token,
                  parameter: message
                })
                .then(r => {
                  if (r.data.code !== 0) {
                    this.$Modal.error({
                      title: "发布公网消息失败",
                      content: r.data.error
                    });
                    return;
                  }
                  this.$Message.success("大众消息发布成功");
                  this.showMessageFormModal = false;
                  this.reload();
                });
            }
          });
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    getDetail(index) {
      this.index = index;
      let message = this.messages[index];
      this.$ajax
        .post("/api", {
          method: "message.fetch",
          token: common.user.token,
          parameter: { id: message.id }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error({
              content: r.data.error,
              duration: 10,
              closable: true
            });
            return;
          }
          console.log("大众信息详情（detail）: ", r);
          let detail = r.data.result;
          detail.time = new Date(detail.time);
          detail.phone = detail.phones.join(",");
          this.detail = detail;
          this.showMessageDetailModal = true;
        });
    },
    delete(index) {
      let message = this.messages[index];
      this.$Modal.confirm({
        title: "删除",
        content: "大众消息删除后不能恢复，确定要删除吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "message.delete",
              token: common.user.token,
              parameter: { id: message.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "删除消息错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("删除消息成功");
              this.messages.splice(index, 1);
              if (this.messages.length <= 0) {
                this.pageIndex = this.pageIndex > 2 ? this.pageIndex - 1 : 1;
                this.reload();
              }
            });
        }
      });
    },
    checkMessageKind(rule, value, callback, source, options) {
      let errors = [];
      if (value == 0) errors.push("消息类型是必填项");
      callback(errors);
    },
    checkCity(rule, value, callback, source, options) {
      let errors = [];
      switch (rule.field) {
        case "start":
          if (!value) errors.push("起始地不能为空");
          //else if (!cityUtil.hasCity(value)) errors.push("起始地名称错误");
          break;
        case "end":
          if (!value) errors.push("到达地不能为空");
          //else if (!cityUtil.hasCity(value)) errors.push("到达地名称错误");
          break;
      }
      callback(errors);
    },
    checkPhone(rule, value, callback, source, options) {
      this.validatePhone = [];
      if (!value || value.length == 0)
        this.validatePhone.push("联系电话不能为空");
      else {
        value = value.replace(/\ +/g, ""); //替换空格
        value = value.replace(/\，/g, ","); //替换中文逗号
        let phones = value.split(",");
        for (let phone of phones) {
          let errorMsg = "";
          if (phone) {
            let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            let isMob = /^(0|86|17951)?(1[0-9])[0-9]{9}$/;
            let flag = isMob.test(phone) || isPhone.test(phone);
            if (flag == false) errorMsg = "{" + phone + "}号码格式错误！";
          }
          if (errorMsg) this.validatePhone.push(errorMsg);
        }
      }
      callback(this.validatePhone);
    }
  }
};
</script>


