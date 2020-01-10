<style lang="less" scoped>
@import "./admin.less";
</style>
<template>
    <div class="setting">
        <Menu theme="dark" :active-name="currentMenu" style="width:220px;float:left;position:absolute;">
            <MenuGroup title="单据管理">
                <MenuItem name="bill-admin">
                    <router-link :to="{name:'bill-admin'}">单据管理</router-link> 
                </MenuItem>
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
        let current = names[2] || "bill";
        this.currentMenu = current;
      }
    }
  }
};
</script>