<style lang="less" scoped>
@import "./media.less";
</style>
<template>
    <div class="uploadMedia">
        <div class="title">多媒体上传</div>

        <Row>
           <Col span="14">
              <div class="upload">
                <Upload 
                  :action="url" 
                  :data="data"
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
          <Col span="10">
              <Form ref="fileForm" :model="fileForm" inline :label-width="80">
                  <FormItem label="文件名">
                      <Input v-model="fileForm.fileName" placeholder="请输入文件名关键字" clearable></Input>
                  </FormItem>
                  <FormItem>
                      <Button type="primary" @click="search">查找</Button>
                  </FormItem>
              </Form>
          </Col>
        </Row>
        
        <div>
          <Table border :columns="fileColumns" :data="files"></Table>
        </div>
        <div>
          <Page :total="dataCount" show-elevator @on-change="pageChanged" class="page"></Page>
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
        method: "media.upload",
        token: common.user.token
      },
      dataCount: 0,
      pageIndex: 1,
      pageSize: 10,
      fileForm: {
        fileName: ""
      },
      fileColumns: [
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
                style: "height:60px;width:80px;"
              }
            });
          }
        },
        {
          align: "center",
          title: "文件名",
          key: "name"
        },
        {
          align: "center",
          title: "创建时间",
          key: "time",
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
          // width: 150,
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
      ],
      files: []
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
      this.percentage = 0;
      this.files.unshift({
        id: file.response.result.id,
        name: file.response.result.name,
        time: file.response.result.time,
        url : common.website + "/medias/" + file.response.result.file
      });
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
    search() {
      this.pageIndex = 1;
      this.findFile();
    },
    findFile() {
      this.$ajax
        .post("/api", {
          method: "media.find",
          token: common.user.token,
          parameter: {
            fileName: this.fileForm.fileName,
            fileType: "",
            page: this.pageIndex,
            size: this.pageSize
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查找文件列表错误",
              content: r.data.error
            });
            return;
          }
          this.dataCount = r.data.result.count;
          let files = r.data.result.rows;
          for (const file of files) {
            file.url = common.website + "/medias/" + file.file;
          }
          this.files = files;
        });
    },
    pageChanged(page) {
      this.pageIndex = page;
      this.findFile();
    },
    remove(index) {
      this.index = index;
      let info = this.files[index];
      this.$Modal.confirm({
        title: "删除",
        content: "文件删除后不能恢复，确定要删除吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "media.delete",
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
              this.files.splice(index, 1);
              if (this.files.length <= 0) {
                this.pageIndex = this.pageIndex > 2 ? this.pageIndex - 1 : 1;
                this.findFile();
              }
            });
        }
      });
    }
  }
};
</script>