<style lang="less" scoped>
@import "./company.less";
</style>

<template>
  <div class="company-admin-container">
    <div class="title">企业信息表</div>
    <Form
      ref="searchForm"
      :model="search"
      inline
      :label-width="80"
      style="display:flex; justify-content:flex-end"
    >
      <FormItem label="企业">
        <Input v-model="search.companyName" placeholder="请输入企业名称" style="width: 200px" clearable />
      </FormItem>
      <FormItem style="margin-left:-81px">
        <Button type="primary" @click="findCompany">查找</Button>
      </FormItem>
    </Form>

    <Table border :columns="companyColumns" :data="companies"></Table>

    <div class="page">
      <Page
        :total="dataCount"
        :page-size="pageSize"
        show-elevator
        @on-change="searchCompanyPageChanged"
      ></Page>
    </div>

    <Modal v-model="showCompanyFormWindow" title="企业资料" width="610" scrollable>
      <div style="height:400px;overflow:auto">
        <Form
          ref="companyForm"
          :model="company"
          :label-width="70"
          :rules="companyRule"
          label-position="left"
        >
          <Row>
            <Col span="24">
              <InputBox label="类型" prop="kind">
                <CheckboxGroup
                  v-model="kinds"
                  :style="(companyKindError === undefined || companyKindError.length == 0)?'':'border: 1px solid red'"
                >
                  <Checkbox label="测试"></Checkbox>
                  <Checkbox label="普货"></Checkbox>
                  <Checkbox label="专线"></Checkbox>
                  <Checkbox label="冷链"></Checkbox>
                  <Checkbox label="零担(快运)"></Checkbox>
                  <Checkbox label="快递"></Checkbox>
                  <Checkbox label="大件运输"></Checkbox>
                  <Checkbox label="危化品"></Checkbox>
                  <Checkbox label="国际物流"></Checkbox>
                  <Checkbox label="物流园区"></Checkbox>
                </CheckboxGroup>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="11">
              <InputBox label="公司名称" prop="name">
                <Input v-model="company.name" placeholder="请输入公司名称" />
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="联系人" prop="linkman">
                <Input v-model="company.linkman" placeholder="请输入联系人" />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="11">
              <InputBox label="经度">
                <InputNumber
                  v-model="company.longitude"
                  placeholder="请输入所在经度"
                  style="width:185px;"
                />
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="纬度">
                <InputNumber v-model="company.latitude" placeholder="请输入所在纬度" style="width:185px;" />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="所在地区" prop="cityName">
                <Input
                  v-model="company.cityName"
                  placeholder="请选择所在地区"
                  icon="ios-more"
                  @on-click="showCityModel('companyCity')"
                />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="详细地址" prop="address">
                <Input v-model="company.address" placeholder="请输入详细地址" />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="经营路线" prop="area">
                <AreaRadio
                  :list="areaList"
                  @on-removeArea="removeArea"
                  canAdd
                  @on-addArea="showCityModel('area')"
                ></AreaRadio>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="联系电话" prop="phone">
                <Input v-model="company.phone" placeholder="请输入联系电话" />
              </InputBox>
              <span style="width:480px">注：如果需要填写多个号码，请用(半角)逗号进行分隔。如：130***,132***</span>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="长期信息" prop="notice">
                <Input
                  v-model="company.notice"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入长期信息"
                  :maxlength="250"
                />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="企业简价" prop="description">
                <Input
                  v-model="company.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入长期信息"
                  :maxlength="250"
                />
              </InputBox>
            </Col>
          </Row>
        </Form>

        <div>
          <Divider>门面图片</Divider>
          <CompanyImage
            :action="uploadAction"
            :url="imageUrl"
            :postData="postFacadeData()"
            :images="facadeImages"
            :count="2"
            canUpload
            @uploaded="loadCompany"
            @previewImage="previewImage"
          />
          <Divider>轮播图片</Divider>
          <CompanyImage
            :action="uploadAction"
            :url="imageUrl"
            :postData="postCarouselData()"
            :images="carouselImages"
            :count="20"
            canUpload
            @uploaded="loadCarouselImages"
            canRemove
            :remove="removeCarouselImage"
            @previewImage="previewImage"
          />
          <Divider>形象资质图片</Divider>
          <CompanyImage
            :action="uploadAction"
            :url="imageUrl"
            :postData="postIdentityData()"
            :images="identityImages"
            canUpload
            @uploaded="loadIdentityImages"
            canRemove
            :remove="removeIdentityImage"
            @previewImage="previewImage"
          />
        </div>
      </div>
      <div slot="footer" class="company-footer">
        <div>会员：{{member.name}}</div>
        <Button type="success" @click="save" style="width:120px;">保存</Button>
      </div>
    </Modal>

    <Modal
      v-model="showMessageFormWindow"
      title="发布企业消息"
      :width="650"
      scrollable
      :mask-closable="false"
    >
      <div style="height:400px; overflow:auto; padding:5px;">
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
                  class="model-input-200"
                  icon="ios-more"
                  @on-click="showCityModel('start')"
                />
              </InputBox>
            </Col>
            <Col offset="1">
              <InputBox label="消息类型" prop="kind">
                <RadioGroup v-model="message.kind" @on-change="messageKindChange">
                  <Radio :label="kindBroadcast">
                    <span>公网</span>
                  </Radio>
                  <Radio :label="kindPrivate">
                    <span>内网</span>
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
                <Input
                  v-model="message.phone"
                  placeholder="请输入联系电话,"
                  class="model-input-400"
                  clearable
                />
              </InputBox>
            </Col>
          </Row>

          <span style="width:400px">注：如果需要填写多个号码，请用逗号进行分隔。如：130***,132***</span>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" @click="send('cargo')" style="width:120px;">发布货源</Button>
        <Button type="primary" @click="send('vehicle')" style="width:120px;">发布车源</Button>
      </div>
    </Modal>

    <Modal v-model="showCityWindow" title="选择城市" :width="300">
      <div style="height:300px; overflow:auto">
        <Tree ref="cityTree" :data="cityTree" @on-select-change="selectCity"></Tree>
      </div>
      <div slot="footer"></div>
    </Modal>

    <Modal title="图片预览" v-model="showImageWindow" footer-hide>
      <img :src="previewUrl" style="width: 100%; height:400px" />
    </Modal>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import common from "../../../libs/common";
