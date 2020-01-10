<style lang="less" scoped>
@import "./unpublished.less";
</style>
<template>
    <div class="notice-unpublished-container">
        <Form ref="findForm" :model="findForm" inline :label-width="80">
            <FormItem label="标题">
                <Input v-model="findForm.title" placeholder="请输入标题关键字" clearable></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="findNotices">查找</Button>
            </FormItem>
        </Form>
        <div class="tools">
          <Button type="primary" @click="create" :disabled="!allowCreate">新建</Button>
        </div>
        <div>
          <Table border :columns="noticeColumns" :data="notices"></Table>
        </div>
        <div class="page">
          <Page :total="dataCount" show-elevator @on-change="pageChanged"></Page>
        </div>
        <Modal :mask-closable="false" v-model="showModel" title="公告信息" width="1000">
          <Form ref="noticeForm" :model="notice" :label-width="80" :rules="noticeRule">
            <FormItem label="标题" prop="title">
              <Input v-model="notice.title" placeholder="请输入公告标题"></Input>
            </FormItem>
            <FormItem label="简介" prop="info">
              <Input v-model="notice.info" placeholder="请输入简要说明"></Input>
            </FormItem>
            <FormItem label="标题图片" prop="filename">
              <Input v-model="notice.filename" placeholder="请输入标题图片路径" readonly>
                <Button slot="append" icon="ios-search" @click="findResource"></Button>
              </Input>
            </FormItem>
            <FormItem label="有效日期">
              <Row>
                  <Col span="4">
                    <FormItem prop="startTime">
                        <DatePicker type="date" placeholder="开始日期"  v-model="notice.startTime" :clearable="false"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="1" style="text-align: center">-</Col>
                  <Col span="19">
                    <FormItem prop="endTime">
                        <DatePicker type="date" placeholder="结束日期"  v-model="notice.endTime" :clearable="false"></DatePicker>
                    </FormItem>
                  </Col>
              </Row>
            </FormItem>
            <FormItem label="公告内容" prop="content">
              <editor class="editor" :value="notice.content"  :setting="editorSetting" @input="(content)=> notice.content = content"></editor>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="success" @click="save">保存</Button>
          </div>
        </Modal>
    </div>
