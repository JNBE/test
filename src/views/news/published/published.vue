<style lang="less" scoped>
@import "./published.less";
</style>
<template>
    <div class="news-published-container">
        <Form ref="findForm" :model="findForm" inline :label-width="80">
            <FormItem label="标题">
                <Input v-model="findForm.title" placeholder="请输入标题关键字" clearable></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="findNewses">查找</Button>
            </FormItem>
        </Form>
        <div>
          <Table border :columns="newsColumns" :data="newses"></Table>
        </div>
        <div class="page">
          <Page :total="dataCount" show-elevator @on-change="pageChanged"></Page>
        </div>
        <Modal v-model="showModel" title="资讯信息" width="1000">
          <Form ref="newsForm" :model="news" :label-width="80">
            <FormItem label="标题" prop="title">
              <Input v-model="news.title" placeholder="" readonly></Input>
            </FormItem>
            <FormItem label="简介" prop="info">
              <Input v-model="news.info" placeholder="" readonly></Input>
            </FormItem>
            <FormItem label="标题图片" prop="filename">
              <Input v-model="news.filename" placeholder="" readonly>
              </Input>
            </FormItem>
            <FormItem label="新闻内容" prop="content">
              <editor class="editor" :value="news.content"  :setting="editorSetting" @input="(content)=> news.content = content" :readonly="true"></editor>
            </FormItem>
          </Form>
        </Modal>
    </div>
</template>

<script>
import common from "../../../libs/common";
import editor from "../../components/editor";
export default {
  components: {
    editor
  },
  data() {
    return {
      newses: [],
      dataCount: 0,
      pageIndex: 1,
      pageSize: 10,
      showModel: false,
      editorSetting: {
        height: 300
      },
      findForm: {
        title: ""
      },
      news: {
        content: ""
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
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.view(params.index);
                    }
                  }
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    disabled: !this.allowRevoke
                  },
                  on: {
                    click: () => {
                      this.revoke(params.index);
                    }
                  }
                },
                "撤回"
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    allowRevoke() {
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
            state: common.articleState.published
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
    revoke(index) {
      this.index = index;
      let info = this.newses[index];
      this.$Modal.confirm({
        title: "撤回",
        content: "确定要撤回该资讯吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "news.revoke",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "撤回资讯错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("撤回资讯成功");
              this.newses.splice(index, 1);
              if (this.newses.length <= 0) {
                this.pageIndex = this.pageIndex > 2 ? this.pageIndex - 1 : 1;
                this.findNewses();
              }
            });
        }
      });
    },
    view(index) {
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
              title: "查看资讯错误",
              content: r.data.error
            });
            return;
          }

          this.news = r.data.result;
          this.showModel = true;
        });
    }
  }
};
</script>