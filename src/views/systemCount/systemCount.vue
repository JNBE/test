<style lang="less" scoped>
@import "./systemCount.less";
</style>

<template>
    <div class="system-count-container">
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
               <div class="pic onlines">
                   <Tooltip>
                   <i class="iconfont icon-xiaochengxuicon-"></i>
                   <div slot="content">
                    <!-- <p v-for="(item,index) in this.count.onlines.detail" :key="index">{{item.name}}:{{item.count}}</p> -->
                    </div>
                   </Tooltip>
               </div>
               <div class="count">
                   <span class="num">{{this.count.onlines.count || 0}}</span>
                   <span class="des">在线人数</span>
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
        <div id="dateChart" :style="{width: '100%', height: '450px',marginTop:'40px'}" v-if="dateType == 'date'"></div>
        <div id="monthChart" :style="{width: '100%', height: '450px',marginTop:'40px'}" v-if="dateType == 'month'"></div>
         <div id="yearChart" :style="{width: '100%', height: '450px',marginTop:'40px'}" v-if="dateType == 'year'"></div>
    </div>
</template>

<script>
import common from "../../libs/common";
var echarts = require("echarts");
export default {
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
        onlines: {
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
     * 加载系统当日汇总
     */
    loadToday() {
      console.log(this.selectDate);
      this.$ajax
        .post("/api", {
          method: "system.today.total",
          token: common.user.token,
          parameter: {
            time: this.selectDate
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询系统今日汇总信息错误",
              content: r.data.error
            });
            return;
          }
          let today = r.data.result;
          let orders = {
            count: 0,
            detail: []
          };

          let onlines = {
            count: 0,
            detail: []
          };
          let messages = {
            count: 0,
            detail: []
          };
          console.log("加载系统今日汇总（loadToday-today", today);

          orders.count = today.orders;
          orders.count = common.round(orders.count, 2);
          orders.detail.push({ name: this.selectDate, count: today.orders });
          this.count.orders = orders;

          onlines.count = today.onlines;
          onlines.count = common.round(onlines.count, 2);
          onlines.detail.push({ name: this.selectDate, count: today.onlines });
          this.count.onlines = onlines;

          messages.count = today.messages;
          messages.count = common.round(messages.count, 2);
          messages.detail.push({ name: this.selectDate, count: today.messages });
          this.count.messages = messages;
          
        });
    },
    /***
     * 加载系统当月汇总
     */
    loadMonth() {
      console.log(this.selectDate);
      let year = common.dateFromat(this.selectDate, "yyyy");
      let month = common.dateFromat(this.selectDate, "MM");
      this.$ajax
        .post("/api", {
          method: "system.months.total",
          token: common.user.token,
          parameter: {
            year: parseInt(year),
            month: parseInt(month)
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询系统当月汇总信息错误",
              content: r.data.error
            });
            return;
          }
          let month = r.data.result;
          let orders = {
            count: 0,
            detail: []
          };

          let onlines = {
            count: 0,
            detail: []
          };
          let messages = {
            count: 0,
            detail: []
          };
          console.log("加载系统当月汇总（loadToday-month", month);

          orders.count = month.orders;
          orders.count = common.round(orders.count, 2);
          orders.detail.push({ name: this.selectDate, count: month.orders });
          this.count.orders = orders;

          onlines.count = month.onlines;
          onlines.count = common.round(onlines.count, 2);
          onlines.detail.push({ name: this.selectDate, count: month.onlines });
          this.count.onlines = onlines;

          messages.count = month.messages;
          messages.count = common.round(messages.count, 2);
          messages.detail.push({ name: this.selectDate, count: month.messages });
          this.count.messages = messages;
         
        });
    },
    /***
     * 加载系统当年汇总
     */
    loadYear() {
      console.log(this.selectDate);
      let year = common.dateFromat(this.selectDate, "yyyy");
      this.$ajax
        .post("/api", {
          method: "system.years.total",
          token: common.user.token,
          parameter: {
            year: parseInt(year)
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询系统当年汇总信息错误",
              content: r.data.error
            });
            return;
          }
          let year = r.data.result;
          let orders = {
            count: 0,
            detail: []
          };

          let onlines = {
            count: 0,
            detail: []
          };
          let messages = {
            count: 0,
            detail: []
          };
          console.log("加载系统今年汇总（loadToday-year", year);

          orders.count = year.orders;
          orders.count = common.round(orders.count, 2);
          orders.detail.push({ name: this.selectDate, count: year.orders });
          this.count.orders = orders;

          onlines.count = year.onlines;
          onlines.count = common.round(onlines.count, 2);
          onlines.detail.push({ name: this.selectDate, count: year.onlines });
          this.count.onlines = onlines;

          messages.count = year.messages;
          messages.count = common.round(messages.count, 2);
          messages.detail.push({ name: this.selectDate, count: year.messages });
          this.count.messages = messages;
        });
    },
    /**
     * 加载系统近30天汇总
     */
    loadDays() {
      this.$ajax
        .post("/api", {
          method: "system.days.total",
          token: common.user.token,
          parameter: {
            time: this.selectDate
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询系统近30日汇总信息错误",
              content: r.data.error
            });
            return;
          }
          console.log("加载系统近30日汇总（loadDays）", r.data.result);

          this.days.day = [];
          this.days.series = [];

          let timeSet = new Set();
          for (const row of r.data.result) {
            timeSet.add(common.dateFromat(new Date(row.time), "MM-dd"));
          }

          this.days.day = Array.from(timeSet);
          this.days.titles = ["接单数", "在线人数", "消息数"];

          let orders = {
            name: "接单数",
            type: "line",
            smooth: true,
            data: []
          };
          let onlines = {
            name: "在线人数",
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
              item.onlines = row.onlines;
              item.messages = row.messages;
            }
          }
          everyDay.forEach((value, key, map) => {
            orders.data.push(value.orders);
            onlines.data.push(value.onlines);
            messages.data.push(value.messages);
          });

          this.days.series.push(orders);
          this.days.series.push(onlines);
          this.days.series.push(messages);

          this.drawDayLines();
        });
    },
    /**
     * 加载系统近12个月汇总
     */
    loadMonths() {
      this.$ajax
        .post("/api", {
          method: "system.monthly.total",
          token: common.user.token,
          parameter: {
            time: this.selectDate
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询系统近12个月汇总信息错误",
              content: r.data.error
            });
            return;
          }
          console.log("加载系统近12个月汇总（loadMonths）", r.data.result);

          this.months.month = [];
          this.months.series = [];

          let timeSet = new Set();
          for (const row of r.data.result) {
            timeSet.add(row.month);
          }

          this.months.month = Array.from(timeSet);
          this.months.titles = ["接单数", "在线人数", "消息数"];

          let orders = {
            name: "接单数",
            type: "line",
            smooth: true,
            data: []
          };
          let onlines = {
            name: "在线人数",
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
              item.onlines = row.onlines;
              item.messages = row.messages;
            }
          }
          everyMonth.forEach((value, key, map) => {
            orders.data.push(value.orders);
            onlines.data.push(value.onlines);
            messages.data.push(value.messages);
          });

          this.months.series.push(orders);
          this.months.series.push(onlines);
          this.months.series.push(messages);

          this.drawMonthLines();
        });
    },
    /**
     * 加载系统近2年汇总
     */
    loadYears() {
      let year = common.dateFromat(this.selectDate, "yyyy");
      let month = common.dateFromat(this.selectDate, "MM");
      this.$ajax
        .post("/api", {
          method: "system.yearly.total",
          token: common.user.token,
          parameter: {
            year: year,
            month: month
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "查询系统近2年汇总信息错误",
              content: r.data.error
            });
            return;
          }
          console.log("加载系统近2年汇总（loadYears）", r.data.result);

          this.years.year = [];
          this.years.series = [];

          let timeSet = new Set();
          for (const row of r.data.result) {
            timeSet.add(row.year);
          }

          this.years.year = Array.from(timeSet);
          this.years.titles = ["接单数", "在线人数", "消息数"];

          let orders = {
            name: "接单数",
            type: "line",
            smooth: true,
            data: []
          };
          let onlines = {
            name: "在线人数",
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
              item.onlines = row.onlines;
              item.messages = row.messages;
            }
          }
          everyYear.forEach((value, key, map) => {
            orders.data.push(value.orders);
            onlines.data.push(value.onlines);
            messages.data.push(value.messages);
          });

          this.years.series.push(orders);
          this.years.series.push(onlines);
          this.years.series.push(messages);

          this.drawYearLines();
        });
    },

    drawDayLines() {
      let dateChart = echarts.init(document.getElementById("dateChart"));
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
      let monthChart = echarts.init(document.getElementById("monthChart"));
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
      let yearChart = echarts.init(document.getElementById("yearChart"));
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


