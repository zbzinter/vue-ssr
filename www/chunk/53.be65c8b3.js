(this.webpackJsonp=this.webpackJsonp||[]).push([[53],{1149:function(t,n,o){var a=o(1567);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,o(15).default)("7cd389cc",a,!1,{})},1566:function(t,n,o){"use strict";var a=o(1149);o.n(a).a},1567:function(t,n,o){(t.exports=o(14)(!1)).push([t.i,"\n.inform[data-v-550dda9f] {\n  width: 1200px;\n  margin: 40px auto 60px auto;\n  background: #fff;\n}\n.inform .header[data-v-550dda9f] {\n    height: 70px;\n    line-height: 70px;\n    padding-left: 80px;\n    border-bottom: 1px solid #F0F0F0;\n}\n.inform .header b[data-v-550dda9f] {\n      color: #3683FF;\n      font-size: 20px;\n      margin-right: 20px;\n}\n.inform .header span[data-v-550dda9f] {\n      font-size: 12px;\n      color: #999999;\n}\n.inform .header span i[data-v-550dda9f] {\n        font-style: normal;\n        color: #F66E00;\n        margin: 0 5px;\n}\n.inform .content[data-v-550dda9f] {\n    width: 720px;\n    padding: 10px 0 50px 110px;\n}\n.inform .content[data-v-550dda9f] .inform-form .ivu-form-item.small .ivu-form-item-content {\n  width: 150px;\n}\n.inform .content[data-v-550dda9f] .inform-form .ivu-form-item.uploadImg {\n  padding: 24px 0;\n  border-top: 1px solid #F0F0F0;\n  border-bottom: 1px solid #F0F0F0;\n}\n.inform .content[data-v-550dda9f] .inform-form .ivu-form-item.uploadImg .btn {\n            background: #fff;\n}\n.inform .content[data-v-550dda9f] .inform-form .ivu-form-item .ivu-form-item-content {\n          width: 500px;\n}\n.inform .content[data-v-550dda9f] .inform-form .cause-input textarea {\n          height: 100px;\n}\n.inform .content[data-v-550dda9f] .inform-form .upload-img {\n        width: 100px;\n        height: 100px;\n        margin-right: 10px;\n        border: 1px solid #ddd;\n}\n.inform .content[data-v-550dda9f] .inform-form .tip {\n        float: left;\n        margin-left: 10px;\n        font-size: 12px;\n        color: #999999;\n}\n.inform .content[data-v-550dda9f] .inform-form .des-text {\n        font-size: 12px;\n        line-height: 1;\n        padding-top: 10px;\n        color: #999999;\n}\n.inform .content .btn-group[data-v-550dda9f] {\n      padding-top: 40px;\n}\n.inform .content .btn-group .submit[data-v-550dda9f] {\n        margin-top: 0;\n}\n.inform .content .btn-group .go-home[data-v-550dda9f] {\n        font-size: 12px;\n        color: #999999;\n        margin-left: 24px;\n        line-height: 36px;\n        cursor: pointer\n}\n.inform .content .btn-group .go-home[data-v-550dda9f]:hover {\n  color: #3683FF;\n}\n",""])},2088:function(t,n,o){"use strict";o.r(n);var a=function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("div",{staticClass:"inform"},[t._m(0),t._v(" "),o("div",{staticClass:"content"},[o("Form",{ref:"formRef",staticClass:"c-user-form inform-form",attrs:{"label-position":"right",rules:t.ruleInline,"label-width":110,model:t.form},on:{submit:function(n){return n.preventDefault(),t.submit(n)}}},[o("FormItem",{attrs:{prop:"cause",label:"举报原因："}},[o("Input",{staticClass:"cause-input",attrs:{size:"large",type:"textarea",maxlength:200,placeholder:"请输入详细说明"},model:{value:t.form.cause,callback:function(n){t.$set(t.form,"cause",n)},expression:"form.cause"}}),t._v(" "),o("p",{staticClass:"des-text"},[t._v("\n          详细细节描述，最大200字符\n        ")])],1),t._v(" "),o("FormItem",{staticClass:"uploadImg",attrs:{prop:"uploadImg",label:"添加截图："}},[o("div",{staticClass:"clearfix"},[t.form.uploadImg?o("img",{staticClass:"fl upload-img",attrs:{src:t.form.uploadImg}}):t._e(),t._v(" "),o("Upload",{staticClass:"fl",attrs:{"before-upload":t.handleUpload,"on-success":t.handleSuccess,"show-upload-list":!1,format:["jpg","jpeg","png"],action:t.uploadAction}},[o("Button",{staticClass:"btn",attrs:{type:"primary",ghost:""}},[t._v("\n              选择截图\n            ")])],1),t._v(" "),o("span",{staticClass:"tip"},[t._v("一张，大小限制1M")])],1)]),t._v(" "),o("FormItem",{staticClass:"small",attrs:{prop:"contact",label:"QQ："}},[o("Input",{attrs:{size:"large",type:"number",placeholder:"请输入QQ"},model:{value:t.form.contact,callback:function(n){t.$set(t.form,"contact",n)},expression:"form.contact"}})],1),t._v(" "),o("div",{staticClass:"btn-group"},[o("Button",{staticClass:"submit",attrs:{type:"error",size:"large"},on:{click:function(n){return t.submit()}}},[t._v("\n          提交\n        ")]),t._v(" "),o("span",{staticClass:"go-home",on:{click:t.goHome}},[t._v("返回首页")])],1)],1)],1)])};a._withStripped=!0;o(78),o(118);var r=o(38),e=o(68),i={components:{Form:r.Form,Input:r.Input,FormItem:r.FormItem,Button:r.Button,Upload:r.Upload},data:function(){return{uploadAction:Object(e.d)()+"/upload",form:{cause:"",contact:"",uploadImg:""},ruleInline:{cause:[{required:!0,message:" ",trigger:"blur"}],uploadImg:[{required:!0,message:"请选择截图",trigger:"blur"}]}}},methods:{handleUpload:function(t){var n=["image/jpeg","image/png"].includes(t.type),o=t.size/1024/1024<1;return n||this.$error("上传封面图片只能是 JPG 格式!"),o||this.$error("上传封面图片大小不能超过 1MB!"),n&&o},handleSuccess:function(t){var n=t.code,o=t.data.imgUrl,a=t.msg;100200===n?this.form.uploadImg=o+"?x-oss-process=image/resize,h_140":this.$error(a)},goHome:function(){this.$router.push("/")},submit:function(){var t=this;this.$refs.formRef.validate(function(n){n&&r.Modal.confirm({title:"确定举报该房间吗？",onOk:function(){return t.updateInform()}})})},updateInform:function(){var t=this;this.$post("v0.1/accusationLog",{apiType:"anchor",body:{uid:this.commUserInfo.uid,acc_room_id:this.$route.query.roomId,acc_uid:this.$route.query.accUid,contact:this.form.contact,content:this.form.cause,acc_img:this.form.uploadImg}}).then(function(n){200===n.code?(t.$success("举报成功"),setTimeout(function(){window.close()},1500)):t.$error(n.msg)})}}},s=(o(1566),o(6)),d=Object(s.a)(i,a,[function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"header"},[n("b",[this._v("举报房间")]),this._v(" "),n("span",[this._v("带"),n("i",[this._v("*")]),this._v("的项必填")])])}],!1,null,"550dda9f",null);d.options.__file="src/project/pc/www/pages/live/inform/index.vue";n.default=d.exports}}]);