/**
 * Created by xia on 2014/11/3.
 * cbb
 */
(function(window,document){

    if(window.cbb){
        window.xx_cbb = window.cbb;
        return window.xx_cbb;
    }
    window.xx_cbb = {
        /**
         * 第一次登录
         * @param mobile        手机号
         * @param companyId
         */
        setPhoneWhenSignUp : function(mobile, companyId){
            o = this.exec('setPhoneWhenSignUp', mobile, companyId);

            return o;
        },
        /**
         * 设置标题
         * @param title         标题
         * @param isGoback      是否显示返回
         */
        setTitle:function(title, isGoback, uploadImg){
            uploadImg = uploadImg || "false";

            o = this.exec('setTitle', title, isGoback, uploadImg);
            return o;
        },
        ///**
        // * 分享
        // * @param title         标题
        // * @param content       内容
        // * @param description   说明
        // * @param url           url
        // * @param img           图片
        // */
        //shareTo : function(title, content, description, url, img){
        //    o = this.exec('shareTo', title, content, description, url, img);
        //    return o;
        //},
        /**
         * 执行
         * @param functionName
         * @returns {*|HTMLElement}
         */
        exec : function(functionName){

            // 生成
            var iframe = document.querySelector("#cbbIframe");

            if(iframe==null){
                iframe=document.createElement("iframe");
                iframe.id="cbbIframe";
                iframe.style.display="none";
                document.querySelector("body").appendChild(iframe);
            }
            // 参数
            var params = arguments;
            var paramsString = ':cbb:' + functionName;
            for(var i = 1;i<params.length;i++){
                paramsString += ":cbb:" + params[i];
            }
            paramsString += ":cbb:";
            iframe.src=paramsString;
            return iframe;
        }
    };
})(window,document);