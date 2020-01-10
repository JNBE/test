<style lang="less" scoped>
@import "./vehicle.less";
</style>

<template>
  <div class="vehicle-container">
    <div class="title">车辆信息表</div>

    <Form
      ref="searchForm"
      :model="search"
      inline
      :label-width="80"
      style="display:flex; justify-content:flex-end"
    >
      <FormItem>
        <Input v-model="search.filter" placeholder="请输入司机名称/车牌号" style="width: 200px" clearable />
      </FormItem>
      <FormItem style="margin-left:-81px">
        <Button type="primary" @click="findVehicle">查找</Button>
      </FormItem>
    </Form>

    <Table border :columns="vehicleColumns" :data="vehicles"></Table>

    <div class="page">
      <Page
        :total="dataCount"
        :page-size="pageSize"
        show-elevator
        @on-change="searchVehiclePageChanged"
      ></Page>
    </div>

    <Modal v-model="showVehicleFormModal" title="车辆资料" width="610" scrollable>
      <div style="height:400px;overflow:auto">
        <Form
          ref="vehicleForm"
          :model="vehicle"
          :label-width="70"
          :rules="vehicleRule"
          label-position="left"
        >
          <Row>
            <Col span="24">
              <InputBox label="企业名称" prop="company">
                <Input v-model="vehicle.company" placeholder="请输入企业名称" />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="司机姓名" prop="driverName">
                <Input v-model="vehicle.driverName" placeholder="请输入司机姓名" />
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="联系电话" prop="driverPhone">
                <Input v-model="vehicle.driverPhone" placeholder="请输入联系电话" />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="车辆类型" prop="vehicleTypeName">
                <!-- <Input v-model="vehicle.vehicleTypeName" placeholder="请输入车辆类型" /> -->
                <Input
                  v-model="vehicle.vehicleTypeName"
                  placeholder="请选择车牌类型"
                  class="model-input-180"
                  icon="ios-more"
                  @on-click="showVehicleTypeModel"
                />
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="车牌类型" prop="plateTypeName">
                <!-- <Input v-model="vehicle.plateTypeName" placeholder="请输入车牌类型" /> -->
                 <Input
                  v-model="vehicle.plateTypeName"
                  placeholder="请选择车牌类型"
                  class="model-input-180"
                  icon="ios-more"
                  @on-click="showPlateTypeModel"
                />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="主车牌号" prop="mainPlate">
                <Input v-model="vehicle.mainPlate" placeholder="请输入主车牌号" />
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="挂车牌号" prop="subPlate">
                <Input v-model="vehicle.subPlate" placeholder="请输入挂车牌号" />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="车载质量(吨)" prop="load">
                <Input v-model="vehicle.load" placeholder="请输入车载质量" number />
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="车载容量(方)" prop="volume">
                <Input v-model="vehicle.volume" placeholder="请输入车载容量" number />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="运输证号" prop="transportNumber">
                <Input v-model="vehicle.transportNumber" placeholder="请输入运输证号" />
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="身份证号" prop="driverIdCard">
                <Input v-model="vehicle.driverIdCard" placeholder="请输入身份证号" />
              </InputBox>
            </Col>
          </Row>
        </Form>

        <Divider>车辆图片</Divider>
        <VehicleImage
          :action="uploadAction"
          :url="imageUrl"
          :postData="postVehicleImagesData()"
          :images="vehicleImages"
          :count="20"
          canUpload
          @uploaded="loadVehicleImages"
          canRemove
          :remove="removeImages"
          @previewImage="previewImage"
        />

        <Divider>身份证正反面图片</Divider>
        <VehicleImage
          :action="uploadAction"
          :url="imageUrl"
          :postData="postIdentityImagesData()"
          :images="identityImages"
          :count="20"
          canUpload
          @uploaded="loadIdentityImages"
          canRemove
          :remove="removeImages"
          @previewImage="previewImage"
        />

        <Divider>驾驶证图片</Divider>
        <VehicleImage
          :action="uploadAction"
          :url="imageUrl"
          :postData="postLicenseImagesData()"
          :images="licenseImages"
          :count="20"
          canUpload
          @uploaded="loadLicenseImages"
          canRemove
          :remove="removeImages"
          @previewImage="previewImage"
        />
        <Divider>道路运输证图片</Divider>
        <VehicleImage
          :action="uploadAction"
          :url="imageUrl"
          :postData="postTransportImagesData()"
          :images="transportImages"
          :count="20"
          canUpload
          @uploaded="loadTransportImages"
          canRemove
          :remove="removeImages"
          @previewImage="previewImage"
        />
      </div>
      <div slot="footer" class="vehicle-footer">
        <div>会员：{{member.name}}</div>
        <Button type="success" @click="save" style="width:120px;">保存</Button>
      </div>
    </Modal>

    <Modal v-model="showVehicleDetailModal" title="车辆详情" width="610" scrollable>
      <div style="height:400px;overflow:auto">
        <Form :model="detail" :label-width="70" label-position="left" >
          <Row>
            <Col span="24">
              <InputBox label="企业名称" :plain=true>
                 <span>{{detail.company}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="司机姓名" :plain=true>
                 <span>{{detail.driverName}}</span>
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="联系电话" :plain=true>
                 <span>{{detail.driverPhone}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="车辆类型" :plain=true>
                 <span>{{detail.vehicleTypeName}}</span>
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="车牌类型" :plain=true>
                 <span>{{detail.plateTypeName}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="主车牌号" :plain=true>
                 <span>{{detail.mainPlate}}</span>
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="挂车牌号" :plain=true>
                 <span>{{detail.subPlate}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <InputBox label="车载质量(吨)" :plain=true>
                 <span>{{detail.load}}</span>
              </InputBox>
            </Col>
            <Col span="12">
              <InputBox label="车载容量(方)" :plain=true>
                 <span>{{detail.volume}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="运输证号" :plain=true>
                 <span>{{detail.transportNumber}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="身份证号" :plain=true>
                 <span>{{detail.driverIdCard}}</span>
              </InputBox>
            </Col>
          </Row>
        </Form>

        <Divider>车辆图片</Divider>
        <VehicleImage :url="imageUrl" :images="vehicleImages" @previewImage="previewImage" />
        <Divider>身份证正反面图片</Divider>
        <VehicleImage :images="identityImages" @previewImage="previewImage" />
        <Divider>驾驶证图片</Divider>
        <VehicleImage :images="licenseImages"  @previewImage="previewImage" />
        <Divider>道路运输证图片</Divider>
        <VehicleImage :images="transportImages" @previewImage="previewImage"/>
      </div>
      <div slot="footer"> </div>
    </Modal>

    <Modal title="图片预览" v-model="showImageModal" footer-hide>
      <img :src="previewUrl" style="width: 100%; height:400px" />
    </Modal>

        <Modal v-model="showPlateTypeModal" title="选择车牌类型" width="400" class-name="vertical-center-modal" scrollable :mask-closable="false" :footer-hide=true>
      <div style="height:300px; overflow:auto">
        <Tree :data="typeTree" @on-select-change="selectPlateType"></Tree>
      </div>
    </Modal>

    <Modal v-model="showVehicleTypeModal" title="选择车辆类型" width="400" class-name="vertical-center-modal" scrollable :mask-closable="false" :footer-hide=true>
      <div style="height:300px; overflow:auto">
        <Tree :data="typeTree" @on-select-change="selectVehicleType"></Tree>
      </div>
    </Modal>

  </div>
</template>

<script>
import common from "../../../libs/common";
import code from "../../../libs/code";
import InputBox from "../../components/inputbox";
import VehicleImage from "../../components/vehicle_image";
export default {
  components: {
    InputBox,
    VehicleImage
  },
  data() {
    return {
      dataCount: 0,
      pageIndex: 1,
      pageSize: 20,
      search: {
        filter: ""
      },
      showVehicleFormModal: false,
      showVehicleDetailModal: false,
      showResetModal: false,
      member: {},
      vehicles: [],
      vehicle: {},
      detail: {},
      vehicleRule: {
        company: [
          {
            required: true,
            message: "司机企业不能为空",
            trigger: "change"
          }
        ],
        driverName: [
          {
            required: true,
            message: "司机姓名不能为空",
            trigger: "change"
          }
        ],
        driverPhone: [
          {
            validator: this.checkPhone,
            trigger: "change,blur"
          }
        ],
        mainPlate: [{ validator: this.checkVehicleNumber, trigger: "change" }],
        subPlate: [{ validator: this.checkVehicleNumber, trigger: "change" }]
      },
      vehicleColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          align: "center",
          title: "司机姓名",
          key: "driverName"
        },
        {
          align: "center",
          title: "车辆类型",
          key: "vehicleTypeName"
        },
        {
          align: "center",
          title: "车牌类型",
          key: "plateTypeName"
        },
        {
          align: "center",
          title: "车牌号",
          key: "mainPlate"
        },
        {
          align: "center",
          title: "所属企业",
          key: "company"
        },
        {
          align: "center",
          title: "车辆状态",
          key: "state",
          render: (h, params) => {
            return h("div", [
              h("span", common.vehicleState[params.row.state].name)
            ]);
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
                    type: "text",
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
              )
            ]);
          }
        }
      ],
      showImageModal: false,
      showPlateTypeModal: false,
      showVehicleTypeModal: false,
      typeTree: [],
      selectType: "",
      previewUrl: "",
      imageUrl: common.website,
      uploadAction: common.website + "/api",
      vehicleImages: [],
      identityImages: [],
      licenseImages: [],
      transportImages: [],
      postVehicleImagesData: () => {
        return {
          method: "vehicle.image.upload",
          token: common.user.token,
          pid: this.vehicle ? this.vehicle.id : null,
          kind: 0x20
        };
      },
      postIdentityImagesData: () => {
        return {
          method: "vehicle.image.upload",
          token: common.user.token,
          pid: this.vehicle ? this.vehicle.id : null,
          kind: 0x40
        };
      },
      postLicenseImagesData: () => {
        return {
          method: "vehicle.image.upload",
          token: common.user.token,
          pid: this.vehicle ? this.vehicle.id : null,
          kind: 0x80
        };
      },
      postTransportImagesData: () => {
        return {
          method: "vehicle.image.upload",
          token: common.user.token,
          pid: this.vehicle ? this.vehicle.id : null,
          kind: 0x0100
        };
      },
      removeImages: file => {
        console.log("file: ", file);
        this.$ajax
          .post("/api", {
            method: "vehicle.image.delete",
            token: common.user.token,
            parameter: { id: file.id }
          })
          .then(r => {
            if (r.data.code !== 0) {
              this.$Message.error(r.data.error);
            } else {
              if (file.type == "vehicle") this.loadVehicleImages();
              else if (file.type == "identity") this.loadIdentityImages();
              else if (file.type == "license") this.loadLicenseImages();
              else if (file.type == "transport") this.loadTransportImages();
            }
          });
      }
    };
  },
  computed: {
    allowRole() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager,
        common.roleKind.promoter
      ]);
    },
    allowEdit() {
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
            let isMob = /^(0|86|17951)?(1[0-9])[0-9]{9}$/;
            let flag = isMob.test(phone) || isPhone.test(phone);
            if (flag == false) errorMsg = "号码{ " + phone + " }格式错误！";
          }
          if (errorMsg) phoneErrors.push(errorMsg);
        }
      }
      callback(phoneErrors);
    },
    checkVehicleNumber(rule, value, callback, source, options) {
      let errors = [];
      value = value.replace(/\s+/g, "");
      if (value) {
        value = value.toUpperCase();
        let result = false;
        if (value.length == 7) {
          let express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
          result = express.test(value);
        }
        if (result == false) {
          errors.push("车牌号输入错误");
        }
      }
      callback(errors);
    },
    findVehicle() {
      this.pageIndex = 1;
      this.reload();
    },
    reload() {
      this.$ajax
        .post("/api", {
          method: "vehicle.browse",
          token: common.user.token,
          parameter: {
            page: this.pageIndex,
            size: this.pageSize,
            filter: this.search.vehicleName
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取车辆列表错误",
              content: r.data.error
            });
            return;
          }
          console.log("获取车辆列表", r.data.result);
          this.dataCount = r.data.result.count;
          this.vehicles = r.data.result.rows;
        });
    },
    searchVehiclePageChanged: function(page) {
      this.pageIndex = page;
      this.reload();
    },
    edit: function(index) {
      this.current_index = index;
      let info = this.vehicles[this.current_index];
      this.current_id = info.id;
      this.loadBaseInfo();
      this.loadVehicleImages();
      this.loadIdentityImages();
      this.loadLicenseImages();
      this.loadTransportImages();
      this.loadMember(info.id);
      console.log("车辆资料", this.vehicle);
      this.showVehicleFormModal = true;
    },
    getDetail: function(index) {
      let info = this.vehicles[index];
      this.current_id = info.id;
      this.$ajax
        .post("/api", {
          method: "vehicle.detail",
          token: common.user.token,
          parameter: {
            id: this.current_id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取车辆信息失败",
              content: r.data.error
            });
            return;
          }
          console.log("车辆详情", r);
          let detail = r.data.result;
          detail.createTime = new Date(detail.createTime);

          this.vehicleImages = common.parseStringImagesUrl(
            detail.vehicleImages,
            "vehicle"
          );
          this.identityImages = common.parseStringImagesUrl(
            detail.identityImages,
            "identity"
          );
          this.licenseImages = common.parseStringImagesUrl(
            detail.licenseImages,
            "license"
          );
          this.transportImages = common.parseStringImagesUrl(
            detail.transportImages,
            "transport"
          );

          this.detail = detail;
          console.log("车辆详情", detail);
          this.showVehicleDetailModal = true;
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
              title: "读取车辆会员资料错误",
              content: r.data.error
            });
            return;
          }
          this.member = r.data.result;
        });
    },
    loadBaseInfo() {
      this.$ajax
        .post("/api", {
          method: "vehicle.baseinfo.fetch",
          token: common.user.token,
          parameter: {
            id: this.current_id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取车辆信息失败",
              content: r.data.error
            });
            return;
          }
          console.log("vehicleBaseInfo: ", r);
          let vehicle = r.data.result;
          this.vehicle = vehicle;
        });
    },
    loadVehicleImages() {
      this.$ajax
        .post("/api", {
          method: "vehicle.image.list",
          token: common.user.token,
          parameter: {
            pid: this.current_id,
            kind: 0x20
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取车辆图片失败",
              content: r.data.error
            });
            return;
          }
          //console.log("vehicleImages: ", r);
          let list = r.data.result;
          this.vehicleImages = common.parseObjectImagesUrl(list, "vehicle");
        });
    },
    loadIdentityImages() {
      this.$ajax
        .post("/api", {
          method: "vehicle.image.list",
          token: common.user.token,
          parameter: {
            pid: this.current_id,
            kind: 0x40
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取司机身份证图片失败",
              content: r.data.error
            });
            return;
          }
          //console.log("identityImages: ", r);
          let list = r.data.result;
          this.identityImages = common.parseObjectImagesUrl(list, "identity");
        });
    },
    loadLicenseImages() {
      this.$ajax
        .post("/api", {
          method: "vehicle.image.list",
          token: common.user.token,
          parameter: {
            pid: this.current_id,
            kind: 0x80
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取驾驶证图片失败",
              content: r.data.error
            });
            return;
          }
          //console.log("licenseImages: ", r);
          let list = r.data.result;
          this.licenseImages = common.parseObjectImagesUrl(list, "license");
        });
    },
    loadTransportImages() {
      this.$ajax
        .post("/api", {
          method: "vehicle.image.list",
          token: common.user.token,
          parameter: {
            pid: this.current_id,
            kind: 0x0100
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取道路运输证图片失败",
              content: r.data.error
            });
            return;
          }
          //console.log("transportImages: ", r);
          let list = r.data.result;
          this.transportImages = common.parseObjectImagesUrl(list, "transport");
        });
    },
    previewImage(item) {
      this.previewUrl = item.url;
      this.showImageModal = true;
    },

    /***车牌类型*/
    showPlateTypeModel() {
      this.typeTree = code.plateTypeList;
      this.showPlateTypeModal = true;
    },
    selectPlateType(type) {
      let item = type[0];
      item.selected = false;

      this.vehicle.plateTypeCode = item.code;
      this.vehicle.plateTypeName = item.title;

      this.showPlateTypeModal = false;
    },
    /***车辆类型*/
    showVehicleTypeModel() {
      this.typeTree = code.vehicleTypeList;
      this.showVehicleTypeModal = true;
    },
    selectVehicleType(type) {
      let item = type[0];
      item.selected = false;

      this.vehicle.vehicleTypeCode = item.code;
      this.vehicle.vehicleTypeName = item.title;

      this.showVehicleTypeModal = false;
    },
    save() {
      let vehicle = this.vehicle;
      this.$ajax
        .post("/api", {
          method: "vehicle.baseinfo.save",
          token: common.user.token,
          parameter: vehicle
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "保存车辆信息失败",
              content: r.data.error
            });
            return;
          }
          let info = this.vehicles[this.current_index];
          info.driverName = vehicle.driverName;
          info.vehicleTypeName = vehicle.vehicleTypeName;
          info.plateTypeName = vehicle.plateTypeName;
          info.mainPlate = vehicle.mainPlate;
          info.company = vehicle.company;

          this.showVehicleFormModal = false;
        });
    }
  }
};
</script>

