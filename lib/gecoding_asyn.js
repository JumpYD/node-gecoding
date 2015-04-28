var fs = require('fs');
var ng = require('nodegrass');
var request = require('sync-request');
var csv = require('node-csv').createParser();

exports.gecoding_asyn = function(config,arguments){
    var i = 0;
    var arr = new Array();
    var arg, type;
    for (i; i < arguments.length; i++) {
        arr.push(arguments[i])
    }

    while ((arg = arr.pop()) != undefined) {
        if (arg == 'tx') {
            type = arg;
        } else if (arg == 'bd') {
            type = arg;
        } else {
            if (type == undefined) {
                getaddr(config,arg, 'bd');
            } else {
                getaddr(config,arg, type)
            }
        }
    }
}

function getaddr(config,val, type) {
    var bd_maptoken=config.bd_maptoken;
    var tx_maptoken=config.tx_maptoken;

    if (val.match(/.txt/)) {
        var databuffer1 = '';
        var databuffer2 = '';
        fs.open('./' + val + '.txt', 'a', function (err, data) {
            fs.readFile(val, 'utf-8', function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    var arrdata = data.split('\r\n');
                    for (var i = 0; i < arrdata.length; i++) {
                        var lng = '',
                            lngtx = '',
                            lattx = '',
                            lat = '';
                        var item = arrdata[i].split(',');
                        if (type == 'bd') {
                            var bd_url = 'http://api.map.baidu.com/telematics/v3/geocoding?keyWord=' + item[0] + '&cityName=' + item[1] + '&output=json&out_coord_type=gcj02&ak='+bd_maptoken;
                            callmeback(val, bd_url, null, item[0]);
                        } else if (type == 'tx') {
                            var tx_url = 'http://apis.map.qq.com/ws/geocoder/v1/?region=' + item[1] + '&address=' + item[0] + '&key='+tx_maptoken;
                            //console.log(bd_url);
                            callmeback(val, null, tx_url, item[0]);
                        }
                    }
                }
            });
        });
    } else if (val.match(/.csv/)) {
        var databuffer = '';
        var databuffer2 = '';
        fs.open('./' + val + '.txt', 'a', function (err, data) {
            csv.mapFile(val, function (err, data) {
                for (var i = 0; i < data.length; i++) {
                    var lng = '',
                        lngtx = '',
                        lattx = '',
                        lat = '';
                    var add = data[i].add.toString();
                    var city = data[i].city.toString();
                    //baidu url need cityname && key
                    if (type == 'bd') {
                        var bd_url = 'http://api.map.baidu.com/telematics/v3/geocoding?keyWord=' + add + '&cityName=' + city + '&output=json&out_coord_type=gcj02&ak='+bd_maptoken;
                        callmeback(val, bd_url, null, add);
                    }
                    if (type == 'tx') {
                        var tx_url = 'http://apis.map.qq.com/ws/geocoder/v1/?region=' + city + '&address=' + add + '&key='+tx_maptoken;
                        callmeback(val, null, tx_url, add);
                    }
                }
            });
        });
    }
}

function callmeback(val, bd_url, tx_url, name) {
    var buffer1 = '',
        buffer2 = '';
    var options = {
        encoding: 'utf8',
        flag: 'a'
    };
    if (bd_url != null) {
        ng.get(bd_url, function (data, status, header) {
            var jsondata = JSON.parse(data);
            if (jsondata.status == 'Success') {
                lng = jsondata.results.location.lng;
                lat = jsondata.results.location.lat;
            }
            buffer1 = 'baidu,' + name + ',' + lng.toString() + ',' + lat.toString() + '\r\n';

            fs.writeFile('./' + val + '.txt', buffer1, options, function (err) {
                if (err) throw err;
            });
        });
    }
    if (tx_url != null) {
        ng.get(tx_url, function (data, status, header) {
            var jsondatatx = JSON.parse(data);
            if (jsondatatx.status == '0') {
                lngtx = jsondatatx.result.location.lng;
                lattx = jsondatatx.result.location.lat;
            }
            buffer2 = 'tengxun,' + name + ',' + lngtx.toString() + ',' + lattx.toString() + '\r\n';
            fs.writeFile('./' + val + '.txt', buffer2, options, function (err) {
                if (err) throw err;
            });
        });
    }
}