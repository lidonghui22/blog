/**
 * @Author   lidh
 * @DateTime 2017-03-28
 * @version  1.0
 */
$(function(){
	var Service = function(){
		this.$name = $("#name");
		this.$tel = $("#tel");
		this.$commit_btn = $(".to_conmmit");
		this.position = $(".position").attr("value");
		this.sms_code = $("#sms_code").attr("value");
		this.flag = false;
		this.href = location.href;
		this.init();
	}
	Service.prototype = {
		init : function(){
			this.run();
			this.listen();
		},
		run : function(){
			var that = this;
			//限定页面最小高度
			var bodyHeight=$(document.body).height();
			var act_headerHeight = $(".act_header").height();
			var act_searchHeight = $(".act_search").height();
			var act_bodyHeight = bodyHeight - act_headerHeight;
			var rankHeight = act_bodyHeight - act_searchHeight;
			$("body").height(bodyHeight);
			$(".act_body").height(act_bodyHeight);
			$(".rank").height(rankHeight);
			//引导页是否已加载
			// if(that.getCookie('isLoaded')!=""){
			// 	$("#pages").show();
			// }
			//引导页轮播
		    var Swiper_ap = new Swiper("#pages",{
		    	pagination: '.swiper-pagination', 
		        paginationClickable: true,
		        // direction: 'vertical',
		        onSlideChangeEnd: function(swiper){
			      if(swiper.activeIndex == 1){
			      	$(".page2").find(".title2").addClass('fadeIn');
			      }else if(swiper.activeIndex == 2){
			      	$(".page3").find(".title3").addClass('fadeIn');
			      }else if(swiper.activeIndex == 3){
			      	$(".page4").find(".title4").addClass('fadeIn');
			      }else if(swiper.activeIndex == 4){
			      	$(".page5").find(".title5").addClass('fadeIn').end().find(".btn_join").addClass('fadeIn');
			      }
			    }
		    });
		    //筛选结果滚动条设置
		    $(".rank").mCustomScrollbar({
	            scrollInertia:150
	        });
		},
		/*获取cookie*/
		getCookie : function(c_name){
			var that = this;
	　　　　if (document.cookie.length>0){
	　　　　　　c_start=document.cookie.indexOf(c_name + "=")　　//检查这个cookie是否存在，不存在就为 -1　　
	　　　　　　if (c_start!=-1){ 
	　　　　　　　　c_start=c_start + c_name.length+1　　		 //获取cookie值的开始位置
	　　　　　　　　c_end=document.cookie.indexOf(";",c_start)　　//通过";"号是否存在来判断结束位置
	　　　　　　　　if (c_end==-1) c_end=document.cookie.length　　
	　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))　　//通过substring()得到了值
	　　　　　　} 
	　　　　}
	　　　　return ""
	　　},
		/*设置cookie*/
		setCookie : function(c_name, value, expiredays){
			var exdate=new Date();
　　　　    exdate.setDate(exdate.getDate() + expiredays);
　　　　    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
		},
		/*检查用户输入内容*/
		checkform : function(name,tel){
			var that = this;
			var telReg = (/^1[3|4|5|7|8][0-9]\d{8,8}$/).test(tel);
			if(name==''){
				alert("姓名不能为空");
				return;
			}
			if(!telReg){
				alert("请输入正确的手机号码");
				return;
			}
		},
		/*是否允许提交*/
		getKey : function(name,tel,obj){
			var that = this;
			var telReg = (/^1[3|4|5|7|8][0-9]\d{8,8}$/).test(tel);
			if(name!='' && telReg){
				obj.addClass("active");
				that.flag = true;
			}else{
				obj.removeClass("active");
			}
		},
		/*监测输入框*/
		monitor_input : function(input){
			var that = this;
			input.bind('input propertychange',function(){
				var name = that.$name.val();
				var tel =  that.$tel.val();
				var obj = that.$commit_btn;
				that.getKey(name,tel,obj);
			});
		},
		/*异步提交信息*/
		doAjax : function(name,tel,sms_code,position){
			var that = this;
			$.ajax({
				url: 'index.php?m=default&c=activity&a=ajax_design_order',
		        type: 'POST',
		        data:{
		        	username: name,
		        	phone: tel,
		        	position: position,
		        	from: that.href,
		        	sms_code: sms_code
		        },
		        success: function(data){
		        	var data = JSON.parse(data);
		        	if(data.error == 0){
		        		$("#act_alert").show();
			            that.$name.val("");
			            that.$tel.val("");
			            that.$commit_btn.removeClass("active");
			            $("#sms_code").attr("value",data.sms_code);
		        	}else if(!data.msg){	//sms_code更新了，需要刷新页面
	        			alert(data.error);
		        	}else{
		        		alert(data.msg);
		        	}
			    }
			});
		},
		/*事件处理*/
		listen : function(){
			var that = this;
			that.monitor_input(that.$name);
			that.monitor_input(that.$tel);
			that.$commit_btn.click(function(){
				var name = that.$name.val();
				var tel = that.$tel.val();
				that.checkform(name,tel);
				if(that.flag){
					that.flag = false;
					if($(this).hasClass("active")){
						var name = that.$name.val();
						var sms_code = that.sms_code;
						var position = that.position;
						that.doAjax(name,tel,sms_code,position);
					}else{
						return;
					}
				}
			});
			//查看个人信息 
			$('.rank_list').on('click','.hero',function(){
				$("#act_alert").show().find(".js_tip6").show();
			});
			//为TA助力
			$('.rank_list').on('click','.come_on',function(){
				$("#act_alert").show().find(".js_tip6").show();
			});
			//关闭弹窗
			$(".alert_bg").click(function(){
				$("#act_alert").hide().find(".js_tips").children("div").hide();
			});
		}
	}
	var service = new Service();
});
