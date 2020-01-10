<style lang="less" scoped>
@import "./client.less";
</style>
<template>
  <div class="client">
    <div class="title">客户审核</div>
    <Form :model="search" inline :label-width="80" style="display:flex; justify-content:flex-end">
      <FormItem label="搜索">
        <Input v-model="search.filter" placeholder="请输入客户/推广员名称" style="width: 200px" clearable></Input>
      </FormItem>
      <FormItem style="margin-left:-80px">
        <Button type="primary" @click="findClient">查找</Button>
      </FormItem>
    </Form>

    <div>
      <Table border :columns="clientColumns" :data="clients"></Table>
    </div>
    <div class="page">
      <Page
        :total="dataCount"
        :page-size="pageSize"
        show-elevator
        @on-change="searchClientPageChanged"
      ></Page>
    </div>

    <Modal v-model="showClientCheckWindow" title="审核客户资料" width="610" scrollable>
      <div style="height:450px; overflow:auto; padding:5px;">
        <Form
          ref="clientCheckForm"
          :model="checkClient"
          :label-width="70"
          :rules="clientRule"
          label-position="left"
        >
          <Row>
            <Col span="11">
              <InputBox label="公司名称" :plain="true">
                <span>{{checkClient.name}}</span>
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="联系人" :plain="true">
                <span>{{checkClient.linkman}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="11">
              <InputBox label="经度" :plain="true">
                <span>{{checkClient.longitude}}</span>
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="纬度" :plain="true">
                <span>{{checkClient.latitude}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="所在地区" :plain="true">
                <span>{{checkClient.cityName}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="详细地址" :plain="true">
                <span>{{checkClient.address}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="经营路线" :plain="true">
                <span>{{checkClient.area}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="联系电话" :plain="true">
                <span>{{checkClient.phone}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="长期信息" :plain="true">
                <span>{{checkClient.notice}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="企业简介" :plain="true">
                <span>{{checkClient.description}}</span>
              </InputBox>
            </Col>
          </Row>

          <Divider>审核结果</Divider>

          <Row>
            <Col span="12">
              <InputBox label="审核结果" prop="state">
                <RadioGroup v-model="checkClient.state" @on-change="checkStateChange">
                  <Radio :label="checkPass">
                    <span>成功</span>
                  </Radio>
                  <Radio :label="checkFailed">
                    <span>失败</span>
                  </Radio>
                </RadioGroup>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="审核意见" prop="checkResult">
                <Input v-model="checkClient.checkResult" placeholder="请输入审核意见" :maxlength="50"></Input>
              </InputBox>
            </Col>
          </Row>
        </Form>

        <Divider>门面图片</Divider>
        <CompanyImage :images="facadeImages" @previewImage="previewImage" />
        <Divider>广告图片</Divider>
        <CompanyImage :images="advertImages" @previewImage="previewImage" />
        <Divider>形象、资质图片</Divider>
        <CompanyImage :images="identityImages" @previewImage="previewImage" />
      </div>
      <div slot="footer">
        <Button type="success" @click="save" style="width:120px;">保存</Button>
      </div>
    </Modal>

    <Modal v-model="showClientDetailWindow" title="客户资料详情" width="610" scrollable>
      <div style="height:450px; overflow:auto; padding:5px;">
        <Form ref="clientDetailForm" :model="clientDetail" :label-width="70" label-position="left">
          <Row>
            <Col span="11">
              <InputBox label="公司名称" :plain="true">
                <span>{{clientDetail.name}}</span>
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="联系人" :plain="true">
                <span>{{clientDetail.linkman}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="11">
              <InputBox label="经度" :plain="true">
                <span>{{clientDetail.longitude}}</span>
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="纬度" :plain="true">
                <span>{{clientDetail.latitude}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="所在地区" :plain="true">
                <span>{{clientDetail.cityName}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="详细地址" :plain="true">
                <span>{{clientDetail.address}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="经营路线" :plain="true">
                <span>{{clientDetail.area}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="联系电话" :plain="true">
                <span>{{clientDetail.phone}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="长期信息" :plain="true">
                <span>{{clientDetail.notice}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="企业简介" :plain="true">
                <span>{{clientDetail.description}}</span>
              </InputBox>
            </Col>
          </Row>

          <Divider v-if="clientDetail.state">审核结果</Divider>

          <Row v-if="clientDetail.state">
            <Col span="12">
              <InputBox label="审核结果" :plain="true">
                <span>{{clientDetail.state}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row v-if="clientDetail.state">
            <Col span="12">
              <InputBox label="审核意见" :plain="true">
                <span>{{clientDetail.checkResult}}</span>
              </InputBox>
            </Col>
          </Row>
        </Form>

        <Divider>门面图片</Divider>
        <CompanyImage :images="facadeImages" @previewImage="previewImage" />
        <Divider>广告图片</Divider>
        <CompanyImage :images="advertImages" @previewImage="previewImage" />
        <Divider>形象、资质图片</Divider>
        <CompanyImage :images="identityImages" @previewImage="previewImage" />
      </div>
      <div slot="footer"></div>
    </Modal>

    <Modal title="图片预览" v-model="showImageWindow" footer-hide>
      <img :src="previewUrl" style="width: 100%; height:400px" />
    </Modal>
  </div>
</template>

<script>
import common from "../../../libs/common";
import InputBox from "../../components/inputbox";
import CompanyImage from "../../components/company_image";
import AreaRadio from "../../components/area_radio";
export default {
  components: {
    InputBox,
    CompanyImage
  },
  data() {
    return {
      dataCount: 0,
      pageIndex: 1,
      pageSize: 8,
      search: {
        filter: ""
      },
      clients: [],
      checkClient: {},
      checkPass: "pass",
      checkFailed: "failed",
      showClientCheckWindow: false,
      showClientDetailWindow: false,
      clientDetail: {},
      clientRule: {},
      clientColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          align: "center",
          title: "门面图片",
          key: "facade",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: common.parseImageUrl(params.row.facade),
                style: "height:60px;width:130px;"
              }
            });
          }
        },
        {
          align: "center",
          title: "客户名称",
          key: "name"
        },
        {
          align: "center",
          title: "推广时间",
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
          title: "审核状态",
          key: "state",
          render: (h, params) => {
            return h("div", [
              h("span", common.checkState[params.row.state].name)
            ]);
          }
        },
        {
          align: "center",
          title: "推广人",
          key: "promoterName"
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
                    disabled: !(this.allowRole && this.canCheck(params.row))
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.check(params.index);
                    }
                  }
                },
                "审核"
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
                      this.detail(params.index);
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
      ],
      previewUrl: "",
      facadeImages: [],
      advertImages: [],
      identityImages: [],
      showImageWindow: false
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
    canCheck(client) {
      return client.state == "uncheck" || client.state == "failed";
    },
    findClient() {
      this.pageIndex = 1;
      this.reload();
    },
    reload() {
      this.$ajax
        .post("/api", {
          method: "promoter.client.browse",
          token: common.user.token,
          parameter: {
            page: this.pageIndex,
            size: this.pageSize,
            filter: this.search.filter,
            state: ""
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取客户列表错误",
              content: r.data.error
            });
            return;
          }
          console.log("获取客户列表", r.data.result);
          this.dataCount = r.data.result.count;
          this.clients = r.data.result.rows;
        });
    },
    searchClientPageChanged: function(page) {
      this.pageIndex = page;
      this.reload();
    },
    // 审核
    check: function(index) {
      this.index = index;
      this.current_info = this.clients[index];
      this.fetchClient();
      this.loadAdvertImages();
      this.loadIdentityImages();
    },
    // 详情
    detail: function(index) {
      this.index = index;
      this.current_info = this.clients[index];
      if(this.current_info.state != common.checkState.pass.code){
        this.getClientDetail();
      }else{
        this.getCompanyDetail();
      }
    },
    getClientDetail(clientId){
      this.$ajax
        .post("/api", {
          method: "promoter.client.detail",
          token: common.user.token,
          parameter: {
            id: this.current_info.clientId
          }
        })
        .then(r => {
          if (r.data.code != 0) {
            this.$Modal.error({
              title: "获取推广客户详情失败",
              content: r.data.error
            });
            return;
          }
          console.log("推广客户信息详情：", r);

          let result = r.data.result;
          result.state = common.checkState[result.state].name;
          let areaList = result.lines.endList || [];
          result.area = areaList.join(",");

          let phones = result.phones || [];
          result.phone = phones.join(",");
          this.clientDetail = result;

          let facadeImages = [result.facade];
          this.facadeImages = common.parseStringImagesUrl(facadeImages,"facade");

          let advertImages = result.adverts || [];
          this.advertImages = common.parseStringImagesUrl(advertImages,"advert");

          let identityImages = result.images || [];
          this.identityImages = common.parseStringImagesUrl(identityImages,"identity");

          this.showClientDetailWindow = true;
        });
    },
    getCompanyDetail(clientId){
      console.log('getCompanyDetail: ',clientId);
      this.$ajax
        .post("/api", {
          method: "company.detail",
          token: common.user.token,
          parameter: {
            id: this.current_info.clientId
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取企业详情失败",
              content: r.data.error
            });
            return;
          }
          console.log("企业详情：", r);

          let result = r.data.result;
          let areaList = result.lines.endList || [];
          result.area = areaList.join(",");

          let phones = result.phones || [];
          result.phone = phones.join(",");
          this.clientDetail = result;

          let facadeImages = [result.facade];
          this.facadeImages = common.parseStringImagesUrl(facadeImages,"facade");

          let advertImages = result.adverts || [];
          this.advertImages = common.parseStringImagesUrl(advertImages,"advert");

          let identityImages = result.images || [];
          this.identityImages = common.parseStringImagesUrl(identityImages,"identity");

          this.showClientDetailWindow = true;
        });
    },
    fetchClient() {
      let info = this.current_info;
      this.$ajax
        .post("/api", {
          method: "promoter.client.fetch",
          token: common.user.token,
          parameter: {
            id: this.current_info.clientId
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取审核推广客户信息失败",
              content: r.data.error
            });
            return;
          }
          console.log("审核推广客户信息：", r);
          let result = r.data.result;

          let list = [result.facade];
          this.facadeImages = common.parseStringImagesUrl(list, "facade");

          let areaList = result.lines.endList || [];
          result.area = areaList.join(",");

          let phones = result.phones || [];
          result.phone = phones.join(",");

          result.state = this.checkPass;
          result.checkResult = "审核通过";

          this.checkClient = result;
          this.showClientCheckWindow = true;
        });
    },
    loadAdvertImages() {
      let info = this.current_info;
      this.$ajax
        .post("/api", {
          method: "company.advert.list",
          token: common.user.token,
          parameter: { pid: info.clientId }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "读取企业广告图片错误",
              content: r.data.error
            });
            return;
          }
          let list = r.data.result;
          this.advertImages = common.parseObjectImagesUrl(list, "advert");
        });
    },
    loadIdentityImages: function() {
      //加载企业形象资质图片
      let info = this.current_info;
      this.$ajax
        .post("/api", {
          method: "company.image.list",
          token: common.user.token,
          parameter: { pid: info.clientId }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "读取企业形象图片错误",
              content: r.data.error
            });
            return;
          }
          let list = r.data.result;
          this.identityImages = common.parseObjectImagesUrl(list, "identity");
        });
    },
    previewImage(item) {
      this.previewUrl = item.url;
      this.showImageWindow = true;
    },
    checkStateChange(state) {
      console.log("checkStateChange:", state);
      if (state == this.checkPass) {
        this.checkClient.state = this.checkPass;
        this.checkClient.checkResult = "审核通过";
      } else if (state == this.checkFailed) {
        this.checkClient.state = this.checkFailed;
        this.checkClient.checkResult = "审核失败";
      }
    },
    onVerify(){
      let client = this.checkClient; 
      let count = 0;

      let v = {};
      let error = "";

      let name = client.name;
      if (!name || name.length <= 0) {
        error = '企业名称不能为空';
        count++;
      }
      v.name = error;

      let cityName = client.cityName;
      if (!cityName || cityName.length <= 0) {
        error = '所在城市不能为空';
        count++;
      }
      v.cityName = error;

      let cityCode = client.cityCode;
      if (!cityCode || cityCode.length <= 0) {
        error = '所在城市代码不能为空';
        count++;
      }
      v.cityCode = error;

      let address = client.address;
      if (!address || address.length <= 0) {
        error = '企业详细地址不能为空';
        count++;
      }
      v.address = error;

       let linkman = client.linkman;
      if (!linkman || linkman.length <= 0) {
        error = '企业联系人不能为空';
        count++;
      }
      v.linkman = error;

      let phone = client.phone;
      if (!phone || phone.length <= 0) {
        error = '企业联系电话不能为空';
        count++;
      }
      v.phone = error;

      return count == 0;

    },
    save() {
      if(!this.onVerify())
        this.$Message.error('审核失败，资料未完善！');

      let checkClient = this.checkClient;
      this.$ajax
        .post("/api", {
          method: "promoter.client.check",
          token: common.user.token,
          parameter: checkClient
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "审核客户资料错误",
              content: r.data.error
            });
            return;
          }
          this.showClientCheckWindow = false;

          let checkClient = this.checkClient;
          let info = this.current_info;
          info.state = checkClient.state;
          this.$set(this.clients, this.index, info);
        });
    }
  }
};
</script>
