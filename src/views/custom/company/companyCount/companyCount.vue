<style lang="less" scoped>
@import "./companyCount.less";
</style>
<template>
    <div class="company-count-container">

        <div class="title">企业统计</div>
        <div class="data">
            <div class="data-datePicker">
                <DatePicker :type='dateType' :options="options" @on-change='showDate' confirm placeholder="请选择日期" style="width: 200px"></DatePicker>
            </div>
            <div class="data-content">
                <div class="pic orders">
                    <Tooltip>
                      <i class="iconfont icon-script"></i>
                      <div slot="content">
                      <!-- <p v-for="(item,index) in this.count.orders.detail" :key="index">{{item.name}}:{{item.count}}</p> -->
                      </div>
                    </Tooltip>
                </div>
                <div class="count">
                    <span class="num">{{this.count.orders.count || 0}}</span>
                    <span class="des">接单数</span>
                </div>
            </div>
            <div class="data-content">
               <div class="pic logins">
                  <Tooltip>
                    <i class="iconfont icon-xiaochengxuicon-"></i>
                    <div slot="content">
                    <!-- <p v-for="(item,index) in this.count.logins.detail" :key="index">{{item.name}}:{{item.count}}</p> -->
                    </div>
                  </Tooltip>
               </div>
               <div class="count">
                   <span class="num">{{this.count.logins.count}}</span>
                   <span class="des">登录次数</span>
               </div>
            </div>
            <div class="data-content">
              <div class="pic messages">
                  <Tooltip>
                    <i class="iconfont icon-xiaoxi"></i>
                    <div slot="content">
                      <!-- <p v-for="(item,index) in this.count.messages.detail" :key="index">{{item.name}}:{{item.count}}</p> -->
                    </div>
                  </Tooltip>
              </div>
              <div class="count">
                  <span class="num">{{this.count.messages.count || 0}}</span>
                  <span class="des">消息数</span>
              </div>
            </div>
        
        </div>
            
        <div :id="dateChartId" :style="{width: '100%', height: '450px',marginTop:'40px'}" v-if="dateType == 'date'"></div>
        <div :id="monthChartId" :style="{width: '100%', height: '450px',marginTop:'40px'}" v-if="dateType == 'month'"></div>
        <div :id="yearChartId" :style="{width: '100%', height: '450px',marginTop:'40px'}" v-if="dateType == 'year'"></div>

    </div>
</template>

