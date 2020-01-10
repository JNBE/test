<style scoped>
.default {
  display: inline-block;
  margin: 2px;
  background-color: white;
  font-size: 12px;
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  vertical-align: middle;
}

.actived {
  display: inline-block;
  margin: 2px;
  background-color: red;
  color: white;
  font-size: 12px;
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  vertical-align: middle;
}
</style>

<template>
    <div class="default">
      {{areaName}}
      <Icon type="ios-trash-outline" color="red" size=16 v-if="canRemove" @click.stop="remove" />
    </div>
</template>
<script>
export default {
  name: "AreaTag",
  props: {
    index: {
      type: Number,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    canRemove: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {}
  },
  computed: {
    areaName() {
      let area = this.name + "";
      let list = area.split("/");
      if (list.length > 1) {
        area = list[list.length - 1];
      } 
      return area;
    }
  },
  methods: {
    remove() {
      this.$emit("on-remove",this.index);
    },
  },
  watch: {
  }
};
</script>