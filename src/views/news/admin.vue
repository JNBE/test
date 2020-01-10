<style lang="less">
@import "./admin.less";
</style>
<template>
    <div class="news">
        <Menu theme="dark" :active-name="currentMenu" style="width:220px;float:left;position:absolute;">
            <MenuGroup title="资讯管理">
                <MenuItem name="news-published">
                    <router-link :to="{name:'news-published'}">已发布资讯</router-link> 
                </MenuItem>
                <MenuItem name="news-unpublished">
                    <router-link :to="{name:'news-unpublished'}">未发布资讯</router-link> 
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