<script>
import common from "../../../../libs/common";
var echarts = require("echarts");
export default {
  props: {
    row: Object
  },
  computed: {
    dateChartId(){
      return this.row.id + 'dateChart'
    },
    monthChartId(){
       return this.row.id + 'monthChart'
    },
    yearChartId(){
       return this.row.id + 'yearChart'
    }
  },
  data() {
    return {
      dateType: "date",
      selectDate: new Date(),
      options: {
        shortcuts: [
          {
            text: "日统计",
            onClick: picker => {
              this.dateType = "date";
            }
          },
          {
            text: "月统计",
            onClick: picker => {
              this.dateType = "month";
            }
          },
          {
            text: "年统计",
            onClick: picker => {
              this.dateType = "year";
            }
          }
        ]
      },
      count: {
        orders: {
          count: 0,
          detail: []
        },
        logins: {
          count: 0,
          detail: []
        },
        messages: {
          count: 0,
          detail: []
        }
      },
      days: {},
      months: {},
      years: {}
    };
  },
  mounted() {
    this.loadToday();
    this.loadDays();
  },
  methods: {
    showDate: function(date) {
      if (!date) date = new Date();
      this.selectDate = new Date(date);
      if (this.dateType == "date") {
        this.loadToday();
        this.loadDays();
      } else if (this.dateType == "month") {
        this.loadMonth();
        this.loadMonths();
      } else if (this.dateType == "year") {
        this.loadYear();
        this.loadYears();
      }
    },
    /***
     * 加载当日汇总
     */
    loadToday() {
      //console.log('this.row: ',this.row)
      //console.log("loadToday--this.selectDate", this.selectDate);
      this.$ajax
        .post("/api", {
          method: "company.today.total",
          token: common.user.token,
          parameter: {
            time: this.selectDate,
            companyId: this.row.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询企业今日汇总信息错误",
              content: r.data.error
            });
            return;
          }
          let today = r.data.result;
          let orders = {
            count: 0,
            detail: []
          };

          let logins = {
            count: 0,
            detail: []
          };
          let messages = {
            count: 0,
            detail: []
          };
          console.log("加载企业今日汇总（loadToday-today", today);

          orders.count = today.orders;
          orders.count = common.round(orders.count, 2);
          orders.detail.push({ name: today.id, count: today.orders });
          this.count.orders = orders;

          logins.count = today.logins;
          logins.count = common.round(logins.count, 2);
          logins.detail.push({ name: today.id, count: today.logins });
          this.count.logins = logins;

          messages.count = today.messages;
          messages.count = common.round(messages.count, 2);
          messages.detail.push({ name: today.id, count: today.messages });
          this.count.messages = messages;
        });
    },
    /***
     * 加载当月汇总
     */
    loadMonth() {
      let year = common.dateFromat(this.selectDate, "yyyy");
      let month = common.dateFromat(this.selectDate, "MM");
      this.$ajax
        .post("/api", {
          method: "company.months.total",
          token: common.user.token,
          parameter: {
            year: parseInt(year),
            month: parseInt(month),
            companyId: this.row.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询企业当月汇总信息错误",
              content: r.data.error
            });
            return;
          }
          let month = r.data.result;
          let orders = {
            count: 0,
            detail: []
          };

          let logins = {
            count: 0,
            detail: []
          };
          let messages = {
            count: 0,
            detail: []
          };
          console.log("加载企业当月汇总（loadToday-month", month);

          orders.count = month.orders;
          orders.count = common.round(orders.count, 2);
          orders.detail.push({ name: month.id, count: month.orders });
          this.count.orders = orders;

          logins.count = month.logins;
          logins.count = common.round(logins.count, 2);
          logins.detail.push({ name: month.id, count: month.logins });
          this.count.logins = logins;

          messages.count = month.messages;
          messages.count = common.round(messages.count, 2);
          messages.detail.push({ name: month.id, count: month.messages });
          this.count.messages = messages;
        });
    },
    /***
     * 加载当年汇总
     */
    loadYear() {
      //console.log(this.selectDate);
      let year = common.dateFromat(this.selectDate, "yyyy");
      let month = common.dateFromat(this.selectDate, "MM");
      this.$ajax
        .post("/api", {
          method: "company.years.total",
          token: common.user.token,
          parameter: {
            year: parseInt(year),
            month: parseInt(month),
            companyId: this.row.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询企业当年汇总信息错误",
              content: r.data.error
            });
            return;
          }
          let year = r.data.result;
          let orders = {
            count: 0,
            detail: []
          };

          let logins = {
            count: 0,
            detail: []
          };
          let messages = {
            count: 0,
            detail: []
          };
          console.log("加载企业当年汇总（loadYear-year", year);

          orders.count = year.orders;
          orders.count = common.round(orders.count, 2);
          orders.detail.push({ name: year.id, count: year.orders });
          this.count.orders = orders;

          logins.count = year.logins;
          logins.count = common.round(logins.count, 2);
          logins.detail.push({ name: year.id, count: year.logins });
          this.count.logins = logins;

          messages.count = year.messages;
          messages.count = common.round(messages.count, 2);
          messages.detail.push({ name: year.id, count: year.messages });
          this.count.messages = messages;
        });
    },
    /**
     * 加载企业近30天汇总
     */
    loadDays() {
      this.$ajax
        .post("/api", {
          method: "company.days.total",
          token: common.user.token,
          parameter: {
            time: this.selectDate,
            companyId: this.row.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询企业近30日汇总信息错误",
              content: r.data.error
            });
            return;
          }
          console.log("加载企业近30日汇总（loadDays）", r.data.result);

          this.days.day = [];
          this.days.series = [];

          let timeSet = new Set();
          for (const row of r.data.result) {
            timeSet.add(common.dateFromat(new Date(row.time), "MM-dd"));
          }

          this.days.day = Array.from(timeSet);
          this.days.titles = ["接单数", "登录次数", "消息数"];

          let orders = {
            name: "接单数",
            type: "line",
            smooth: true,
            data: []
          };
          let logins = {
            name: "登录次数",
            type: "line",
            smooth: true,
            data: []
          };
          let messages = {
            name: "消息数",
            type: "line",
            smooth: true,
            data: []
          };

          let everyDay = new Map();
          for (const row of r.data.result) {
            let item = everyDay.get(row.time);
            if (!item) {
              everyDay.set(row.time, row);
            } else {
              item.orders = row.orders;
              item.logins = row.logins;
              item.messages = row.messages;
            }
          }
          everyDay.forEach((value, key, map) => {
            orders.data.push(value.orders);
            logins.data.push(value.logins);
            messages.data.push(value.messages);
          });

          this.days.series.push(orders);
          this.days.series.push(logins);
          this.days.series.push(messages);

          this.drawDayLines();
        });
    },
    /**
     * 加载近12个月汇总
     */
    loadMonths() {
      this.$ajax
        .post("/api", {
          method: "company.monthly.total",
          token: common.user.token,
          parameter: {
            time: this.selectDate,
            companyId: this.row.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询企业近12个月汇总信息错误",
              content: r.data.error
            });
            return;
          }
          console.log("加载企业近12个月汇总（loadMonths）", r.data.result);

          this.months.month = [];
          this.months.series = [];

          let timeSet = new Set();
          for (const row of r.data.result) {
            timeSet.add(row.month);
          }

          this.months.month = Array.from(timeSet);
          this.months.titles = ["接单数", "登录次数", "消息数"];

          let orders = {
            name: "接单数",
            type: "line",
            smooth: true,
            data: []
          };
          let logins = {
            name: "登录次数",
            type: "line",
            smooth: true,
            data: []
          };
          let messages = {
            name: "消息数",
            type: "line",
            smooth: true,
            data: []
          };
          let everyMonth = new Map();
          for (const row of r.data.result) {
            let item = everyMonth.get(row.month);
            if (!item) {
              everyMonth.set(row.month, row);
            } else {
              item.orders = row.orders;
              item.logins = row.logins;
              item.messages = row.messages;
            }
          }
          everyMonth.forEach((value, key, map) => {
            orders.data.push(value.orders);
            logins.data.push(value.logins);
            messages.data.push(value.messages);
          });

          this.months.series.push(orders);
          this.months.series.push(logins);
          this.months.series.push(messages);

          this.drawMonthLines();
        });
    },
    /**
     * 加载近2年汇总
     */
    loadYears() {
      let year = common.dateFromat(this.selectDate, "yyyy");
      let month = common.dateFromat(this.selectDate, "MM");
      this.$ajax
        .post("/api", {
          method: "company.yearly.total",
          token: common.user.token,
          parameter: {
            year: parseInt(year),
            month: parseInt(month),
            companyId: this.row.id
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询企业近2年汇总信息错误",
              content: r.data.error
            });
            return;
          }
          console.log("加载企业近2年汇总（loadYears）", r.data.result);

          this.years.year = [];
          this.years.series = [];

          let timeSet = new Set();
          for (const row of r.data.result) {
            timeSet.add(row.year);
          }

          this.years.year = Array.from(timeSet);
          this.years.titles = ["接单数", "登录次数", "消息数"];

          let orders = {
            name: "接单数",
            type: "line",
            smooth: true,
            data: []
          };
          let logins = {
            name: "登录次数",
            type: "line",
            smooth: true,
            data: []
          };
          let messages = {
            name: "消息数",
            type: "line",
            smooth: true,
            data: []
          };
          let everyYear = new Map();
          for (const row of r.data.result) {
            let item = everyYear.get(row.year);
            if (!item) {
              everyYear.set(row.year, row);
            } else {
              item.orders = row.orders;
              item.logins = row.logins;
              item.messages = row.messages;
            }
          }
          everyYear.forEach((value, key, map) => {
            orders.data.push(value.orders);
            logins.data.push(value.logins);
            messages.data.push(value.messages);
          });

          this.years.series.push(orders);
          this.years.series.push(logins);
          this.years.series.push(messages);

          console.log(
            "加载近2年汇总（loadYears-this.years.day",
            this.years.year
          );
          console.log(
            "加载近2年汇总（loadYears-this.years.titles",
            this.years.titles
          );
          console.log(
            "加载近2年汇总（loadYears-this.years.series）",
            this.years.series
          );
          this.drawYearLines();
        });
    },

    drawDayLines() {
      let dateChart = echarts.init(document.getElementById(this.dateChartId));
      // 绘制图表
      dateChart.setOption({
        title: { text: "日汇总" },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.days.titles
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          data: this.days.day
        },
        yAxis: {
          name: "数量",
          type: "value"
        },
        series: this.days.series
      });
    },
    drawMonthLines() {
      let monthChart = echarts.init(document.getElementById(this.monthChartId));
      monthChart.setOption({
        title: { text: "月汇总" },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.months.titles
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          name: "月份",
          type: "category",
          boundaryGap: false,
          data: this.months.month
        },
        yAxis: {
          name: "数量",
          type: "value"
        },
        series: this.months.series
      });
    },
    drawYearLines() {
      let yearChart = echarts.init(document.getElementById(this.yearChartId));
      yearChart.setOption({
        title: { text: "年汇总" },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.years.titles
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          name: "年份",
          type: "category",
          boundaryGap: false,
          data: this.years.year
        },
        yAxis: {
          name: "数量",
          type: "value"
        },
        series: this.years.series
      });
    }
  }
};
</script>


