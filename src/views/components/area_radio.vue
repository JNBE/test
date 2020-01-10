<style scoped>
.item-box {
  border: 1px solid #ccc;
  padding: 2px;
  border-radius: 3px;
}
.ivu-form-item-error .item-box {
  border: 1px solid #ed4014;
  border-radius: 3px;
}
</style>
<template>
  <div>
    <div class="item-box">
        <AreaTag v-for="(item,index) in list" :key="index" :canRemove="item.canRemove" @on-remove="remove" :index="index" :name="item.admin">
        </AreaTag>
    </div>
    <div @click="add" style="color:#009445"  v-if="canAdd" >
      <Icon type="ios-add-circle-outline" color="#009445" size=20 />添加路线城市
    </div>
  </div>
</template>

<script>
import AreaTag from "./area_tag";
import Emitter from "./emitter";

export default {
  components: { AreaTag },
  mixins: [Emitter],
  props: {
    list: {
      type: Array,
      default: []
    },
    canAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    remove(index) {
      this.$emit("on-removeArea",index);
    },
    add(){
      this.$emit("on-addArea");
    }
  },
  watch: {
  }
};
</script>