# node-gecoding

This is a node module for gecoding.Using this module,we can gecoding a lot of address to GPS.The input could be csv File or txt File,which contains a lot of lines like "UESTC，ChengDu".
  
## Install
```bash
$ npm install node-gecoding
```
## Useage

1. 这是一个基于百度地图和腾地图API的批量GECODING模块，使用首先需要获取百度地图or腾讯地图的API-KEY.(前一个版本使用百度地图车联网API,每天调用次数限制为5000次,今天更新后,百度地图调用无时间限制,每个key每天总共调用100万次,腾讯地图调用时间限制为10次/秒,每天每个key总共10万次.)

  	- [1]BAIDU：http://api.map.baidu.com/lbsapi/cloud/webservice.htm<br>
  	- [2]TENGXUN:http://lbs.qq.com/index.html<br>

2. 把申请到的key填入setting.js里(也可以在程序里配置,见测试代码)
  
  	```js
  	module.exports = {
	  	bd_maptoken:'baidu-apikey',
	  	tx_maptoken:'tengxun-apikey',
	  	//redis:'localhost',
	  	//post:6379
  	}
  	
  	```
  
3. 格式化输入文件,逗号分割地址与城市[CSV,TXT]

    电子科技大学,成都 \n
    四川大学,成都 \n
    西南财经大学,成都 \n
    四川师范大学,成都 \n
    西南交通大学,成都 \n

4. 输出文件为逗号分割的txt文件，可以方便转csv文件，与输入文件同目
5. 测试代码如下
	```js
	var gcoding=require('node-gecoding');
	var argument=['./data/hello.txt','tx','./data/hello.csv','bd'];
	
	var cfg = {	//与setting配置效果相同
		bd_maptoken:'baidu-map-apikey',
		tx_maptoken:'tengxun-map-apikey'
	}
	gcoding.config(cfg);
	
	gcoding.gecoding_aync(argument);

	```
