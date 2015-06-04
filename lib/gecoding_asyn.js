var fs = require('fs');
var ng = require('nodegrass');
var readline = require('readline');

exports.gecoding_asyn = function (config, arguments) {
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
                getaddr(config, arg, 'bd');
            } else {
                getaddr(config, arg, type)
            }
        }
    }
}

function getaddr(config, val, type) {
    var bd_maptoken = config.bd_maptoken;
    var tx_maptoken = config.tx_maptoken;

    if (val.match(/.txt/)||val.match(/.csv/)) {
        fs.open('./' + val + '.txt', 'a', function (err, data) {
            fs.readFile(val, 'utf-8', function (err, data) {
                if (err) {
                    console.error('read txt error ' + err);
                } else {
                    var reg = /[\r\n]+|[\n\r]+|[\n]/;
                    var arrdata = data.split(reg);
                    for (var i = 0; i < arrdata.length; i++) {
                        var item = arrdata[i].split(',');
                        if (type == 'bd' && item[0] != undefined && item[1] != undefined) {
                            var bd_url = "http://api.map.baidu.com/geocoder/v2/?address=" + item[0] + "&city=" + item[1] + "&output=json&ak=" + bd_maptoken;
                            callmeback(val, bd_url, null, item[0]);
                        } else if (type == 'tx' && item[0] != undefined && item[1] != undefined) {
                            var tx_url = 'http://apis.map.qq.com/ws/geocoder/v1/?region=' + item[1] + '&address=' + item[0] + '&key=' + tx_maptoken;
                            callmeback(val, null, tx_url, item[0]);
                        }
                    }
                }
            });
        });
    }
}

function callmeback(val, bd_url, tx_url, name) {
    var buffer1 = '',
        buffer2 = '';
    var lng = '',
        lngtx = '',
        lattx = '',
        lat = '';
    var options = {
        encoding: 'utf-8',
        flag: 'a'
    };
    if (bd_url != null) {
        ng.get(bd_url, function (data, status, header) {
            try {
                var jsondata = JSON.parse(data);
            } catch (error) {
                console.log('some error ' + error)
            }
            if (jsondata != undefined && jsondata.status == '0') {
                lng = jsondata.result.location.lng;
                lat = jsondata.result.location.lat;
                buffer1 = 'baidu,' + name + ',' + lng.toString() + ',' + lat.toString() + '\n';
            } else {
                buffer1 = 'baidu,' + name + ',,\n';
            }
            fs.writeFile('./' + val + '.txt', buffer1, options, function (err) {
                if (err) throw err;
            });

        }, null, 'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    }
    if (tx_url != null) {
        ng.get(tx_url, function (data, status, header) {
            try {
                var jsondatatx = JSON.parse(data);
            } catch (error) {
                console.log('some error ' + error)
            }
            if (jsondatatx!=undefined && jsondatatx.status == '0') {
                lngtx = jsondatatx.result.location.lng;
                lattx = jsondatatx.result.location.lat;
                buffer2 = 'tengxun,' + name + ',' + lngtx.toString() + ',' + lattx.toString() + '\r\n';
            } else {
                buffer2 = 'tengxun,' + name + ',,\r\n';
            }
            fs.writeFile('./' + val + '.txt', buffer2, options, function (err) {
                if (err) throw err;
            });
        }, null, 'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    }
}