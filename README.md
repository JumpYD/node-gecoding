# node-gecoding
========
This is a node module for gecoding.Using this module,we can gecoding a lot of address to GPS.The input could be csv File or txt File,which contains a lot of lines like "UESTC，ChengDu".<br>

######这是一个node包，这个包可以用来做批量GECODING，即批量地址转经纬度，输入输出是基于文件【csv,txt】的，文件每行基本格式为逗号分割的地址与城市地址 "电子科技大学，成都 \n  四川大学，成都  \n".<br>
--------
  
## Install
```bash
$ npm install node-gecoding
```
## Useage

######
1. 这是一个基于百度地图和腾地图API的批量GECODING模块，使用首先需要获取百度地图or腾讯地图的API-KEY
  	[1]BAIDU：http://developer.baidu.com/map/index.php?title=car<br>
  	[2]TENGXUN:http://lbs.qq.com/index.html<br>
2. 把申请到的key填入setting.js里
  
  ```js
  module.exports = {
	  bd_maptoken:'baidu-apikey',
	  tx_maptoken:'tengxun-apikey'
  };
  ```
  
3. 格式化输入文件,逗号分割地址与城市[CSV,TXT]
    电子科技大学,成都
    四川大学,成都
    西南财经大学,成都
    四川师范大学,成都
    西南交通大学,成都
4. 输出文件为逗号分割的txt文件，可以方便转csv文件，与输入文件同目
5. 测试代码如下
```js
var gcoding=require('node-gecoding');
/*
    argument:
    ./data/hello.txt tx  ./data/hello.csv bd    //tx:前一文件使用腾讯地图解析 bd:后一个文使用百度地图解析
    ./data/hello.txt ./data/hello.csv tx        //全使用腾讯地图解析
    ./data/hello.txt ./data/hello.csv           //默认使用百度地图解析
    ./data/hello.txt                            //单个文件解析
*/
var argument=['./data/hello.txt','tx','./data/hello.csv','bd']
gcoding.gecoding_aync(argument);
```
