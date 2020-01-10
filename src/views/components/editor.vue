<template>  
    <textarea :id="id" :value="value"></textarea>
</template>  
  
<script>
// Import TinyMCE
import common from "../../libs/common";
import tinymce from "tinymce";

const INIT = 0;
const CHANGED = 2;
var EDITOR = null;
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      required: false
    },
    setting: {}
  },
  watch: {
    value: function(val) {
      //console.log("init " + val);
      if (this.status == INIT || tinymce.activeEditor.getContent() != val) {
        tinymce.activeEditor.setContent(val);
      }
      this.status = CHANGED;
    }
  },
  data: function() {
    return {
      status: INIT,
      id: "editor-" + new Date().getTime(),
      pageIndex: 1,
      pageCount: 1
    };
  },
  methods: {
    init() {
      this.$nextTick(() => {
        let vm = this;
        //let height = document.body.offsetHeight - 300;
        tinymce.init({
          selector: "#" + this.id,
          readonly: this.readonly,
          branding: false,
          elementpath: false,
          relative_urls :false,
          remove_script_host :false,
          height: this.setting.height,
          language: "zh_CN.GB2312",
          menubar: "edit insert view format table tools",
          plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools",
            "searchreplace visualblocks visualchars code fullpage",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons paste textcolor colorpicker textpattern imagetools codesample"
          ],
          toolbar1:
            " newnote print preview | undo redo | insert | styleselect fontselect fontsizeselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample",
          autosave_interval: "20s",
          image_advtab: true,
          file_picker_callback: function(cb, value, meta) {
            vm.filePicker(cb, value, meta);
          },
          table_default_styles: {
            width: "100%",
            borderCollapse: "collapse"
          },
          setup: function(editor) {
            editor.on("input change undo redo", () => {
              let content = editor.getContent();
              vm.$emit("input", content);
            });
          }
        });
      });
    },
    insertFile(url) {
      top.tinymce.activeEditor.windowManager.getParams().oninsert(url);
      top.tinymce.activeEditor.windowManager.close();
    },
    filePicker(callback, value, meta) {
      this.fileType = meta.filetype;
      let html = [];
      html.push("<div>");
      html.push(
        "<div style='heihgt:45px;line-height:45px;display:flex;padding:0px 10px;'>"
      );
      html.push(
        "文件名<input id='fileName' style='border:1px solid #ccc;margin:10px 3px;' type='text' />"
      );
      html.push(
        "<button style='border:1px solid #ccc;margin:10px 3px;padding:0 10px;' onclick='tinymceFindFile()'>查找</button>"
      );
      html.push(
        "<div style='heihgt:45px;line-height:45px;display:flex;padding:0px 10px;margin-left:10px;'>"
      );
      html.push(
        "<button style='border:1px solid #ccc;margin:10px 3px;padding:0 10px;' onclick='tinymcePrevPage()'>上一页</button>"
      );
      html.push(
        "<span id='txtCurrentPage' style='heihgt:45px;line-height:45px;'>1</span>/<span id='txtTotalPage' style='heihgt:45px;line-height:45px;'>1</span>"
      );
      html.push(
        "<button style='border:1px solid #ccc;margin:10px 3px;padding:0 10px;' onclick='tinymceNextPage()'>下一页</button>"
      );
      html.push("</div>");
      html.push("</div>");
      html.push("<div id='filesDiv'></div>");
      html.push("</div>");
      tinymce.activeEditor.windowManager.open(
        {
          title: "选择文件",
          html: html.join(""),
          width: 650,
          height: 550,
          buttons: [
            {
              text: "确定",
              onclick: function() {
                //.. do some work
                tinymce.activeEditor.windowManager.close();
              }
            },
            {
              text: "关闭",
              onclick: "close"
            }
          ]
        },
        {
          oninsert: function(url) {
            callback(url);
            console.log("derp");
          }
        }
      );
      this.findFile();
    },
    findResource(fileName) {
      this.$ajax
        .post("/api", {
          method: "media.find",
          token: null,
          parameter: {
            fileName: fileName,
            fileType: this.fileType,
            page: this.pageIndex,
            size: 20
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
          this.pageCount = Math.ceil(this.dataCount / 20);
          document.getElementById("txtTotalPage").innerHTML = this.pageCount;
          document.getElementById("txtCurrentPage").innerHTML = this.pageIndex;
          this.files = r.data.result.rows;
          let html = [];
          html.push("<div style='width:100%;height:500px;overflow:scroll;'>");
          for (const file of this.files) {
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
            let image =
              "<img style='width:78px;height:78px;display:inline-block;' src='" +
              url +
              "' />";
            let a =
              "<div style='float:left;margin:5px;'><a style='display: flex;flex-direction: column;align-items: center;justify-content: center;' onclick='tinymceInsertFile(\"" +
              url +
              "\")'>" +
              image +
              file.name +
              "</a></div>";
            html.push(a);
          }
          html.push("</div>");
          let content = html.join("");
          let div = document.getElementById("filesDiv");
          div.innerHTML = content;
        });
    },
    findFile() {
      let fileName = document.getElementById("fileName").value;
      this.findResource(fileName);
    },
    prevPage() {
      if (this.pageIndex > 1) {
        this.pageIndex -= 1;
        this.findFile();
      }
    },
    nextPage() {
      if (this.pageIndex < this.pageCount) {
        this.pageIndex += 1;
        this.findFile();
      }
    }
  },
  mounted() {
    this.init();
    window.tinymceFindFile = this.findFile;
    window.tinymceInsertFile = this.insertFile;
    window.tinymcePrevPage = this.prevPage;
    window.tinymceNextPage = this.nextPage;
  },
  beforeDestroy() {
    tinymce.get(this.id).destroy();
  }
};
</script>  