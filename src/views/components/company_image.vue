<style scoped>
.image-box {
  padding: 3px;
  display: flex;
}
.image-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.image-list img {
  width: 100%;
  height: 100%;
}
.image-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.image-list:hover .image-list-cover {
  display: block;
}
.image-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
<template>
    <div class="image-box">
        <div class="image-list" v-for="(item, index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="image-list-cover">
                    <Icon type="ios-eye-outline" @click.native="previewImage(item)"></Icon>
                    <Icon type="ios-trash-outline" v-if="item.kind != 'facade' && canRemove "  @click.native="removeImage(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="uploadSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="maxSize"
            :on-format-error="uploadFormatError"
            :on-exceeded-size="uploadMaxSize"
            :before-upload="uploadBeforeUpload"
            :data="postData"
            multiple
            type="drag"
            :action="action"
            style="display: inline-block;width:58px;"
            v-if="count == 2 || (uploadList.length<count && canUpload)"
            >
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>

        <!-- <Modal title="图片预览" v-model="visible" footer-hide>
            <img :src="previewUrl" v-if="visible" style="width: 100%">
        </Modal> -->
    </div>
</template>
<script>
export default {
  props: {
    action: {
      type: String,
      default: ""
    },
    maxSize: {
      type: Number,
      default: 2048
    },
    count: {
      type: Number,
      default: 10
    },
    postData: {
      type: Object,
      default: null
    },
    url: {
      type: String,
      default: ""
    },
    remove: {
      type: Function,
      default: () => {
        return true;
      }
    },
    canRemove: {
      type: Boolean,
      default: false
    },
    canUpload: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      defaultList: [],
      previewUrl: "",
      visible: false,
      uploadList: []
    };
  },
  watch: {
    images(val) {
      this.uploadList = this.defaultList = val;
    }
  },
  methods: {
    previewImage(item) {
      this.$emit("previewImage",item);
    },
    removeImage(file) {
      if (this.remove) {
        this.remove(file, ok => {
          if (ok) {
            this.uploadList.splice(this.uploadList.indexOf(file), 1);
          }
        });
      } else {
        this.uploadList.splice(this.uploadList.indexOf(file), 1);
      }
    },
    // uploadSuccess(res, file) {
    //   if (res.code !== 0) {
    //     this.$Modal.error({
    //       title: "上传文件错误",
    //       content: res.error
    //     });
    //     return;
    //   }
    //   console.log('res',res);
    //   console.log('file',file);
    //   file.url = this.url + res.result.url;
    //   file.id = res.result.id;
    //   this.uploadList.push(file);
    //   this.$emit('uploaded', res.result.url);
    // },
    uploadSuccess() {
      this.$emit('uploaded');
    },
    uploadFormatError(file) {
      this.$Notice.warning({
        title: "图片格式",
        desc: file.name + " 文件格式无效, 请选择 jpg 或 png 图片."
      });
    },
    uploadMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小",
        desc: "文件  " + file.name + " 太大, 不能超过" + this.maxSize + "kb。"
      });
    },
    uploadBeforeUpload() {
      const check = this.uploadList.length < this.count;
      if (!check) {
        this.$Notice.warning({
          title: "最大不能超过" + this.count + "张图片。"
        });
      }
      return check;
    }
  }
  // mounted() {
  //   this.uploadList = this.$refs.upload.fileList;
  // }
};
</script>