</template>
<script>
import common from "../../../libs/common";
import editor from "../../components/editor";
import searchMedia from "../../components/searchMedia";
export default {
  components: {
    editor,
    searchMedia
  },
  data() {
    return {
      notice: {
        content: ""
      },
      notices: [],
      dataCount: 0,
      pageIndex: 1,
      pageSize: 10,
      findForm: {
        title: ""
      },
      showModel: false,
      editorSetting: {
        height: 300
      },
      noticeRule: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "change"
          }
        ],
        info: [
          {
            required: true,
            message: "简介不能为空",
            trigger: "change"
          }
        ],
        filename: [
          {
            required: true,
            message: "标题图片不能为空",
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "内容不能为空",
            trigger: "change"
          }
        ],
        startTime: [
          {
            validator: this.checkStartTime,
            trigger: "change"
          }
        ],
        endTime: [
          {
            validator: this.checkEndTime,
            trigger: "change"
          }
        ]
      },
      noticeColumns: [
        {
          title: "序号",
          type: "index",
          width: 100,
          align: "center"
        },
        {
          align: "left",
          title: "标题",
          key: "title"
        },
        {
          align: "left",
          title: "简介",
          key: "info"
        },
        {
          align: "center",
          title: "作者",
          key: "authorName"
        },
        {
          align: "center",
          title: "时间",
          key: "authorTime",
          render: (h, params) => {
            return h(
              "span",
              common.dateFromat(
                new Date(params.row.authorTime),
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
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
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
                    type: "error",
                    size: "small",
                    disabled: !this.allowDelete
                  },
                  style: {
                    marginRight: "5px"
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
                    type: "primary",
                    size: "small",
                    disabled: !this.allowPublish
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.publish(params.index);
                    }
                  }
                },
                "发布"
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    allowCreate() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager
      ]);
    },
    allowEdit() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager
      ]);
    },
    allowDelete() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager
      ]);
    },
    allowPublish() {
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
    checkStartTime(rule, value, callback, source, options) {
      this.$refs.noticeForm.validateField("endTime");
      callback();
    },
    checkEndTime(rule, value, callback, source, options) {
      if (this.notice.endTime >= this.notice.startTime) {
        callback();
      } else {
        callback(["结束日期必须大于开始日期"]);
      }
    },
    reload() {
      this.$ajax
        .post("/api", {
          method: "notice.find",
          token: common.user.token,
          parameter: {
            page: this.pageIndex,
            size: this.pageSize,
            title: this.findForm.title,
            state: common.articleState.draft
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取公告列表错误",
              content: r.data.error
            });
            return;
          }
          this.dataCount = r.data.result.count;
          this.notices = r.data.result.rows;
        });
    },
    pageChanged(page) {
      this.pageIndex = page;
      this.reload();
    },
    findNotices() {
      this.pageIndex = 1;
      this.reload();
    },
    edit(index) {
      this.index = index;
      let info = this.notices[index];
      this.$ajax
        .post("/api", {
          method: "notice.fetch",
          token: common.user.token,
          parameter: {
            id: info.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "修改公告错误",
              content: r.data.error
            });
            return;
          }
          let notice = r.data.result;
          notice.startTime = new Date(notice.startTime);
          notice.endTime = new Date(notice.endTime);
          this.notice = notice;
          this.showModel = true;
        });
    },
    create() {
      this.$ajax
        .post("/api", {
          method: "notice.create",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "新建公告错误",
              content: r.data.error
            });
            return;
          }
          let notice = r.data.result;
          notice.startTime = new Date(notice.startTime);
          notice.endTime = new Date(notice.endTime);
          this.notice = notice;
          this.showModel = true;
        });
    },
    save() {
      this.$refs.noticeForm.validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "notice.save",
              token: common.user.token,
              parameter: this.notice
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "保存公告错误",
                  content: r.data.error
                });
                return;
              }
              this.notice = r.data.result;
              this.showModel = false;
              let info = {
                id: this.notice.id,
                title: this.notice.title,
                filename: this.notice.filename,
                info: this.notice.info,
                authorName: this.notice.authorName,
                authorTime: new Date()
              };
              let index = this.notices.findIndex(x => x.id === info.id);
              if (index == -1) {
                this.notices.unshift(info);
              } else {
                this.$set(this.notices, this.index, info);
              }
            });
          this.showModel = false;
        } else {
          this.$Message.error("请完成表单填写");
        }
      });
    },
    remove(index) {
      this.index = index;
      let info = this.notices[index];
      this.$Modal.confirm({
        title: "删除",
        content: "公告删除后不能恢复，确定要删除吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "notice.delete",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "删除公告错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("删除公告成功");
              this.notices.splice(index, 1);
              if (this.notices.length <= 0) {
                this.pageIndex = this.pageIndex > 2 ? this.pageIndex - 1 : 1;
                this.reload();
              }
            });
        }
      });
    },
    publish(index) {
      this.index = index;
      let info = this.notices[index];
      this.$Modal.confirm({
        title: "发布",
        content: "确定要发布该公告吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "notice.publish",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "发布公告错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("发布公告成功");
              this.notices.splice(index, 1);
              if (this.notices.length <= 0) {
                this.pageIndex = this.pageIndex > 2 ? this.pageIndex - 1 : 1;
                this.reload();
              }
            });
        }
      });
    },
    findResource() {
      this.$Modal.confirm({
        title: "请选择图片资源",
        width: 550,
        scrollable: true,
        okText: "确定",
        render: h => {
          return h(searchMedia, {
            props: {
              fileType: "image"
            },
            on: {
              selected: filename => {
                this.selectFilename = filename;
              }
            }
          });
        },
        onOk: () => {
          this.notice.filename = this.selectFilename;
        }
      });
    }
  }
};
</script>