<style lang="less" scoped>
@import "./score.less";
</style>

<template>
  <div class="score">
    <div class="title">积分兑换</div>

    <Alert show-icon banner >
      <span>推广员列表选择：区域节点选择主管，小组节点选择组长；</span>
      <span>选择节点后，兑换人、职位等内容为空时，表示未设置主管或组长</span>
    </Alert>
    
    <div style="display: flex;flex-direction: row; padding: 5px;">
      <Card>
        <p slot="title">推广员列表</p>
        <Tree ref="promoterTree" :data="promoterTree" @on-select-change="selectPromoterChange"></Tree>
      </Card>

      <Card>
        <div
          style="display: flex;flex-direction: row; justify-content:space-between; padding: 10px;"
        >
          <div style="display: flex;flex-direction: column; width: 150px;">
            <div slot="title">兑换人：{{tooker.name || ''}}</div>
            <div slot="title">职位：{{tooker.role || ''}}</div>
          </div>
          <div slot="title">
            <RadioGroup v-model="search.state" @on-change="onStateChange">
              <Radio :label="stateAll">
                <span>总积分（{{tooker.royalty || 0}}）</span>
              </Radio>
              <Radio :label="stateTook">
                <span>已兑换（{{tooker.took || 0}}）</span>
              </Radio>
              <Radio :label="stateNew">
                <span>未兑换（{{tooker.residual || 0}}）</span>
              </Radio>
            </RadioGroup>
          </div>
          <div slot="title">
            <DatePicker
              type="datetime"
              @on-change="selectStartDate"
              confirm
              placeholder="请选择起始日期"
              style="width: 180px"
            ></DatePicker>
            <DatePicker
              type="datetime"
              @on-change="selectEndDate"
              confirm
              placeholder="请选择截止日期"
              style="width: 180px"
            ></DatePicker>
          </div>
          <div slot="title" style="margin-left: 30px;">
            <Button type="success" :disabled="tookDisable" @click="took">兑换({{sumTook}})</Button>
          </div>
        </div>

        <div style="text-align:center">
          <Table height="400" border :columns="royaltyColumns" :data="royaltyList"></Table>
          <div class="page">
            <Page
              :total="dataCount"
              :page-size="pageSize"
              show-elevator
              @on-change="onRoyaltyPageChanged"
            ></Page>
          </div>
        </div>
      </Card>
    </div>

    <Modal v-model="showRoyaltyDetailModal" title="积分明细" width="610" scrollable>
      <div style="height:150px; overflow:auto; padding:5px;">
        <Form
          ref="royaltyDetailForm"
          :model="royaltyDetail"
          :label-width="70"
          label-position="left"
        >
          <Row>
            <Col span="11">
              <InputBox label="兑换人" :plain="true">
                <span>{{royaltyDetail.name}}</span>
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="角色" :plain="true">
                <span>{{royaltyDetail.role}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="11">
              <InputBox label="积分数值" :plain="true">
                <span>{{royaltyDetail.score}}</span>
              </InputBox>
            </Col>
            <Col span="11" :offset="2">
              <InputBox label="积分状态" :plain="true">
                <span>{{royaltyDetail.state}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="积分时间" :plain="true">
                <span>{{royaltyDetail.time}}</span>
              </InputBox>
            </Col>
          </Row>

          <Row>
            <Col span="24">
              <InputBox label="积分摘要" :plain="true">
                <span>{{royaltyDetail.summary}}</span>
              </InputBox>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import common from "../../../libs/common";
import InputBox from "../../components/inputbox";
export default {
  components: {
    InputBox
  },
  data() {
    return {
      dataCount: 0,
      pageIndex: 1,
      pageSize: 10,
      stateAll: "all",
      stateTook: "took",
      stateNew: "new",
      search: {
        tookId: "",
        state: "all",
        startDate: "",
        endDate: ""
      },
      branchList: [],
      groupList: [],
      promoterList: [],
      promoterTree: [],

      tookDisable: true,
      royaltyColumns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          align: "center",
          title: "提成积分",
          key: "score"
        },
        {
          align: "center",
          title: "积分时间",
          key: "createTime",
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
          title: "积分状态",
          key: "state",
          render: (h, params) => {
            return h("div", [
              h("span", common.royaltyState[params.row.state].name)
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
                    disabled: !this.allowRole
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.detail(params.index);
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
      ],
      royaltyList: [],
      sumTook: 0,
      tooker: {},
      showRoyaltyDetailModal: false,
      royaltyDetail: {}
    };
  },
  computed: {
    allowRole() {
      return common.user.hasRoles([
        common.roleKind.admin,
        common.roleKind.backstager
      ]);
    }
  },
  mounted() {
    this.loadBranch();
  },
  methods: {
    selectPromoterChange(list) {
      console.log("selectPromoterChange: ", list);
      if (list.length == 0) this.search.tookId = null;
      else this.search.tookId = list[0].tookId;
      this.loadRoyalty();
      this.fetchTooker();
      this.loadSumTook();
    },
    onStateChange(state) {
      //console.log("stateChanged: ", state);
      this.tookDisable = state != this.stateNew;
      this.search.state = state;
      this.loadRoyalty();
      this.loadSumTook();
    },
    selectStartDate(e) {
      //console.log("selectStartDate: ", e);
      this.search.startDate = e;
      this.loadRoyalty();
    },
    selectEndDate(e) {
      //console.log("selectEndDate: ", e);
      this.search.endDate = e;
      this.loadRoyalty();
    },
    loadBranch() {
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
          console.log("loadBranch: ", r);
          this.branchList = r.data.result;
          this.loadGroup();
        });
    },
    loadGroup() {
      this.$ajax
        .post("/api", {
          method: "promoter.group.browse",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          console.log("loadGroup: ", r);
          this.groupList = r.data.result;
          this.loadPromoter();
        });
    },
    loadPromoter() {
      this.$ajax
        .post("/api", {
          method: "promoter.browse",
          token: common.user.token,
          parameter: null
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          console.log("loadPromoter: ", r);
          this.promoterList = r.data.result;
          this.loadTree();
        });
    },
    loadTree() {
      let list = [];
      let branchList = this.branchList;
      let groupList = this.groupList;
      let promoterList = this.promoterList;

      function makeBranchChildren(branch) {
        branch.children = [];
        for (const group of groupList) {
          if (group.branchId === branch.id) {
            group.tookId = group.leaderId;
            // group.tookName = group.leaderName;
            // group.tookRole = "组长";
            group.title = group.name;
            let index = branch.children.findIndex(
              o => o.branchId === group.branchId && o.id === group.id
            );
            if (index == -1) {
              branch.children.push(group);
              makeGroupChildren(group);
            }
          }
        }
        //console.log('makeBranchChildren: ',branch.children)
      }

      function makeGroupChildren(group) {
        group.children = [];
        for (const promoter of promoterList) {
          if (group.id === promoter.groupId) {
            promoter.tookId = promoter.id;
            // promoter.tookName = promoter.name;
            // promoter.tookRole = "推广员";
            promoter.title = promoter.name;
            let index = group.children.findIndex(
              o => o.id === promoter.id
            );
            if (index == -1) {
              group.children.push(promoter);
            }
          }
        }
        //console.log('makeGroupChildren: ',group.children)
      }

      for (let branch of branchList) {
        branch.tookId = branch.adminId;
        // branch.tookName = branch.adminName;
        // branch.tookRole = "主管";
        branch.title = branch.name;
        list.push(branch);
        makeBranchChildren(branch);
      }
      this.promoterTree = list;
    },

    fetchTooker() {
      if (!this.search.tookId) {
        this.tooker = {};
        return;
      }
      this.$ajax
        .post("/api", {
          method: "promoter.fetch",
          token: common.user.token,
          parameter: {
            id: this.search.tookId
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          console.log("fetchTooker: ", r);
          let tooker = r.data.result;
          tooker.role = common.roleKind.parse(tooker.role);
          this.tooker = tooker;
        });
    },

    onRoyaltyPageChanged(page) {
      this.pageIndex = page;
      this.loadRoyalty();
    },
    loadRoyalty() {
      //console.log("loadRoyalty: ", this.search);
      if (!this.search.tookId) {
        this.dataCount = 0;
        this.royaltyList = [];
        return;
      }
      this.$ajax
        .post("/api", {
          method: "promoter.royalty.overview",
          token: common.user.token,
          parameter: {
            page: this.pageIndex,
            size: this.pageSize,
            id: this.search.tookId,
            state: this.search.state,
            startDate: this.search.startDate,
            endDate: this.search.endDate
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          console.log("loadRoyalty: ", r);
          this.dataCount = r.data.result.count;
          this.royaltyList = r.data.result.rows || [];
        });
    },

    loadSumTook() {
      if (this.search.state != "new") {
        this.sumTook = 0;
        return;
      }
      this.$ajax
        .post("/api", {
          method: "promoter.royalty.took.sum",
          token: common.user.token,
          parameter: {
            promoterId: this.search.tookId,
            startDate: this.search.startDate,
            endDate: this.search.endDate
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Message.error(r.data.error);
            return;
          }
          console.log("loadRoyalty: ", r);
          this.sumTook = r.data.result.count;
        });
    },

    took() {
      if (!this.search.tookId) {
        this.$Message.error("未选择兑换人！");
        return;
      }
      this.$Modal.confirm({
        title: "兑换积分",
        content:
          "确定要兑换" +
          this.tooker.name +
          "的（" +
          this.sumTook +
          "）积分吗？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$ajax
            .post("/api", {
              method: "promoter.royalty.took",
              token: common.user.token,
              parameter: {
                promoterId: this.search.tookId,
                startDate: this.search.startDate,
                endDate: this.search.endDate
              }
            })
            .then(r => {
              if (r.data.code !== 0) {
                this.$Message.error(r.data.error);
                return;
              }
              console.log("兑换积分（took): ", r);
              this.fetchTooker();
              this.loadRoyalty();
              this.$Message.success("兑换积分成功");
            });
        }
      });
    },

    detail(index) {
      this.index = index;
      let info = this.royaltyList[index];
      this.$ajax
        .post("/api", {
          method: "promoter.royalty.detail",
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
          console.log("加载积分详情（detail): ", r);
          let royaltyDetail = r.data.result;
          royaltyDetail.role = common.roleKind.parse(royaltyDetail.role);
          royaltyDetail.state = common.royaltyState[royaltyDetail.state].name;
          royaltyDetail.time = common.dateFromat(
            new Date(royaltyDetail.time),
            "yyyy-MM-dd hh:mm:ss"
          );
          this.royaltyDetail = royaltyDetail;
          this.showRoyaltyDetailModal = true;
        });
    }
  }
};
</script>