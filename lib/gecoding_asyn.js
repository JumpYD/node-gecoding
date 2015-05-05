var fs = require('fs');
var ng = require('nodegrass');
var csv = require('node-csv').createParser();
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

    if (val.match(/.txt/)) {
        fs.open('./' + val + '.txt', 'a', function (err, data) {
            var rl = readline.createInterface({
                input: fs.createReadStream(val),
                output: process.stdout,
                terminal: false
            });
            rl.on('line', function (line) {
                var item = line.split(',');
                if (type == 'bd') {
                    var bd_url = "http://api.map.baidu.com/geocoder/v2/?address=" + item[0] + "&city=" + item[1] + "&output=json&ak=" + bd_maptoken;
                    callmeback(val, bd_url, null, item[0]);
                } else if (type == 'tx') {
                    var tx_url = 'http://apis.map.qq.com/ws/geocoder/v1/?region=' + item[1] + '&address=' + item[0] + '&key=' + tx_maptoken;
                    callmeback(val, null, tx_url, item[0]);
                }
            });
        });
    } else if (val.match(/.csv/)) {
        fs.open('./' + val + '.txt', 'a', function (err, data) {
            csv.mapFile(val, function (err, data) {
                for (var i = 0; i < data.length; i++) {
                    var add = data[i].add.toString();
                    var city = data[i].city.toString();
                    //baidu url need cityname && key
                    if (type == 'bd') {
                        var bd_url = "http://api.map.baidu.com/geocoder/v2/?address=" + add + "&city=" + city + "&output=json&ak=" + bd_maptoken;
                        callmeback(val, bd_url, null, add);
                    }
                    if (type == 'tx') {
                        var tx_url = 'http://apis.map.qq.com/ws/geocoder/v1/?region=' + city + '&address=' + add + '&key=' + tx_maptoken;
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
            var jsondata = JSON.parse(data);
            if (jsondata.status == '0') {
                lng = jsondata.result.location.lng;
                lat = jsondata.result.location.lat;
                buffer1 = 'baidu,' + name + ',' + lng.toString() + ',' + lat.toString() + '\r\n';
            }else{
                buffer1 = 'baidu,' + name + ',,\r\n';
            }
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
                buffer2 = 'tengxun,' + name + ',' + lngtx.toString() + ',' + lattx.toString() + '\r\n';
            }else{
                buffer2 = 'tengxun,' + name + ',,\r\n';
            }
            fs.writeFile('./' + val + '.txt', buffer2, options, function (err) {
                if (err) throw err;
            });

        });
    }
}