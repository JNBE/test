<template>
    <div class="market">
    <div class="title">销售区域设置</div>
        <Button type="primary" @click="create" :disabled="!allowEdit">添加</Button>
    <Table border :columns="marketColumns" :data="markets"></Table>
    <Modal :mask-closable="false" v-model="showModel" title="销售区域">
        <Form ref="marketForm" :model="market" :label-width="80" :rules="marketRule">
            <Row>
                <Col span="12">
                    <FormItem label="名称" prop="name">
                        <Input v-model="market.name" placeholder="请输入区域名称" :maxlength="30"></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="接入码" prop="accessCode">
                        <Input v-model="market.accessCode" placeholder="请输入接入码" :maxlength="6"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="备注" prop="remark">
                        <Input v-model="market.remark" placeholder="请输入备注" :maxlength="50"></Input>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
          <Button type="success" @click="save" :disabled="!allowEdit">保存</Button>
        </div>
    </Modal>
    </div>
</template>

<script>
import common from "../../../libs/common";
export default {
data() {
    return {
      showModel: false,
      market: {},
      markets: [],
      marketRule: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "change"
          }
        ],
        accessCode: [
          {
            type: "string",
            required: true,
            message: "接入码不能为空"
          }
        ] 
      },
      marketColumns: [
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
          title: "接入码",
          key: "accessCode"
        },
        {
          title: "客户数",
          key: "clients",
        },
        {
          title: "积分数",
          key: "score"
        },
         {
          title: "销售总监",
          key: "adminName"
        },
        {
          title: "备注",
          key: "remark"
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
                    disabled: !(this.allowEdit)
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
      ]
    };
  },
  computed: {
    allowEdit() {
      return common.user.hasRoles([common.roleKind.admin]);
    } 
  },
  mounted: function() {
    if (!this.allowEdit) return;
    this.list();
  },
  methods: {
    list() {
      this.$ajax
        .post("/api", {
          method: "promoter.branch.list",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          this.markets = r.data.result;
        });
    },
    create() {
      this.$ajax
        .post("/api", {
          method: "promoter.branch.create",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          this.market = r.data.result;
          this.showModel = true;
        });
    },
    open(index) {
      this.index = index;
      let info = this.markets[index];

      this.$ajax
        .post("/api", {
          method: "promoter.branch.fetch",
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
          this.market = r.data.result;
          this.showModel = true;
        });
    },
    save() {
      console.log("market:", this.market);
      this.$refs["marketForm"].validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "promoter.branch.save",
              token: common.user.token,
              parameter: this.market
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              this.showModel = false;
              this.market = r.data.result;
              this.list();
            });
          this.showModel = false;
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    remove(index) {
      let info = this.markets[index];
      this.$Modal.confirm({
        title: "删除",
        content: "是否确认删除所选中的销售区域？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "promoter.branch.delete",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              this.$Message.success("删除销售区域成功");
              this.markets.splice(index, 1);
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./market.less";
</style>