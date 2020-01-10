<template>
    <div class="product">
       <div class="title">服务产品管理</div>
        <Button type="primary" @click="create" :disabled="!allowEdit">添加</Button>
        <Modal :mask-closable="false" v-model="showModel" title="服务产品资料">
            <Form ref="productForm" :model="product" :label-width="80" :rules="productRule">
                <Progress :percent="percentage" hide-info v-if="percentage>0"></Progress>
                <Row>
                    <Col span="12">
                        <FormItem label="名称" prop="name">
                            <Input v-model="product.name" placeholder="请输入产品名称" :maxlength="50" :readonly="!canEdit(product)"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="类型" prop="kind">
                            <Select v-model="product.kind" placeholder="请选择产品类型" :disabled="!canEdit(product)">
                                <Option value="a_monthly_fee" >月费</Option>
                                <Option value="b_annual_fee" >年费</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="价格" prop="price">
                            <InputNumber :max="9999999" :min="1" v-model="product.price" :readonly="!canEdit(product)"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="等级" prop="grade">
                            <InputNumber :max="9999999" :min="1" v-model="product.grade" :readonly="!canEdit(product)"></InputNumber>
                        </FormItem> 
                    </Col>
                </Row>
                <FormItem label="角色" prop="role">
                    <Select v-model="product.role" placeholder="请选择适用对象" :disabled="!canEdit(product)">
                        <Option value="agency" >信息部</Option>
                        <Option value="company" >物流企业</Option>
                        <Option value="netfreight" >无车承运</Option>
                    </Select>
                </FormItem>
                 <FormItem label="说明" prop="description">
                    <Input v-model="product.description" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入产品详细说明" :maxlength="250" :readonly="!canEdit(product)"></Input>
                </FormItem>
                <Row v-if="product.state!='create'">
                    <Col span="12">
                        <FormItem label="启用图片" prop="enableFilename">
                            <img :src="product.enableFilename" style="width:100px;height:150px;" />
                            <Upload 
                            :action="url" 
                            :data="enabledData"
                            :format="['jpg','jpeg','png']"
                            :show-upload-list="false"
                            :on-success="success"
                            :on-progress="progress"
                            :before-upload="before"
                            :on-error="error"
                            v-if="product.state=='unsold'">
                                <Button icon="ios-cloud-upload-outline">上传图片</Button>
                            </Upload>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="禁用图片" prop="disableFilename">
                            <img :src="product.disableFilename" style="width:100px;height:150px;" />
                            <Upload 
                            :action="url" 
                            :data="disabledData"
                            :format="['jpg','jpeg','png']"
                            :show-upload-list="false"
                            :on-success="success"
                            :on-progress="progress"
                            :before-upload="before"
                            :on-error="error"
                            v-if="product.state=='unsold'">
                                <Button icon="ios-cloud-upload-outline">上传图片</Button>
                            </Upload>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
              <Button type="success" @click="save" :disabled="!canEdit(product)">保存</Button>
            </div>
        </Modal>
        <Table border :columns="productColumns" :data="products"></Table>
    </div>
</template>

