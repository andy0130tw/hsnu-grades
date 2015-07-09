/**!
 * HSNUGrades
 * http://hsnu.qov.tw/
 *
 * A rewritten HTML5 score querying system!
 *
 * @version alpha-7
 * @date    2014-11-30
 *
 * @license github.com/andy0130tw/hsnu-grades/blob/master/LICENSE Apache
 */

var App=new (Backbone.View.extend({
	Views:{},
	Collections:{},
	Models:{},
	Helpers:{},
	events:{
		// "scroll":"scrollHandler"
	},
	config:{
		//"enableCommentSystem":true,"enableDisqus":true
	},
	initFunctions:{
		"views":function(){
			_.extend(App,{
				navbarView:     new App.Views.NavbarView(     {el:$("#navbar")}),
				loginPanelView: new App.Views.LoginPanelView( {el:$("#loginPanel")}),
				mainView:       new App.Views.MainView(       {el:$("#root")}),
				disqusView:     new App.Views.Disqus(         {el:$("#disqus_thread")}),
				bannerView:     new Backbone.View(            {el:$("#banner")}),
				footerView:     new Backbone.View(            {el:$("#footer")}),
			});
		},
		"listeners":function(){
			this.on("login",this.loginSuccessHandler);
			this.on("authInfoReady",this.authInfoHandler);
      $(window).on("scroll",this.scrollHandler).scroll();
		},
		"rememberMe":function(){
			var tmp;
			if(tmp=Backbone.storageObject.get("id")){
				console.log("[initFunctions/rememberMe] remembered");
				$("#loginId").val(tmp);
			}
			$("#loginRememberMe").prop("checked",!!tmp);
		},
		"showHTTPWarning":function(){
			if(location.protocol=="http:"){
				$("#HTTPWarning").removeClass("hide");
			}else{
				$("#HTTPSWarning").removeClass("hide");
			}
		},
		"router":function(){
			//todo: setup routes
			Backbone.Router.extend({});
		}
	},
	clearData:function(){
		Backbone.storageObject.set({
			"tokenName":void 0,
			"tokenValue":void 0,
			"stime":void 0,
			"loginId":void 0,
			"loginName":void 0
		});
	},
  $window:$(window),
  hasShadow:false,
  scrollHandler:function(e){
    //console.log(e);
    //console.log(this.$window.scrollTop());
    var tmpScroll;
    if(!App.hasShadow){
      if(tmpScroll=App.$window.scrollTop()>=60){
        this.$("#navbar").addClass("with-shadow");
        App.hasShadow=true;
      }
    }else if(App.hasShadow){
      if((tmpScroll||App.$window.scrollTop())<60){
        this.$("#navbar").removeClass("with-shadow");
        App.hasShadow=false;
      }
    }
  },
	authInfoHandler:function(){
		var store=Backbone.storageObject;
		this.navbarView.setUserInfo({name:store.get("loginName"),id:store.get("loginId")});
	},
	loginSuccessHandler:function(e){
		console.log("[App/loginSuccessHandler] login view",arguments);
		this.$el.scrollTop(0);
		this.bannerView.$el.slideUp(600);
		this.$("#subContent").hide();
		var title=$("<h2/>").html(STRINGS.LOGIN_SUCCESS_LOADING);
		this.mainView.$el.append(title);
		var loader=this.mainView.model;
		//just let it go to the default section
		loader.set("action","score_list").fetch();
	},
	init:function(){
		_.each(App.initFunctions,function(v,k){
			v.call(App);
		});
		Backbone.history.start();
		this.trigger("ready");
	},
}))({el:document.body});

