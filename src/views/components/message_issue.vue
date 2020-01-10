<style scoped>
</style>

<template>
  <div>
    <Modal v-model="visible" :title="title" width="600">
      <div style="height:250px; overflow:auto; padding:5px;">
        <Form
          ref="messageForm"
          :model="message"
          :label-width="70"
          :rules="messageRule"
          label-position="left"
        >
          <Row>
            <Col span="11">
              <InputBox label="起始地" prop="start" placement="bottom">
                <Input
                  v-model="message.start"
                  placeholder="请输入起始地"
                  icon="ios-more"
                  @on-click="showCityModel('start')"
                  @on-change="resetContent"
                />
              </InputBox>
            </Col>
            <Col span="11" offset="2">
              <InputBox label="消息类型" prop="kind">
                <RadioGroup v-model="message.kind">
                  <Radio label="cargo">
                    <span>货源</span>
                  </Radio>
                  <Radio label="vehicle">
                    <span>车源</span>
                  </Radio>
                </RadioGroup>
              </InputBox>
            </Col>
          </Row>

          <!-- <Row>
            <Col span="11">
              <InputBox label="目的地" prop="end" placement="bottom">
                <Input
                  v-model="message.end"
                  placeholder="请输入目的地"
                  icon="ios-more"
                  @on-click="showCityModel('end')"
                  @on-change="resetContent"
                />
              </InputBox>
            </Col>
            <Col span="13">
              <InputBox prop="content">
                <Input v-model="message.content" placeholder="请输入货物信息" />
              </InputBox>
            </Col>
          </Row> -->

          <List>
              <block v-for="item in message.end">
                <ListItemMeta title="title" description="description." />
              </block>
          </List>

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

    <Modal v-model="showCityWindow" title="选择城市" width="300">
      <div style="height:300px; overflow:auto">
        <Tree ref="cityTree" :data="cityTree" @on-select-change="selectCity"></Tree>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import cityUtil from "../../libs/city";
import InputBox from "./inputbox";
import Emitter from "./emitter";
export default {
  name: "MessageIssue",
  components: { InputBox },
  mixins: [Emitter],
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
        end: [
          {
            validator: this.checkCity,
            trigger: "change,blur"
          }
        ],
        content: [
          {
            required: true,
            trigger: "change",
            message: "消息不能为空"
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
      showCityWindow: false,
      cityTree: []
    };
  },
  watch: {
    visible(val) {
      console.log("visible: ", val);
    }
  },
  methods: {
    showCityModel(cityType) {
      this.selectCityType = cityType;
      this.showCityWindow = true;
      this.cityTree = cityUtil.getTree();
    },
    selectCity(city) {
      let address = city[0];
      let selectCityType = this.selectCityType;
      switch (selectCityType) {
        case "start":
          this.message.start = address.site;
          this.resetContent();
          break;
        case "end":
          this.message.end = address.site;
          this.resetContent();
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
    resetContent() {
      let message = this.message;

      let start = message.start || "";
      let end = message.end || "";
      if (start) {
        let startList = start.split("/");
        if (startList.length > 1 && common.inCityArray(startList[0]) === false)
          startList.splice(0, 1);
        start = startList.join("") + " ➙ ";
        //start = start.replace(/\//g, '') + ' ➙ ';
      }
      if (end) {
        let endList = end.split("/");
        if (endList.length > 1 && common.inCityArray(endList[0]) === false)
          endList.splice(0, 1);
        end = endList.join("") + "，";
        //end = end.replace(/\//g, '');
      }

      let str = start + end;
      this.message.content = str;
    },
    send() {
      this.$emit("send", this.message);
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
          if (!value) errors.push("目的地不能为空");
          //else if (!cityUtil.hasCity(value)) errors.push("目的地名称错误");
          break;
      }
      callback(errors);
    },
    checkPhone(rule, value, callback, source, options) {
      this.validatePhone = [];
      if (!value) this.validatePhone.push("联系电话不能为空");
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