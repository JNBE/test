<template>
    <div>
        <Input v-model="fileName">       
            <span slot="prepend">文件名</span>
            <Button slot="append" icon="ios-search" @click="search"></Button>
        </Input>
        <RadioGroup v-model="initItem" @on-change="selected">
            <div class="file-box" v-for="file in files" :key="file.id" :name="file.name">
                <img class="file-icon" :src="file.iconUrl" alt="file.url">
                <span>{{file.name}}</span>
            <Radio :label="file.id"></Radio>
            </div>
            <div style="clear: both;" ></div>
        </RadioGroup>
        <Page style="text-align: center;" :total="dataCount" show-elevator :page-size="pageSize" @on-change="pageChanged"></Page>
     
    </div>
</template>

<script>
import common from "../../libs/common";
export default {
  props: {
    fileType: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      initItem: "xxx@" + new Date().getTime(),
      fileName: "",
      dataCount: 0,
      files: [],
      pageIndex: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    pageChanged(page) {
      this.pageIndex = page;
      this.reload();
    },
    search() {
      this.pageIndex = 1;
      this.reload();
    },
    reload() {
      this.$ajax
        .post("/api", {
          method: "media.find",
          token: null,
          parameter: {
            fileName: this.fileName,
            fileType: this.fileType,
            page: this.pageIndex,
            size: this.pageSize
          }
        })
        .then(r => {
          if (r.data.code !== 0) {
            this.$Modal.error({
              title: "获取资源列表错误",
              content: r.data.error
            });
            return;
          }
          this.dataCount = r.data.result.count;
          let files = [];
          for (const file of r.data.result.rows) {
            let url = common.website + "/file.png";
            if (
              file.name.endsWith(".jpg") ||
              file.name.endsWith(".jpeg") ||
              file.name.endsWith(".png") ||
              file.name.endsWith(".gif") ||
              file.name.endsWith(".tif")
            ) {
              url = common.website + "/medias/" + file.file;
            } else if (file.name.endsWith(".mp4")) {
              url = common.website + "/media.png";
            }
            file.iconUrl = url;
            file.url = common.website + "/medias/" + file.file;
            files.push(file);
          }
          this.files = files;
        });
    },
    selected(id) {
      console.log("选择文件：",id);
      for (const file of this.files) {
        if (file.id === id) {
          this.$emit("selected", file.url);
          break;
        }
      }
    }
  }
};
</script>

<style scoped>
.file-box {
  float: left;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.file-icon {
  width: 75px;
  height: 75px;
  display: block;
}
</style>