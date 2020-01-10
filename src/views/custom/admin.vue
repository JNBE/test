<style lang="less">
@import "./admin.less";
</style>

<template>
  <div class="custom">
    <Menu
      theme="dark"
      :active-name="currentMenu"
      style="width:220px;float:left;position:absolute;flex:1"
    >
      <MenuGroup title="客户管理">
        <MenuItem name="member-admin">
          <router-link :to="{name:'member-admin'}">会员管理</router-link>
        </MenuItem>
        <MenuItem name="vehicle-admin">
          <router-link :to="{name:'vehicle-admin'}">车辆管理</router-link>
        </MenuItem>
        <MenuItem name="company-admin">
          <router-link :to="{name:'company-admin'}">企业管理</router-link>
        </MenuItem>

        <Submenu name="promoter-group">
          <template slot="title">推广管理</template>
          <MenuItem name="client-admin">
            <router-link :to="{name:'client-admin'}">客户审核</router-link>
          </MenuItem>
          <MenuItem name="score">
            <router-link :to="{name:'score-admin'}">积分结算</router-link>
          </MenuItem>
        </Submenu>
      </MenuGroup>
    </Menu>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMenu: null
    };
  },
  mounted() {
    this.resetActiveMenu();
  },
  methods: {
    resetActiveMenu() {
      if (!this.currentMenu) {
        let names = JSON.parse(sessionStorage.getItem("routers"));
        let current = names[2] || "member-admin";
        this.currentMenu = current;
      }
    }
  }
};
</script>
