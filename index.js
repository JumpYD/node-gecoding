var setting=require('./settings.js');
var asyn_gecoding=require("./lib/gecoding_asyn.js");
var asyn_gecoding_redis=require("./lib/gecoding_asyn_redis.js");
var cfg;

module.exports = {
  config:function(config){
  	cfg=config;
  },
  gecoding_aync: function(arguments){
  	if(cfg!=undefined){
        if(cfg.redis!=undefined){
          asyn_gecoding_redis.gecoding_asyn(cfg,arguments);
        }else{
  		    asyn_gecoding.gecoding_asyn(cfg,arguments);
        }
  	  }else{
        if(setting.redis!=undefined){
          asyn_gecoding_redis.gecoding_asyn(setting,arguments);
          console.log(setting.redis)
        }else{
      	  asyn_gecoding.gecoding_asyn(setting,arguments);
        }
  	}
  }
}