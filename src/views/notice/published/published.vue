<style lang="less" scoped>
@import "./published.less";
</style>
<template>
    <div class="notice-published-container">
        <Form ref="findForm" :model="findForm" inline :label-width="80">
            <FormItem label="标题">
                <Input v-model="findForm.title" placeholder="请输入标题关键字" clearable></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="findNotices">查找</Button>
            </FormItem>
        </Form>
        <div>
          <Table border :columns="noticeColumns" :data="notices"></Table>
        </div>
        <div class="page">
          <Page :total="dataCount" show-elevator @on-change="pageChanged"></Page>
        </div>
        <Modal v-model="showModel" title="公告信息" width="1000">
          <Form ref="noticeForm" :model="notice" :label-width="80">
            <FormItem label="标题" prop="title">
              <Input v-model="notice.title" placeholder="" readonly></Input>
            </FormItem>
            <FormItem label="简介" prop="info">
              <Input v-model="notice.info" placeholder="" readonly></Input>
            </FormItem>
            <FormItem label="标题图片" prop="filename">
              <Input v-model="notice.filename" placeholder="" readonly></Input>
            </FormItem>
            <FormItem label="开始日期" prop="startTime">
                <DatePicker type="date" placeholder="开始日期" style="width: 200px" v-model="notice.startTime" :readonly="true"></DatePicker>
            </FormItem>
            <FormItem label="结束日期" prop="endTime">
                <DatePicker type="date" placeholder="结束日期" style="width: 200px" v-model="notice.endTime" :readonly="true"></DatePicker>
            </FormItem>
            <FormItem label="公告内容" prop="content">
              <editor class="editor" :value="notice.content"  :setting="editorSetting" @input="(content)=> notice.content = content" :readonly="true"></editor>
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
      notices: [],
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
      notice: {
        content: ""
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
          method: "notice.find",
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
    revoke(index) {
      this.index = index;
      let info = this.notices[index];
      this.$Modal.confirm({
        title: "撤回",
        content: "确定要撤回该公告吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "notice.revoke",
              token: common.user.token,
              parameter: { id: info.id }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Modal.error({
                  title: "撤回公告错误",
                  content: r.data.error
                });
                return;
              }
              this.$Message.success("撤回公告成功");
              this.notices.splice(index, 1);
              if (this.notices.length <= 0) {
                this.pageIndex = this.pageIndex > 2 ? this.pageIndex - 1 : 1;
                this.findNotices();
              }
            });
        }
      });
    },
    view(index) {
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
              title: "查看公告错误",
              content: r.data.error
            });
            return;
          }

          this.notice = r.data.result;
          this.showModel = true;
        });
    }
  }
};
</script>