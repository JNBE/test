<style lang="less">
@import "./admin.less";
</style>
<template>
    <div class="notice">
        <Menu theme="dark" :active-name="currentMenu" style="width:220px;float:left;position:absolute;">
            <MenuGroup title="公告管理">
                <MenuItem name="notice-published">
                    <router-link :to="{name:'notice-published'}">已发布公告</router-link> 
                </MenuItem>
                <MenuItem name="notice-unpublished">
                    <router-link :to="{name:'notice-unpublished'}">未发布公告</router-link> 
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
        let current = names[2] || "category";
        this.currentMenu = current;
      }
    }
  }
};
</script>