App.Models.Login=Backbone.Model.extend({
	urlRoot:function(){
		var str="api/get_token.php";
		if(this.urlQuery)str+="?"+$.param(this.urlQuery);
		return str;
	},
	initLogin:function(){
		var ton,tov,store=Backbone.storageObject,ok=false;
		if(ton=store.get("tokenName")){
			tov=store.get("tokenValue");
			//v.alpha4 - check session
			var sessionDate=store.get("stime");
			//here's a migration: v.alpha* -> v.alpha4
			if(!sessionDate){
				store.set("stime",sessionDate=new Date()-0);
				console.log("[App.Models.Login/initLogin] stime migration to v.alpha4");
			}
			//assume it 20 minutes(tested but not pretty sure)
			//20*60*1000
			if(new Date()-sessionDate<12e5){
				//try to login!
				ok=true;
				this.set({"tokenName":ton,"tokenValue":tov});
				this.urlQuery={token:this.getTokenString()};
				this.trigger("bypassLogin");
				App.trigger("authInfoReady");
				// console.log(App.navbarView);
			}else{
				// else don't use it.
				console.log("[App.Models.Login/initLogin] session is likely to be expired.");
				App.clearData();
			}
		}
		if(!ok)
			this.fetch();
	},
	getToken:function(){
		var ton=this.get("tokenName");
		var tov=this.get("tokenValue");
		if(ton&&tov){
			return {tokenName:ton,tokenValue:tov};
		}
		return null;
	},
	getTokenString:function(){
		var to=this.getToken();
		if(!to)return "";
		return [encodeURI(to.tokenName),encodeURI(to.tokenValue)].join("|");
	},
	initialize:function(){
		this.on("loginPanelReady",this.initLogin);
		//try to use a pre-existing token to fetch the new image
		var tks=this.getTokenString();
		this.urlQuery=tks?{token:tks}:null;
		//this.fetch();
	},
	parse:function(resp,options){
		if(resp.status!="ok"){
			console.log("[App.Models.Login/parse] authModel failed to get token.");
			return {};
		}
		this.set("tokenName",resp.info.token_name);
		this.set("tokenValue",resp.info.token_value);
		return resp.data;
	}
});

App.Views.NavbarView=Backbone.View.extend({
	events:{
		"click #logoutBtn":"logoutHandler"
	},
	logoutMenuItem:$("#logoutBtn").parent(),
	initialize:function(){
		this.logoutMenuItem.addClass("disabled");
		this.listenTo(App,"login",this.setUserInfo);
	},
	setUserInfo:function(o){
		console.log("[App.Views.NavbarView/setUserInfo]",arguments);
		if(/*!o||*/o.slient)return;
		this.$("#userInfoBtn > span:eq(0)").html(o?_.escape(o.id+" "+o.name):"[未登入]");
		if(o){
			this.logoutMenuItem.removeClass("disabled");
		}
	},
	logoutHandler:function(e){
		if($(e.currentTarget).parent().hasClass("disabled")){
			alert("尚未登入，無法登出！");
			return false;
		}
		App.clearData();
		console.log("[App.Views.NavbarView/logoutHandler] logout!");
		location.reload();
		return false;
	}
});

App.Views.Disqus=Backbone.View.extend({
	threadName:"hsnugrades",
	initialize:function(){
		if(!App.config.enableCommentSystem)
			this.render();
		else
			this.renderDisabled();
	},
	render:function(){
		var dsq = document.createElement('script');
		dsq.type = 'text/javascript';
		dsq.async = true;
		dsq.src = '//' + this.threadName + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		return this;
	},
	renderDisabled:function(){
		this.$el.html("Comment system for this site is disabled now. Try again later.");
		return this;
	}
});

App.Models.Loader=Backbone.Model.extend({
	urlRoot:function(){
		var str="api/read.php";
		if(!this.authModel)
			this.authModel=App.loginPanelView.model;
		var am=this.authModel;
		var token=am.getTokenString();
		str+="?token="+token;
		str+="&action="+this.get("action");
		var tmp;
		if(tmp=this.get("urlQuery"))str+="&"+$.param(tmp);
		return str;
	},
	initialize:function(){

	},
	parse:function(resp){
		var action=this.get("action");
		if(resp.status=="ok"){
			//v.alpha4 - retain token time
			Backbone.storageObject.set("stime",new Date()-0);
			if(action=="score_list")
				return {info:resp.info,result:_.object(resp.data.match_term,resp.data.match_url)};
			else
				return resp;
		}else{
			console.log("[App.Models.Loader/parse] Loader failed to fetch data!");
		}
	}
})

//the views are a little complicated
// so we need to create a base class with simple logic
App.Views.ViewBase=Backbone.View.extend({
	proto:function(){return App.Views.ViewBase.prototype},
	//is this really right?
	fragment:document.createDocumentFragment(),
	isRendered:false,
	_default:function(){return {_default:""}},
	clear:function(){
		//
		var content=_.result(this,"_default")||"";
		this.$el.html(content);
		this.isRendered=false;
		return this;
	}
});
//replace Backbone.View itself
Backbone.View=App.Views.ViewBase;


