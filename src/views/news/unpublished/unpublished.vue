<style lang="less" scoped>
@import "./unpublished.less";
</style>
<template>
    <div class="news-unpublished-container">
        <Form ref="findForm" :model="findForm" inline :label-width="80">
            <FormItem label="标题">
                <Input v-model="findForm.title" placeholder="请输入标题关键字" clearable></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="findNewses">查找</Button>
            </FormItem>
        </Form>
        <div class="tools">
          <Button type="primary" @click="create" :disabled="!allowCreate">新建</Button>
        </div>
        <div>
          <Table border :columns="newsColumns" :data="newses"></Table>
        </div>
        <div class="page">
          <Page :total="dataCount" show-elevator @on-change="pageChanged"></Page>
        </div>
        <Modal :mask-closable="false" v-model="showModel" title="资讯信息" width="1000">
          <Form ref="newsForm" :model="news" :label-width="80" :rules="newsRule">
            <FormItem label="标题" prop="title">
              <Input v-model="news.title" placeholder="请输入资讯标题"></Input>
            </FormItem>
            <FormItem label="简介" prop="info">
              <Input v-model="news.info" placeholder="请输入简要说明"></Input>
            </FormItem>
            <FormItem label="标题图片" prop="filename">
              <Input v-model="news.filename" placeholder="请输入标题图片路径" :readonly="true">
                <Button slot="append" icon="ios-search" @click="findResource"></Button>
              </Input>
            </FormItem>
            <FormItem label="资讯内容" prop="content">
              <editor class="editor" :value="news.content"  :setting="editorSetting" @input="(content)=> news.content = content"></editor>
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
      news: {
        content: ""
      },
      newses: [],
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
      newsRule: {
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
        ]
      },
      newsColumns: [
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
    reload() {
      this.$ajax
        .post("/api", {
          method: "news.find",
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
              title: "获取资讯列表错误",
              content: r.data.error
            });
            return;
          }
          this.dataCount = r.data.result.count;
          this.newses = r.data.result.rows;
        });
    },
    pageChanged(page) {
      this.pageIndex = page;
      this.reload();
    },
    findNewses() {
      this.pageIndex = 1;
      this.reload();
    },
    edit(index) {
      this.index = index;
      let info = this.newses[index];
      this.$ajax
        .post("/api", {
          method: "news.fetch",
          token: common.user.token,
          parameter: {
            id: info.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "修改资讯错误",
              content: r.data.error
            });
            return;
          }

          this.news = r.data.result;
          this.showModel = true;
        });
    },
    create() {
      this.$ajax
        .post("/api", {
          method: "news.create",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "新建资讯错误",
              content: r.data.error
            });
            return;
          }

          this.news = r.data.result;
          this.showModel = true;
        });
    },
    save() {
      this.$refs.newsForm.validate(valid => {
        if (valid) {
          this.$ajax
            .post("/api", {
              method: "news.save",
              token: common.user.token,
              parameter: this.news
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "添加资讯错误",
                  content: r.data.error
                });
                return;
              }
              this.news = r.data.result;
              this.showModel = false;
              let info = {
                id: this.news.id,
                title: this.news.title,
                filename: this.news.filename,
                info: this.news.info,
                authorName: this.news.authorName,
                authorTime: this.news.authorTime
              };
              let index = this.newses.findIndex(x => x.id === info.id);
              if (index == -1) {
                this.newses.unshift(info);
              } else {
                this.$set(this.newses, this.index, info);
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
      let info = this.newses[index];
      this.$Modal.confirm({
        title: "删除",
        content: "资讯删除后不能恢复，确定要删除吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "news.delete",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "删除资讯错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("删除资讯成功");
              this.newses.splice(index, 1);
              if (this.newses.length <= 0) {
                this.pageIndex = this.pageIndex > 2 ? this.pageIndex - 1 : 1;
                this.reload();
              }
            });
        }
      });
    },
    publish(index) {
      this.index = index;
      let info = this.newses[index];
      this.$Modal.confirm({
        title: "发布",
        content: "确定要发布该资讯吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "news.publish",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "发布资讯错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("发布资讯成功");
              this.newses.splice(index, 1);
              if (this.newses.length <= 0) {
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
          this.news.filename = this.selectFilename;
        }
      });
    }
  }
};
</script>