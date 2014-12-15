/*
 * 页面原生滚动、下拉刷新、加载更多
 * @Author  chenjie
 * @param options.page 当前的page
 * @param options.selector 当前的page
 * @param options.refreshUrl 刷新页面的url
 * @param options.enableRefresh 禁用下拉刷新
 * @param options.enableLoadmore 禁用加载更多
*/
define(function(require,exports,module){
	exports.init=function(options){
		var IScroll=require("iscroll"), //引用iscroll插件
			myScroll,//存放iscroll返回的对象
			defaults,//默认参数
			opts,//合并后的蚕食
            hasData,//是否有更多数据
            inFreshing=0,//当前是否处于刷新状态
            $page,//当前模块的dom
            $loadMore,//加载更多dom
            $pullDown,//下拉刷新dom
            pullDownHeight,//下拉刷新dom高度
            $pullDownHelper;//下拉刷新辅助dom

        //设置默认参数
		defaults={
			page:null,
            selector:"",
            refreshUrl:"",
			enableRefresh:true,
			enableLoadmore:true
		};

        //合并参数
		opts=$.extend(true,{},defaults,options);

		$page=$(opts.selector);
        $loadMore=$page.find(".j-loadmore");
        $pullDown=$page.find(".j-pullDown");
        $pullDownHelper=$page.find(".j-pullDown-helper");
        pullDownHeight=$pullDown.height();
        hasData=parseInt($page.find(".j-hasData").val());

        //初始化
        myScroll = new IScroll(opts.selector, {
            click:true,
            tap:true,
            mouseWheel: true,
            scrollbars: true,
            probeType:2
        });

        //如果不启用下拉刷新和加载更多直接跳出
        if(!opts.enableRefresh && !opts.enableLoadmore) return;

        //下拉刷新
        if(opts.enableRefresh){
            myScroll.on('scroll', function() {
                if(inFreshing) return;//如果正在刷新则对下拉不进行响应

                if (this.y > pullDownHeight && !$pullDown.hasClass('flip')) {
                    $pullDown.addClass("flip");
                    $pullDown.text('释放立即刷新...');
                    this.minScrollY=pullDownHeight;
                } else if (this.y < pullDownHeight && $pullDown.hasClass('flip')) {
                    $pullDown.removeClass("flip");
                    $pullDown.text('下拉刷新...');
                    this.minScrollY=0;
                }
            });
        }

        myScroll.on('scrollEnd', function() {
            //加载更多
            if(opts.enableLoadmore && hasData && (this.y-50) <= this.maxScrollY && this.y!=0){
                // $loadMore.css("opacity",1);
                setTimeout(function(){
                    var tmp='<li>新增内容</li><li>新增内容</li><li>新增内容</li><li>新增内容</li><li>新增内容</li>';
                    $page.find(".comm-list").append(tmp);
                    myScroll.refresh();
                },1000);
            }

            if(opts.enableRefresh && $pullDown.hasClass('flip') && !inFreshing){
                inFreshing=1;//设置当前状态为刷新状态
                $pullDown.addClass("pulldown-loading");
                $pullDown.text("正在刷新...");
                $page.find(".j-refreshPanel").load(opts.refreshUrl,function(data,status,xhr){
                    var msg="";

                    if(status=="success"){
                        msg="刷新成功";
                    }
                    else{
                        msg="刷新失败，请重试";
                    }

                    $pullDown.text(msg);

                    setTimeout(function(){
                        this.minScrollY=0;
                        $pullDown.removeClass("pulldown-loading");
                        myScroll.refresh();
                        inFreshing=0;
                    },500);
                });
            }
        });

        return myScroll;
	};
});