<script>
import common from "../../../libs/common";
export default {
  data() {
    return {
      showModel: false,
      state: {
        create: "新建",
        unsold: "未上架",
        sold: "已上架",
        canceled: "已下架"
      },
      kind: {
        a_monthly_fee: "月费",
        b_annual_fee: "年费"
      },
      url: common.website + "/api",
      percentage: 0,
      product: {},
      products: [],
      productRule: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "change"
          }
        ],
        price: [
          {
            type: "number",
            required: true,
            message: "单价不能为空",
            trigger: "change"
          }
        ],
        role: [
          {
            type: "string",
            required: true,
            message: "适用对象不能为空"
          }
        ],
        grade: [
          {
            type: "number",
            required: true,
            message: "等级不能为空",
            trigger: "change"
          }
        ],
        kind: [
          {
            required: true,
            message: "类型不能为空",
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            message: "说明不能为空",
            trigger: "change"
          }
        ]
      },
      productColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "价格",
          key: "price"
        },
        {
          title: "类型",
          key: "kind",
          render: (h, params) => {
            return h("span", this.kind[params.row.kind]);
          }
        },
        {
          title: "等级",
          key: "grade"
        },
        {
          title: "状态",
          key: "state",
          render: (h, params) => {
            return h("span", this.state[params.row.state]);
          }
        },
        {
          title: "时间",
          key: "createTime",
          width: 150,
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
          width: 220,
          align: "center",
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
                      this.open(params.index);
                    }
                  }
                },
                "打开"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: !(this.allowEdit && this.canEdit(params.row))
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: !(this.allowEdit && this.canEdit(params.row))
                  },
                  on: {
                    click: () => {
                      this.sell(params.index);
                    }
                  }
                },
                "上架"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: !(this.allowEdit && this.canCancel(params.row))
                  },
                  on: {
                    click: () => {
                      this.cancel(params.index);
                    }
                  }
                },
                "下架"
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    allowEdit() {
      return common.user.hasRoles([common.roleKind.admin]);
    },

    enabledData() {
      return {
        method: "product.upload.enabled",
        token: common.user.token,
        id: this.product.id
      };
    },
    disabledData() {
      return {
        method: "product.upload.disabled",
        token: common.user.token,
        id: this.product.id
      };
    }
  },
  mounted: function() {
    if (!this.allowEdit) return;
    this.list();
  },
  methods: {
    canEdit(product) {
      return product.state == "create" || product.state == "unsold";
    },

    canCancel(product) {
      return product.state == "sold";
    },

    success(response, file, fileList) {
      console.log("上传成功:", response, file, fileList);
      this.percentage = 0;
      if (response.result.kind === "enabled") {
        this.product.enableFilename = common.parseImageUrl(
          response.result.filename
        );
      } else {
        this.product.disableFilename = common.parseImageUrl(
          response.result.filename
        );
      }
    },
    progress(event, file, fileList) {
      this.percentage = event.percent;
    },
    error(error, file, fileList) {
      this.$Modal.error({
        title: "文件上传",
        content: "文件上传失败"
      });
    },
    before() {
      this.percentage = 0;
    },
    list() {
      this.$ajax
        .post("/api", {
          method: "product.list",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          this.products = r.data.result;
        });
    },
    create() {
      this.$ajax
        .post("/api", {
          method: "product.create",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          this.product = r.data.result;
          this.showModel = true;
        });
    },
    open(index) {
      this.index = index;
      let info = this.products[index];

      this.$ajax
        .post("/api", {
          method: "product.fetch",
          token: common.user.token,
          parameter: {
            id: info.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          this.product = r.data.result;
          this.product.enableFilename = common.parseImageUrl(
            this.product.enableFilename
          );
          this.product.disableFilename = common.parseImageUrl(
            this.product.disableFilename
          );
          this.showModel = true;
        });
    },
    save() {
      console.log("product:", this.product);
      this.$refs["productForm"].validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "product.save",
              token: common.user.token,
              parameter: this.product
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              this.showModel = false;
              this.product = r.data.result;
              this.product.enableFilename = common.parseImageUrl(
                this.product.enableFilename
              );
              this.product.disableFilename = common.parseImageUrl(
                this.product.disableFilename
              );
              this.list();
              //   if (this.action === "create") {
              //     this.users.push(this.user);
              //   } else {
              //     this.$set(this.users, this.index, this.user);
              //   }
            });
          this.showModel = false;
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    remove(index) {
      let info = this.products[index];
      this.$Modal.confirm({
        title: "删除",
        content: "是否确认删除所选中产品？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "product.delete",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              this.$Message.success("删除产品成功");
              this.products.splice(index, 1);
            });
        }
      });
    },
    sell(index) {
      let info = this.products[index];
      this.$Modal.confirm({
        title: "上架",
        content: "确认上架所选中的产品？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "product.sell",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              this.$Message.success("上架产品成功");
              info.state = "sold";
            });
        }
      });
    },
    cancel(index) {
      let info = this.products[index];
      this.$Modal.confirm({
        title: "下架",
        content: "确认下架所选中的产品？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "product.cancel",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              this.$Message.success("下架产品成功");
              info.state = "canceled";
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./product.less";
</style>