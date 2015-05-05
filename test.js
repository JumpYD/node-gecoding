var test=require('./index.js');

var arguments=['./data/hello.txt','tx','./data/hello.csv','bd']
/*
    argument:
    ./data/hello.txt tx  ./data/hello.csv bd
    ./data/hello.txt ./data/hello.csv tx
    ./data/hello.txt ./data/hello.csv
    ./data/hello.txt
*/

var cfg = {	//如果再setting里面设置了api-key,就不用在这里配置.
  bd_maptoken:'baidu-map-apikey',
  tx_maptoken:'tengxun-map-apikey'
}
test.config(cfg);

test.gecoding_aync(arguments);
