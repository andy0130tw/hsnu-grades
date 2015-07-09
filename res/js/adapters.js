/*!
 * storageObject - localStorage + Cookies + JSON Hybrid Persistence Layer
 * Written by Andy for LMv2
 */
Backbone.storageObject=(function(Backbone){
	var origin=Backbone.StorageObject;
	var verbose=false;
	var prefix="hsnugrades.";
	var UTIL={
		log:function(){
			if(!verbose)return;
			try{
				console.log.apply(console,arguments);
			}catch(e){}
		}
	};
	Backbone.StorageObject=Backbone.Model.extend({
		noConflict:function(){
			var newOne=Backbone.StorageObject;
			Backbone.StorageObject=origin;
			return newOne;
		},
		constructor: function(){
			Backbone.Model.apply(this,arguments);

			//check if the storage can be used
			this.supportLocalStorage=!!localStorage;
			this.prefix=prefix;

			var self=this;
			var addPrefix=function(k){
				return self.prefix+k;
			}
			var removePrefix=function(k){
				return k.slice(self.prefix.length);
			};

			//add the data from localStorage
			if(this.supportLocalStorage){
				for(var i=0,len=localStorage.length;i<len;++i){
					var k=localStorage.key(i);
					//check prefix
					if(this.prefix&&k.indexOf(this.prefix)!=0)
						continue;
					var v=localStorage.getItem(k);
					try{
						//try to parse into objects
						v=JSON.parse(v);
					}catch(e){}
					this.set(removePrefix(k),v);
				}
			}else{
				_.each($.cookie,function(v,k){
					this.set(removePrefix(k),v);
				})
			}

			//reset changed prop
			this.changed={};

			this.on("change",function(m){
				UTIL.log("storageObject changed",this.changed);
				if(this.supportLocalStorage){
					_.each(this.changed,function(v,k){
						//add prefix, ready to save
						k=addPrefix(k);
						if(v===null||v===void 0){
							localStorage.removeItem(k);
							return;
						}
						if(_.isObject(v))
							v=JSON.stringify(v);
						localStorage.setItem(k,v);
					});
				}else{
					if(_.isObject(v))
						$.cookie(addPrefix(k),v);
				}
			});
		},
		save: function(key,val,options){
			var attrs;
			if (key==null||_.isObject(key)){
				attrs=key;
				options=val;
			}else{
				(attrs={})[key]=val;
			}
			attrs=attrs||this.attributes;
			this.changed=attrs;
			this.trigger("change",this);
		},
		unset: function(attr,options){
			//Use no 'delete'
			//but QAQ
			this.set(attr,void 0,_.extend({}, options, {unset: true}));
	}
	});
	return new Backbone.StorageObject();
})(Backbone);