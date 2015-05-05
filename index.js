var setting=require('./settings.js');
var asyn_gecoding=require("./lib/gecoding_asyn.js");
var cfg;

module.exports = {
  config:function(config){
  	cfg=config;
  },
  gecoding_aync: function(arguments){
  	if(cfg!=undefined){
  		  asyn_gecoding.gecoding_asyn(cfg,arguments);
  	  }else{
      	asyn_gecoding.gecoding_asyn(setting,arguments);
  	}
  }
}