App.Views.MainView=Backbone.View.extend({
	model:new App.Models.Loader(),
	subview:null,
	initialize:function(){
		this.listenTo(this.model,"sync",this.render);
		this.listenTo(this.model,"error",this.renderFail);
	},
	render:function(){
		var model=this.model;
		//console.log("[App.Views.MainView/render]",model);
		if(model.get("action")=="score_list"){
			var inner=this.subview=new App.Views.MainScoreView({model:model});
			this.$el.find("h2").html(UTIL.iconTemplate({
				icon:"tag",
				msg:STRINGS.HEADING_VIEW_SCORE
			})).end().append(inner.render().$el);
			//this.$el.html(JSON.stringify(this.model.get("result")));
		}
		return this;
	},
	renderFail:function(){
		App.mainView.$el.html(STRINGS.RENDER_EXCEPTION_MSG);
	}
});

App.Views.LoginPanelView=Backbone.View.extend({
	model:new App.Models.Login(),
	$loginButton:$("#loginBtn"),
	$loginMsg:$("#loginMsg"),
	dummyGIF:"",
	events:{
		//"change #loginRememberMe":"rememberMeToggler",
		"click #captchaRenew":"getNewImage",
		"click #loginBtn":"submitFormProxy",
		"submit #loginForm":"startAuth",
	},
	setButtonStatus:function(bool,str){
		var $el=this.$el;
		str=str||(bool?STRINGS.LOGIN_PANEL_LOGIN:STRINGS.LOGIN_PANEL_LOGGING);
		UTIL.setEnabled(this.$loginButton.html(str),bool);
		if(!bool)$el.addClass("loading");
		else $el.removeClass("loading");
		return this;
	},
	setMsgStatus:function(isError,str,otherClasses){
		var a="alert-warning",b="alert-danger";
		var hdl=this.$loginMsg.removeClass().addClass("alert");
		if(otherClasses){
			hdl.addClass(otherClasses);
		}
		else if(isError) hdl.addClass(b);
		else hdl.addClass(a);
		hdl[str?"removeClass":"addClass"]("hidden");
		hdl.html(str);
	},
	/*rememberMeToggler:function(e){
		// console.log(this,arguments)
		// if($(e.currentTarget).val());
		if(!this.$("#loginRememberMe").is(":checked"))
			Backbone.storageObject.unset("id");
	},*/
	getNewImage:function(){
		// this.model.initialize();
		// drop the original one
		this.$("#captchaImage").attr("src",this.dummyGIF);
		// and get a new one
		this.model.fetch();
		return false;
	},
	submitFormProxy:function(e){
		var rememberMe=this.$("#loginRememberMe").is(":checked");
		console.log("[submitFormProxy] RememberMe=",rememberMe);
		if(rememberMe){
			Backbone.storageObject.set("id",this.$("#loginId").val());
		}
		$("#loginBtnProxy").click();
	},
	bypassLoginHandler:function(){
		var view=this,store=Backbone.storageObject;
		this.setButtonStatus(true);
		$("#loginForm,.panel-footer").addClass("hidden");
		this.setMsgStatus(false,STRINGS.LOGIN_BYPASSED,"alert-success alert-clickable");
		this.$loginMsg.one("click",function(){
			App.trigger("login",{
				id:store.get("loginId"),
				name:store.get("loginName"),
				slient:true
			});
		});
	},
	startAuth:function(){
		var view=this;
		var model=view.model;
		var data={
			"loginid":this.$("#loginId").val(),
			"loginPwd":this.$("#loginPwd").val(),
			"vcode":this.$("#loginCaptcha").val()
		};
		if(_.size(_.compact(data))!=3){
			view.setMsgStatus(false,UTIL.iconTemplate({
				icon:"pencil-square-o",
				className:"fa-fw fa-lg",
				msg:STRINGS.LOGIN_INFO_DATABLANK
			}));
			return false;
		}
		this.setButtonStatus(false);
		// console.log(data);
		var tokenStr=model.getTokenString();
		$.ajax({
			url:"api/auth.php?token="+tokenStr,
			type:"POST",
			dataType:"json",
			data:data||{},
			success:function(resp){
				//console.log(resp);
				if(resp.status!="ok"){
					//error occured
					console.log("[App.Views.LoginPanelView/startAuth] auth error: "+resp.msg);
					if(resp.msg.indexOf("系統已鎖定")>=0){
						//reset token haha
						view.setMsgStatus(true,UTIL.iconTemplate({
							icon:"exclamation-circle",
							className:"fa-fw fa-lg",
							msg:STRINGS.LOGIN_FAILURE_TRIPLE
						}));
						console.log("[startAuth] reset session");
						model.clear().initialize();
					}else{
						//alpha5, refactor
						view.setMsgStatus(true,UTIL.iconTemplate({
							icon:"exclamation-circle",
							className:"fa-fw fa-lg",
							msg:STRINGS.LOGIN_FAILURE_PREFIX+_.escape(resp.msg)
						}));
						//image become invalid, reset
						view.getNewImage();
					}
					model.initLogin();
					//we CAN'T reload challenging image by randomly choosing one!
					//$("#captchaImage").attr("src",URL_HSNUGRADE+"image/vcode.asp?vcode="
					//+Math.floor(Math.random()*Math.pow(2,32)-1));
				}else{
					var token=view.model.getToken();
					Backbone.storageObject.set({
						tokenName:token.tokenName,
						tokenValue:token.tokenValue,
						loginId:resp.data.id,
						loginName:resp.data.name,
						//v.alpha4 - set logging time
						stime: new Date()-0
					});
					view.setMsgStatus(false);
					App.trigger("login",resp.data);
				}
			},
			error:function(){
				console.log("login failed!",arguments);
				view.setMsgStatus(true,UTIL.iconTemplate({
					icon:"exclamation-circle",
					className:"fa-fw fa-lg",
					msg:LOGIN_FAILURE_UNKNOWN
				}));
				view.setButtonStatus(true);
			}
		});
		return false;
	},
	initialize:function(){
		this.dummyGIF=STRINGS.LOGIN_PANEL_DUMMY_GIF;
		this.setMsgStatus(false);
		this.setButtonStatus(false,STRINGS.LOGIN_PANEL_GETTING_CAPTCHA);
		this.listenTo(this.model,"sync",this.render);
		this.listenTo(this.model,"bypassLogin",this.bypassLoginHandler);
		this.listenTo(App,"ready",this.triggerDeferredEvents);
	},
	triggerDeferredEvents:function(){
		this.model.trigger("loginPanelReady");
	},
	render:function(model){
		this.$("#captchaImage").attr("src","data:image/gif;base64,"+model.get("image"));
		this.setButtonStatus(true);
		//this.setMsgStatus(false);
		return this;
	},

})

