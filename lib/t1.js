var readline = require('readline');
var ng = require('nodegrass');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var count = 0;
var id = process.argv[2];
var type = process.argv[3];
var bd_maptoken = process.argv[4];
var tx_maptoken = process.argv[5];

var time1 = new Date().getTime();

rl.on('line', function (data) {
    var item = data.split(',');
    if (type == 'bd' && item[0] != undefined && item[1] != undefined) {
        var bd_url = "http://api.map.baidu.com/geocoder/v2/?address=" + item[0] + "&city=" + item[1] + "&output=json&ak=" + bd_maptoken;
        var buffer1 = '';
        var lng = '',
            lat = '';
        ng.get(bd_url, function (data, status, header) {
            try {
                var jsondata = JSON.parse(data);
                if (jsondata != undefined && jsondata.status == '0') {
                    lng = jsondata.result.location.lng;
                    lat = jsondata.result.location.lat;
                    buffer1 = id + ',' + count + ',' + 'baidu,' + item[0] + ',' + lng.toString() + ',' + lat.toString();
                } else {
                    buffer1 = id + ',' + count + ',' + 'baidu,' + item[0] + ',,';
                }
                var time2 = new Date().getTime()
                console.log((time2 - time1) / 1000 + ',' + buffer1);
                count++;
            } catch (error) {

            }
        });
    } else if (type == 'tx' && item[0] != undefined && item[1] != undefined) {
        var tx_url = 'http://apis.map.qq.com/ws/geocoder/v1/?region=' + item[1] + '&address=' + item[0] + '&key=' + tx_maptoken;
        var buffer2 = '';
        var lngtx = '',
            lattx = '';
        ng.get(tx_url, function (data, status, header) {
            try {
                var jsondatatx = JSON.parse(data);
                if (jsondatatx != undefined && jsondatatx.status == '0') {
                    lngtx = jsondatatx.result.location.lng;
                    lattx = jsondatatx.result.location.lat;
                    buffer2 = count+','+'tengxun,' + item[0] + ',' + lngtx.toString() + ',' + lattx.toString();
                } else {
                    buffer2 = count+','+'tengxun,' + item[0] + ',,';
                }
                var time2 = new Date().getTime()
                console.log((time2 - time1) / 1000 + ',' + buffer2);
                count++;
            } catch (error) {
            }
        });
    }
});