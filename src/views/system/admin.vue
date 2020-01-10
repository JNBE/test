<style lang="less" scoped>
@import "./admin.less";
</style>
<template>
    <div class="setting">
        <Menu theme="dark" :active-name="currentMenu" style="width:220px;float:left;position:absolute;">
            <MenuGroup title="系统设置">
                <MenuItem name="user-admin">
                    <router-link :to="{name:'user-admin'}">后台用户管理</router-link> 
                </MenuItem>
                <MenuItem name="message-admin">
                    <router-link :to="{name:'message-admin'}">大众消息管理</router-link> 
                </MenuItem>
                <MenuItem name="media">
                    <router-link :to="{name:'media-admin'}">多媒体上传</router-link> 
                </MenuItem>
                <MenuItem name="advert">
                    <router-link :to="{name:'advert-admin'}">轮播广告上传</router-link> 
                </MenuItem>
                <MenuItem name="guide">
                    <router-link :to="{name:'guide-admin'}">注册引导页</router-link> 
                </MenuItem>
                <MenuItem name="mould">
                    <router-link :to="{name:'mould-admin'}">图片模板上传</router-link> 
                </MenuItem>
                <MenuItem name="product">
                    <router-link :to="{name:'product-admin'}">服务产品管理</router-link> 
                </MenuItem>
                <Submenu name="market-group">
                     <template slot="title">
                        市场与销售
                    </template>
                    <MenuItem name="market">
                        <router-link :to="{name:'market-admin'}">销售区域设置</router-link> 
                    </MenuItem>
                    <MenuItem name="royalty">
                        <router-link :to="{name:'royalty-admin'}">业务提成设置</router-link> 
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
        let current = names[2] || "user";
        this.currentMenu = current;
      }
    }
  }
};
</script>