//inject console for IE
if(typeof console==="undefined")console={log:function(){}};

var UTIL={
	setEnabled:function(x,b){
		var el=x,d="disabled";
		if(!x instanceof jQuery) el=$(x);
		if(b) x.removeAttr(d);
		else x.attr(d,d);
		return el;
	},
	stripTag:function(t){
		return t.replace(/(<([^>]+)>)/ig,"");
	},
	iconTemplate:_.template("<i class=\"fa fa-<%= obj.icon %> <%= obj.className %>\"></i>"
		+"&nbsp;<%= obj.msg %>",{variable:"obj"})
};

var STRINGS={
	LOGIN_PANEL_GETTING_CAPTCHA:"取得驗證碼中&hellip;",
	LOGIN_PANEL_LOGIN:"登入 &raquo;",
	LOGIN_PANEL_LOGGING:"登入中&hellip;",
	LOGIN_PANEL_DUMMY_GIF:
		"data:image/gif;base64,R0lGODlhWgAoAIAAAAAAAP///"
		+"ywAAAAAWgAoAAACQIyPqcvtD6OctNqLs968"
		+"+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/"
		+"g8MCofEovGITCqXzKbzCY1Kp9Sq9YoVFQAAOw==",
	LOGIN_FAILURE_PREFIX:"登入失敗：",
	LOGIN_FAILURE_TRIPLE:"連續3次登入錯誤，原系統會鎖定，但是這個版本並不會！",
	LOGIN_SUCCESS_LOADING:"載入中&hellip;",
	LOGIN_BYPASSED:"<div class='text-center'><i class='fa fa-3x fa-check'></i>"
			+"<br/>按這裡用原帳號登入，或從右上角選單登出。</div>",
	LOGIN_FAILURE_UNKNOWN:"登入不明失敗。",
	LOGIN_INFO_DATABLANK:"資料未填寫完整！",
	RENDER_EXCEPTION_MSG:"<h3>資料讀取失敗！可能是閒置時間太久，請嘗試登出後重新登入。</h3>",
	DROPDOWN_SELECT_ITEM:"請選擇項目&hellip;",
	HEADING_VIEW_SCORE:"考試成績瀏覽",
}

$(function(){App.init();});
