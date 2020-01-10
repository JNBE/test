<template>
    <div class="royalty">
    <div class="title">业务提成设置</div>
        <Form ref="royaltyForm" :model="royalty" :label-width="180" :rules="royaltyRule">
            <FormItem label="区域总监提成率" prop="manager">
                <InputNumber
                :max="100"
                :min="1"
                v-model="royalty.manager"></InputNumber>
            </FormItem>
            <FormItem label="区域经理提成率" prop="leader">
                <InputNumber
                :max="100"
                :min="1"
                v-model="royalty.leader"></InputNumber>
            </FormItem>
            <FormItem label="销售代表提成率" prop="promoter">
                <InputNumber
                :max="100"
                :min="1"
                v-model="royalty.promoter"></InputNumber>
            </FormItem>
        </Form>
        <div class="btn-save">
            <Button type="success" @click="save" :disabled="!allowEdit">保存</Button>
        </div>
    </div>
</template>

<script>
import common from "../../../libs/common";
export default {
  data() {
    return {
      showModel: false,
      royalty: {},
      royaltys: [],
      royaltyRule: {
        manager: [
          {
            required: true,
            type: "number",
            message: "区域总监提成率不能为空",
            trigger: "change"
          }
        ],
        leader: [
          {
            required: true,
            type: "number",
            message: "区域经理提成率不能为空",
            trigger: "change"
          }
        ],
        promoter: [
          {
            required: true,
            type: "number",
            message: "销售代表提成率不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    allowEdit() {
      return common.user.hasRoles([common.roleKind.admin]);
    }
  },
  mounted: function() {
    if (!this.allowEdit) return;
    this.fetch();
  },
  methods: {
    fetch() {
      this.$ajax
        .post("/api", {
          method: "option.fetch",
          token: common.user.token,
          parameter: { kind: "sys_royalty" }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          this.royalty = r.data.result;
        });
    },
    save() {
      console.log("royalty:", this.royalty);
      this.$refs["royaltyForm"].validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "option.sys.royalty.save",
              token: common.user.token,
              parameter: this.royalty
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              this.$Message.success("保存成功");
              this.royalty = r.data.result;
              this.list();
            });
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./royalty.less";
</style>