import cityUtil from "../../../libs/city";
import count from "./companyCount/companyCount.vue";
import InputBox from "../../components/inputbox";
import CompanyImage from "../../components/company_image";
import AreaRadio from "../../components/area_radio";
export default {
  components: {
    count,
    InputBox,
    CompanyImage,
    AreaRadio
  },
  data() {
    return {
      dataCount: 0,
      pageIndex: 1,
      pageSize: 20,
      search: {
        companyName: ""
      },
      showCompanyFormWindow: false,
      showMessageFormWindow: false,
      showImageWindow: false,
      showCityWindow: false,
      previewUrl: "",
      kinds: [],
      companyKindError: [],
      phones: [],
      areaList: [],
      company: {},
      member: {},
      companyRule: {
        kind: [
          {
            required: true,
            validator: this.checkCompanyKind,
            trigger: "change,blur"
          }
        ],
        name: [
          {
            required: true,
            message: "公司名称不能为空",
            trigger: "change"
          }
        ],
        linkman: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: "change"
          }
        ],
        cityName: [
          {
            required: true,
            message: "公司所在地区不能为空",
            trigger: "change"
          }
        ],
        phone: [
          {
            required: true,
            validator: this.checkPhone,
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            message: "公司详细地址不能为空",
            trigger: "change"
          }
        ]
      },
      companies: [],
      companyColumns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(count, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          align: "center",
          title: "门面图片",
          width: 120,
          key: "facade",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.facade,
                style: "height:60px;width:80px;"
              }
            });
          }
        },
        {
          align: "center",
          title: "公司名称",
          key: "name"
        },
        {
          align: "center",
          title: "所在城市",
          key: "cityName"
        },
        {
          align: "center",
          title: "详细地址",
          key: "address"
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
                    disabled: !this.canEdit
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
                    width: "10px",
                    disabled: !this.canSendMessage
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.createMessage(params.index);
                    }
                  }
                },
                "发信息"
              )
            ]);
          }
        }
      ],

      imageUrl: common.website,
      uploadAction: common.website + "/api",
      facadeImages: [],
      carouselImages: [],
      identityImages: [],
      postFacadeData: () => {
        return {
          method: "company.facade.upload",
          token: common.user.token,
          id: this.company ? this.company.id : null
        };
      },
      postCarouselData: () => {
        return {
          method: "company.advert.upload",
          token: common.user.token,
          pid: this.company ? this.company.id : null
        };
      },
      postIdentityData: () => {
        return {
          method: "company.image.upload",
          token: common.user.token,
          pid: this.company ? this.company.id : null
        };
      },
      removeCarouselImage: file => {
        this.$ajax
          .post("/api", {
            method: "company.advert.delete",
            token: common.user.token,
            parameter: { id: file.id }
          })
          .then(r => {
            if (r.data.code !== 0) {
              this.$Message.error(r.data.error);
            } else {
              // this.company.url = null;
              // if (this.edited) {
              //   this.edited(this.index, this.company);
              // }
              this.loadCarouselImages();
            }
          });
      },
      removeIdentityImage: file => {
        this.$ajax
          .post("/api", {
            method: "company.image.delete",
            token: common.user.token,
            parameter: { id: file.id }
          })
          .then(r => {
            if (r.data.code !== 0) {
              this.$Message.error(r.data.error);
            } else {
              // this.company.url = null;
              // if (this.edited) {
              //   this.edited(this.index, this.company);
              // }
              this.loadIdentityImages();
            }
          });
      },
      //公网类型
      kindBroadcast: 0x0001,
      //内网类型
      kindPrivate: 0x0002,
      //货源类型
      kindCargo: 0x0100,
      //车源类型
      kindVehicle: 0x0200,
      message: {},
      //消息内容参数
      messageContent: {
        start: "",
        end: "",
        //车辆类型
        carType: "",
        //运费
        freight: "",
        //货物名称
        goodsName: "",
        //货物数量
        weight: "",
        //数量单位
        unit: "吨",
        //结算方式
        settlement: "",
        //装车方式
        loadMethod: ""
      },
      messageRule: {
        start: [
          {
            required: true,
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
      cityTree: [],
      current_content: ""
    };
  },
  computed: {
    // allowRoleEdit() {
    //   return common.user.hasRoles([
    //     common.roleKind.admin,
    //     common.roleKind.backstager
    //   ]);
    canEdit() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager
      ]);
    },

    canSendMessage() {
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
    findCompany() {
      this.pageIndex = 1;
      this.reload();
    },
    reload() {
      this.$ajax
        .post("/api", {
          method: "company.browse",
          token: common.user.token,
          parameter: {
            page: this.pageIndex,
            size: this.pageSize,
            filter: this.search.companyName
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取企业列表错误",
              content: r.data.error
            });
            return;
          }
          console.log("预览物流企业", r.data.result);
          this.dataCount = r.data.result.count;
          let companies = r.data.result.rows;
          for (let company of companies) {
            company.facade = common.website + "/images/" + company.facade;
          }
          this.companies = companies;
        });
    },
    searchCompanyPageChanged: function(page) {
      this.pageIndex = page;
      this.reload();
    },
    edit: function(index) {
      //this.$refs.companyForm.resetFields();
      this.companyKindError = [];
      this.kinds = [];
      this.company = this.companies[index];

      //加载企业信息
      this.loadCompany(this.company.id);
      //加载企业广告图片
      this.loadCarouselImages(this.company.id);
      //加载企业形象资质图片
      this.loadIdentityImages(this.company.id);
      //加载会员
      this.loadMember(this.company.id);

      this.showCompanyFormWindow = true;
    },
    loadCompany: function() {
      //加载企业信息
      this.$ajax
        .post("/api", {
          method: "company.fetch",
          token: common.user.token,
          parameter: {
            id: this.company.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取企业详情错误",
              content: r.data.error
            });
            return;
          }
          let company = r.data.result;
          console.log("获取企业信息（edit）", company);

          let kinds = [];
          for (let item of company.kindList) {
            let kind = "";
            if (item == "-1") kind = "测试";
            else kind = common.convertKindToString[parseInt(item)].name;
            kinds.push(kind);
          }
          this.kinds = kinds;

          this.areaList = [];
          let list = company.lines.endList || [];
          for (let index = 0; index <= list.length - 1; index++) {
            let item = list[index];

            let area = {};
            //area.name = common.formatAdmin(item);
            area.canRemove = true;
            area.admin = item;
            this.areaList.push(area);
          }
          //console.log("this.areaList", this.areaList);

          company.phone = company.phones.join(",");

          this.facadeImages = [];
          let image = {};
          image.status = "finished";
          image.kind = "facade";
          image.filename = company.facade;
          image.url = this.imageUrl + "/images/" + company.facade;
          this.facadeImages.push(image);

          this.company = company;
        });
    },
    loadIdentityImages: function() {
      //加载企业形象资质图片
      //console.log("loadIdentityImages", this.company);
      this.$ajax
        .post("/api", {
          method: "company.image.list",
          token: common.user.token,
          parameter: { pid: this.company.id }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "读取企业形象图片错误",
              content: r.data.error
            });
            return;
          }
          let identityImages = r.data.result;
          for (const item of identityImages) {
            item.status = "finished";
            item.kind = "identity";
            item.filename = item.filename;
            item.url = common.website + "/images/" + item.filename;
          }
          //console.log("identityImages", identityImages);
          this.identityImages = identityImages;
        });
    },
    loadCarouselImages: function() {
      //加载企业广告图片
      this.carouselImages = [];
      this.$ajax
        .post("/api", {
          method: "company.advert.list",
          token: common.user.token,
          parameter: { pid: this.company.id }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "读取企业广告图片错误",
              content: r.data.error
            });
            return;
          }
          let carouselImages = r.data.result;
          for (const item of carouselImages) {
            item.status = "finished";
            item.kind = "carousel";
            item.filename = item.filename;
            item.url = common.website + "/images/" + item.filename;
          }
          this.carouselImages = carouselImages;
          //console.log("loadCarouselImages", carouselImages);
        });
    },
    loadMember(id) {
      this.$ajax
        .post("/api", {
          method: "member.fetch",
          token: common.user.token,
          parameter: { id: id }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "读取企业会员资料错误",
              content: r.data.error
            });
            return;
          }
          this.member = r.data.result;
        });
    },

    previewImage(item) {
      this.previewUrl = item.url;
      this.showImageWindow = true;
    },
    removeArea(index) {
      this.areaList.splice(index, 1);
    },
    resetAreaList(address) {
      let admin = address.site;

      let area = {};
      area.canRemove = true;
      area.admin = admin;
      this.areaList.push(area);
    },
    save: function() {
      let areaList = this.areaList;
      let areas = new Set();
      for (const item of areaList) {
        if (areaList.length > 1 && item.admin == "全国") continue;
        areas.add(item.admin);
      }
      let area = Array.from(areas);
      this.company.lines.endList = area;

      console.log(" this.company: ", this.company);

      this.company.phone = this.company.phone.replace(/\ +/g, "");
      this.company.phone = this.company.phone.replace(/\，/g, ","); //替换中文逗号
      this.company.phones = this.company.phone.split(",");

      let kindList = [];
      for (let item of this.kinds) {
        let kind = 0;
        if (item == "测试") kind = -1;
        else kind = common.convertKindToNumber[item].code;
        kindList.push(kind);
      }

      if (kindList.length > 1) {
        let index = kindList.findIndex(o => o == -1);
        if (index > -1) kindList.splice(index, 1);
      }
      this.company.kindList = kindList;

      this.$refs.companyForm.validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "company.baseInfo.save",
              token: common.user.token,
              parameter: this.company
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "保存会员信息失败",
                  content: r.data.error
                });
                return;
              }

              //this.saveArea();

              this.showCompanyFormWindow = false;

              let info = this.company;
              this.$set(this.companies, this.index, info);
            });
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    /**查看企业统计 */
    gotoCompnayCount: function() {
      //this.$router.push({name: 'company-count'})
      this.$router.push({ path: "count" });
    },
    /***创建消息 */
    createMessage: function(index) {
      this.$refs.messageForm.resetFields();
      let info = this.companies[index];
      this.$ajax
        .post("/api", {
          method: "message.issue.company.create",
          token: common.user.token,
          parameter: {
            userId: info.id
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
          console.log("新消息（createMessage）", r.data.result);
          this.message = r.data.result;
          this.message.kind = parseInt(this.message.kind);
          this.message.phone = this.message.phones.join(",");

          let endList = this.message.end || [{ end: "", content: "" }];
          this.message.end = endList;

          this.showMessageFormWindow = true;
        });
    },
    messageKindChange(kind) {
      if (kind == this.kindBroadcast) {
        this.message.kind = this.kindBroadcast;
      } else if (kind == this.kindPrivate) {
        this.message.kind = this.kindPrivate;
      }
    },
    showCityModel(cityType, index) {
      this.selectCityType = cityType;
      if (index != null && typeof index != undefined)
        this.current_end_index = index;
      this.showCityWindow = true;
      this.cityTree = cityUtil.getTree();
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
    selectCity(city) {
      console.log("selectCity: ", city);
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
        case "area":
          this.resetAreaList(address);
          break;
        case "companyCity":
          this.company.cityCode = address.code;
          this.company.cityName = address.site;
          break;
      }
      this.showCityWindow = false;
    },

    /**发布消息 */
    send(messageKind) {
      this.$refs.messageForm.validate(valid => {
        if (valid) {
          let message = this.message;
          message.phone = message.phone.replace(/\ +/g, "");
          message.phone = message.phone.replace(/\，/g, ","); //替换中文逗号
          message.phones = message.phone.split(",");

          message.end = message.end.filter(item => item.end.replace(/\s+/g,"") != "");
          if (message.end.length == 0) {
            this.$Message.error("到达地不能为空");
            message.end.push({ end: "", content: "" });
            return;
          }

          if (messageKind === "cargo") message.kind |= this.kindCargo;
          else message.kind |= this.kindVehicle;

          this.$ajax
            .post("/api", {
              method: "message.issue.send",
              token: common.user.token,
              parameter: message
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title:
                    messageKind === "cargo"
                      ? "发布货源消息失败"
                      : "发布车源消息失败",
                  content: r.data.error
                });
                return;
              }
            });

          this.$Message.success(
            messageKind === "cargo" ? "发布货源消息成功" : "发布车源消息成功"
          );
          this.showMessageFormWindow = false;
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    checkCompanyKind(rule, value, callback, source, options) {
      this.companyKindError = [];
      if (value == 0) this.companyKindError.push("企业类型是必填项");
      callback(this.companyKindError);
    },
    checkCity(rule, value, callback, source, options) {
      let errors = [];
      switch (rule.field) {
        case "start":
          if (!value) errors.push("起始地不能为空");
          break;
      }
      callback(errors);
    },
    checkPhone(rule, value, callback, source, options) {
      let phoneError = [];
      if (!value) phoneError.push("联系电话不能为空");
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
          if (errorMsg) phoneError.push(errorMsg);
        }
      }
      callback(phoneError);
    }
  }
};
</script>


