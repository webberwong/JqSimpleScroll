/**
 * JqSimplescoll jq简单滚动插件
 * 需要先导入jq 库,jq.version > 1.7
 * 实现原理，跟其他实现效果一样，使用两个相同的素进行交互
 * 该处不做补全以充实窗口的效果
 * @param int    rate   间隔时间，单位毫秒
 * @param int    speed  速度，即每次所移动的距离,单位像素
 * @param enum   direction 方向：left,right    默认方向:left
 * @param string op_attr 滚动把操作元素的属性，默认是操作margin-left
 * @param int    fix_pixel 修正像素，该地方是为了让由于每个li元素多了一些其他如padding,margin等引起，进行调整 (该功能未进行检查正常使用)
 * @param bool   full      是否充满窗口，默认为充满窗口
 * returns this
 * @author Hwl <weigewong@gmail.com>
 */
(function(){
$.fn.jscroll = function(opt){
	
	var _this = $(this);
	var sets  = {rate:30,speed:1,direction:"left",op_attr:"margin-left",fix_pixel:0,full:true};
	//循环播放体
	var loops;
	sets      = $.extend(sets,opt);
	
	
	//设置滚动方向,不是左，便是右
	/*if(sets.direction != "right"){
		sets.direction = "left";
	}*/
	sets.direction = sets.direction == "left" ? sets.direction = -1 : sets.direction = 1;
	
	
	
	//显示窗口
	var _window    = _this.parent().parent();
	var _wd_width  = _window.width();
	var _wd_height = _window.height();
		
	var _ul        = _this;
	//显示容器
	var _container = _this.parent();
	
	//显示元素
	var _lis       = _this.children("li"); 
	//移动了的距离
	var distance   = 0;
	
	
	//所有元素的宽度数组，为了方便定容器的总宽度
	//var arr_lis_w  = new Array();
	var lis_width  = 0;
	
	var uls        = 1;
	
	if(_lis.size() < 1){
		return false;	
	}
	
	_lis.each(function(idx){
		lis_width += ($(this).width() + sets.fix_pixel);
	});
	
	_ul.width(lis_width).css("float","left");
	
	
	if(sets.full){
		uls = Math.ceil(_wd_width / _ul.width());
		for(var i = 0; i < uls; i++){
			//复制_ul 副本，并添加到_ul元素
			var _ul_bak = _ul.clone();
			_ul.after(_ul_bak);		
		}
	}else{
		//复制_ul 副本，并添加到_ul元素后
		var _ul_bak = _ul.clone();
		_ul.after(_ul_bak);	
	}
	
	//设置显示窗口的宽度和初始化一些属性
	_container.width(lis_width * (uls + 1));
	if(sets.direction == 1){
		_container.css(sets.op_attr,-lis_width + "px");
	}
	
	
	//执行播放
	loops = setInterval(function(){ run(); },sets.rate);
	
	//显示窗口的鼠标事件处理
	_window.on("mouseover",function(){
			clearInterval(loops);
		}).on("mouseleave",function(){
			loops = setInterval(function(){ run(); },sets.rate);
	});
	
	function run(){
		distance += (sets.speed * sets.direction);
		_container.css(sets.op_attr, distance + "px");
		
		// 判断什么时候重置为0，左边-1 右边 0
		sets.direction == -1 ? chk_Lf_Direction() : chk_Rg_Direction(); 
	}
	
	function chk_Lf_Direction(){
		if(distance < (-lis_width + sets.speed) )
			distance = -sets.speed;	
	}
	
	function chk_Rg_Direction(){
		if(distance > -sets.speed)
			distance = -lis_width + sets.speed;	
	}

	this.leftRun = function(){
		sets.direction = -1;	
	}
	
	this.rightRun = function(){
		sets.direction = 1;	
	}
	
	this.speed    = function(val){
		sets.speed = Math.abs(parseInt(val));
	}
	
	
	this.pause = function(){
		if(typeof(loops) == "number"){
			clearInterval(loops);	
		}
	}
	
	this.resume = function(){
		this.pause();
		loops = setInterval(function(){ run(); },sets.rate);
	}
	
	this.rate     = function(val){
		sets.rate = Math.abs(parseInt(val));
		this.pause();
		loops = setInterval(function(){ run(); },sets.rate);
	}
	
	//test data
	this.loops    = function(){
		return loops;	
	};
	
	return this;
	
	
	
};
})(jQuery);

/*
 * Demo
 * <div class="window">  窗口 需要设置大小，和overflow:hidden
 		<div class="container"> 容器
			<ul id="xxx">  操作的ul,需要float:left（程序里已经设置了）
				<li></li>  li需要float:left
			</ul>
		</div>
 * </div>
 * 
 * $("#xxx").jscroll({参数请看上面的@param});
 * 
 * 如果需要动态调整方向和速度
 *  var jsc = $("#xxx").jscroll(param);
 * 左边方向
 	jsc.leftRun();
 * 右边方向
 	jsc.rightRun();
 * 调整间隔时间
 	jsc.rate(time);
 * 调整速度，即每次滚动的跨度
 	jsc.speed(distance);
 *
 * 暂停动画
 	jsc.pause();
	
 * 恢复动画
 	jsc.resume();
 */


