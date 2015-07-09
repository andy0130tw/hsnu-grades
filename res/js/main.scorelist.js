App.Models.ScoreListItem=Backbone.Model.extend({
	initialize:function(object,options){
		// console.log("[App.Models.ScoreListItem] init",App.Models.ScoreListItemView);
		this.viewClass=App.Views.ScoreListItemView;
	}
})

App.Views.ScoreListItemView=Backbone.View.extend({
	tagName:"a",
	className:"list-group-item list-link",
	initialize:function(){
		//this.listenTo(this.model,"all",this.render);
	},
	render:function(){
		var model=this.model;
		this.$el
			.attr("href","javascript:void 0")
			.attr("data-href",model.get("url"))
			.html(model.get("term"));
		if(model.get("error"))
			this.$el.addClass("list-group-item-danger active");
		return this;
	},
	renderAsOption:function(){
		var model=this.model;
		return $("<option/>")
			.attr("value",model.get("url"))
			.html(_.escape(model.get("term")));
	}
});

App.Collections.ScoreListCollection=Backbone.Collection.extend({
	model:App.Models.ScoreListItem,

})

App.Views.ScoreListCollectionView=Backbone.View.extend({
	tagName:"div",
	className:"list-group hidden-xs",
	initialize:function(){
	},
	render:function(){
		var coll=this.collection;
		var $el=this.$el;
		var $dd=this.$dropdown=$("<select/>").addClass("form-control visible-xs");
		$dd.append("<option value=''>"+STRINGS.DROPDOWN_SELECT_ITEM+"</option>")
		if(coll.length){
			coll.each(this.renderEach,this);
		}else{
			$el.empty();
		}
		if(!this.isRendered){
			$el.append(this.fragment);
			$el.isRendered=true;
		}
		return this;
	},
	renderEach:function(model){
		var view=new (model.viewClass||Backbone.View)({model:model});
		var item=view.render().el;
		this.$dropdown.append(view.renderAsOption());
		if(this.isRendered){
			this.$el.append(item);
		}else{
			this.fragment.appendChild(item);
		}
		return this;
	}
})

