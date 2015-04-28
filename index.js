var setting=require('./settings.js');
var asyn_gecoding=require("./lib/gecoding_asyn.js");

module.exports = {
  gecoding_aync: function(arguments){
      asyn_gecoding.gecoding_asyn(setting,arguments);
  }
}