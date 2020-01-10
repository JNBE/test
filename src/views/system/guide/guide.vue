<template>
    <div class="advert">

        <div class="title">注册引导页上传</div>

        <Row>
            <Col span="7">
                <div class="upload">
                  <Upload 
                    :action="url" 
                    :data="data"
                    :format="['jpg','jpeg','png']"
                    :show-upload-list="false"
                    :on-success="success"
                    :on-progress="progress"
                    :before-upload="before"
                    :on-error="error"
                    >
                  <Button type="warning" icon="ios-cloud-upload-outline" :disabled="!allowEdit">上传文件</Button>
                  </Upload>
                  <Progress :percent="percentage" hide-info v-if="percentage>0"></Progress>
                </div>
            </Col>
            <Col span="8">
                <Form :model="data" inline :label-width="80">
                    <FormItem label="类型">
                        <Select v-model="data.pid" style="width:300px;" @on-change="pidChanged">
                            <Option value="5aed1dd8a7b96c5ed58b0afb">司机注册页</Option>
                            <Option value="5a6d55f8189ce80428952146">货主注册页</Option> 
                            <Option value="5aed203ea7b96c5ed58b0afe">企业注册页</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Col>
        </Row>
        
        <div style="width:1000px">
          <Table border :columns="advertColumns" :data="adverts"></Table>
        </div>
    </div>
</template>

<script>
import common from "../../../libs/common";
export default {
  data() {
    return {
      percentage: 0,
      url: common.website + "/api",
      data: {
        method: "system.carousel.upload",
        token: common.user.token,
        pid: "5aed1dd8a7b96c5ed58b0afb"
      },
      adverts: [],
      index: 0,
      advertColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          align: "center",
          title: "预览",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.url,
                style: "height:80px;width:200px;"
              }
            });
          }
        },
        {
          align: "center",
          title: "文件名",
          key: "filename"
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
      ]
    };
  },
  computed: {
    allowEdit() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager
      ]);
    }
  },
  mounted: function() {
    this.findFile();
  },
  methods: {
    success(response, file, fileList) {
      console.log("上传成功:", file);
      this.percentage = 0;
      this.index = 0;
      this.findFile();
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
    findFile() {
      this.$ajax
        .post("/api", {
          method: "system.carousel.list",
          token: common.user.token,
          parameter: { pid: this.data.pid }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查找文件列表错误",
              content: r.data.error
            });
            return;
          }
          for (const row of r.data.result) {
            row.url = common.website + "/images/" + row.filename;
          }
          this.index = 0;
          this.adverts = r.data.result;
        });
    },
    pidChanged(){
      this.findFile();
    },
    remove(index) {
      this.index = index;
      let info = this.adverts[index];
      this.$Modal.confirm({
        title: "删除",
        content: "文件删除后不能恢复，确定要删除吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "system.carousel.delete",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "删除文件错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("删除文件成功");
              this.adverts.splice(index, 1);
              this.findFile();
            });
        }
      });
    }
  }
};
</script>

<style scoped>
@import "./guide.less";
</style>