App.Views.ScoreListContentView=Backbone.View.extend({
	tagName:"div",
	className:"col-sm-8 col-md-9 table-responsive transition-fade",
	id:"contentPool",
	state:null,
	initialize:function(){
		console.log("[App.Views.ScoreListContentView] init");
		this.on("result",this.renderContent);
		this.state="ready";
	},
	renderContent:function(data){
		var that=this,$el=that.$el;
		$el.removeClass("in");
		data=that.dataPreprocessing(data);
		var tableHandle=that.processContent(data);
		if(that.state=="ready"){
			that.state="rendering";
			// console.log("state changed to rendering")
			setTimeout(function(){
				_.each([
					"removeEmptyColumns",
					"markScoreInStat",
					"markScoreInDist",
					"insertContent",
					"dataPostprocessing"
				],function(v,k){
					that[v](tableHandle);
				});
				$el.addClass("in");
				that.state="ready";
				// console.log("state changed to ready again")
			},200);
		}
		return this;
	},
	dataPreprocessing:function(data){
		return data
			//fix typo here XD
			.replace("圴","均")
			//clean the width attr
			.replace(/width=\"(.+?)\"/g,"");
	},
	processContent:function(data){
		var $content=$("<div/>").html(data);
		// console.log($content);
		//tweak and merge table
		// in this stage we don't modify the tree structure of
		// the table so that it can be less confusing!
		var $tables=$content.find("table").removeAttr("style");
		//select the second table to be the main table,
		// other tables are merely inserted or dropped.
		var $mainTable=$tables.eq(1).addClass("mainTable");
		
		var hdl_tr=$mainTable.find("tr");		
		//$headerTable.find("td").attr("colspan",colCount).css("text-align","left");
		//save the important reference for the future
		$mainTable.data({
			headerTable:$tables.eq(0),
			allTr:hdl_tr,
			firstTr:hdl_tr.eq(0)
		});

		return $mainTable;
	},
	removeEmptyColumns:function($mainTable){
		//delete empty columns for better view...
		var eidx=[];
		var hdl_tr_1=$mainTable.data("firstTr");
		var setWidthFlag=true;
		hdl_tr_1.find("td").each(function(j){
			var v=$(this);
			var isEmpty=v.is(":empty");
			if(isEmpty)
				setWidthFlag=false;
			eidx.push(isEmpty);
			//make the column width equal by setting a width
			// I don't know what the value should be specified, though
			// looks like in pixel...?
			var widthPara="8%";
			if(setWidthFlag){
				if(j>=2)widthPara="5%";
			}else if(!isEmpty)widthPara="6%";
			// if(widthPara)v.attr("width",widthPara);
			// if(widthPara)
			v.css("width",widthPara);
			//console.log(widthPara);
		});
		// ... but preserve the last one
		for(var i=eidx.length;i>=0;i--){
			if(eidx[i]){
				eidx[i]=false;
				break;
			}
		}
		$mainTable.data("columnCheck",eidx);
	},
	markScoreInStat:function($mainTable){
		var scoreArray=[];
		var eidx=$mainTable.data("columnCheck");
		//carefully assert
		//if(!eidx)console.log("[App.Views.ScoreListContentView/markScoreInStat] no eidx provided");
		
		var mainScore=null,compareScoreArr=[],hrcnt=0;
		$mainTable.find("tr").each(function(i){
			var currArray=[];
			scoreArray.push(currArray);
			var $currTr=$(this);
			if(i==0){
				//header
			}else if(i==2){
				//main score
				mainScore={dom:$currTr,data:currArray};
				$currTr.addClass("main-score");
			}else if(hrcnt<=3&&$currTr.find("hr").length){
				//hr, time comsuming
				//console.log("HR found!");
				$currTr.addClass("horizontal-line");
				hrcnt++;
			}else if(hrcnt==2){
				//collect data between the first and the second hr
				compareScoreArr.push({dom:$currTr,data:currArray});
			}
			$(this).find("td").each(function(j){
				var $currTd=$(this);
				if(eidx&&eidx[j]){
					$currTd.remove();
					return;
				}
				if(j>=2){
					var tdVal=UTIL.stripTag($currTd.html().replace(/\s/ig,""));
					currArray.push(tdVal);
				}
			})
		});

		var compareColIdx=0;
		while(1){
			//todo: while might cause a infinite-loop...
			var ok=true;
			for(var i=0;i<5;i++){
				var currCand=compareScoreArr[i];
				var prevCand=compareScoreArr[i-1]||null;
				var scoreCand=currCand.data[compareColIdx];
				var scoreMine=mainScore.data[compareColIdx];
				if(scoreMine===""){
					ok=false;
					break;
				}
				var diff=scoreMine-scoreCand;
				var matched=false;
				//if match until the last item, highlight it instead
				if(diff>=0||i==4){
					//highlight it
					currCand.dom.find("td").eq(compareColIdx+2).addClass("marked");
					matched=true;
				}
				if(diff>0){
					//highlight previous
					if(prevCand)
						prevCand.dom.find("td").eq(compareColIdx+2).addClass("marked");
					matched=true;
				}
				if(matched)break;
			}
			if(!ok)break;
			compareColIdx++;
		}

	},
	markScoreInDist:function(){
		//if you can finish this section by yourself, 
		// please contact me with your work.
	},
	insertContent:function($mainTable){
		this.$el.empty().append($mainTable);
	},
	dataPostprocessing:function($mainTable){
		//get max col count
		var colCount=$mainTable.data("firstTr").children("td").length;
		var $headerTable=$mainTable.data("headerTable");
		//v.Alpha 5, fix typo
		var newTableHeader=$("<tr><td colspan='"+colCount+"'/></tr>");
		var newTableHeaderChild=newTableHeader.children();
		if(window.print){
			var printBtn=$("<a/>")
				.addClass("btn btn-default hidden-print")
				.html(UTIL.iconTemplate({icon:"print",msg:"列印"}))
				.attr("href","javascript:print()");
			newTableHeaderChild.append(printBtn);
		}
		newTableHeaderChild.append($headerTable.find("span"));
		$mainTable.children("tbody").prepend(newTableHeader);
	}
})

App.Views.ScoreListSideView=Backbone.View.extend({
	tagName:"div",
	className:"col-sm-4 col-md-3 hidden-print",
	events:{
		"click a.list-link":"requestScoreResult",
		"change select":"requestScoreResultByOption"
	},
	initialize:function(options){
		//delegate!
		this.subview=new App.Views.ScoreListCollectionView(options);
	},
	highlightListItem:function($which){
		var a="active";
		this.subview.$("."+a).removeClass(a);
		$which.addClass("active");
		return this;
		// 	.find("[data-href='"+o.val()+"']")
	},
	syncBetweenViews:function(o){
		if(o.is("select")){
			//update the list-group
			var $w=this.subview.$("[data-href='"+o.val()+"']");
			this.highlightListItem($w);
		}else if(o.is(".list-group-item")){
			//update the select
			this.$("select").val(o.data("href"));
		}else{
			console.warn("[App.Views.ScoreListSideView/updateTheOther]"
				+" Illegal data provider for updating! Ignored.");
		}
	},
	requestScoreResult:function(e){
		var hdl=$(e.currentTarget);
		this.highlightListItem(hdl).syncBetweenViews(hdl);
		// this.trigger("request",{query:hdl.data("href")});
		var query=hdl.data("href");
		if(!query)return false;
		return this.requestScoreResultRaw(query);
	},
	requestScoreResultByOption:function(e){
		var hdl=$(e.currentTarget);
		var v=hdl.val();
		if(!v)return false;
		this.syncBetweenViews(hdl);
		return this.requestScoreResultRaw(v);
	},
	requestScoreResultRaw:function(href){
		$("#contentPool")
			.html("<h2 class='text-center'>"+UTIL.iconTemplate({
				icon:"circle-o-notch",
				className:"fa-spin",
				msg:"讀取中&hellip;"
			})+"</h2>").addClass("in");
		if(this.xhr&&this.xhr.readyState!=4)
			this.xhr.abort();
		var loader=new App.Models.Loader();
		loader.set("action","score_each")
			.set("urlQuery",{query:href});
		this.listenTo(loader,"sync",this.getMainResult);
		this.listenTo(loader,"error",this.showFailure);
		this.xhr=loader.fetch();
		//console.log()
		return false;
	},
	showFailure:function(model,xhr,options){
		if(xhr&&xhr.statusText=="abort")return;
		console.log("fetch data failed!",arguments);
		$("#contentPool").html("<h3>資料讀取失敗！可能是閒置時間太久，請嘗試登出後重新登入。</h3>");
	},
	getMainResult:function(model,resp,options){
		if(!this.contentView){
			console.log("[App.Views.ScoreListSideView/getMainResult] doesn't have contentPool bound.");
			return;
		}

		var data=resp.data.plain;
		if(!data)
			this.showFailure();
		else
			this.contentView.trigger("result",data);
		
	},
	renderList:function(){
		//delegate!
		return this.subview.render();
	},
	render:function(){
		var list=this.renderList();
		this.$el.empty().append(this.subview.$dropdown,"<br/>",list.$el);
		return this;
	}
});
App.Views.MainScoreView=App.Views.MainView.extend({
	render:function(){
		var statusCode=this.model.get("info").http_code;
		var coll=new App.Collections.ScoreListCollection();
		if(!statusCode||statusCode>=400){
			coll.add({term:"載入清單時發生錯誤！",url:"",error:true});
		}
		_.each(this.model.get("result"),function(v,k){
			coll.add({term:k,url:v});
		});
		var sideView=new App.Views.ScoreListSideView({collection:coll});
		var side=sideView.render().$el;
		//a div is enough for now
		//v.Alpha5 - add a view to handle this
		var contentView=new App.Views.ScoreListContentView();
		var content=contentView.render().$el;

		sideView.contentView=contentView;
		
		this.$el.addClass("row").append(side,content);
		return this;
		//this.$el.html(JSON.stringify(this.model.get("result")));
	}
});

App.Views.AttendanceView=App.Views.MainView.extend({

});