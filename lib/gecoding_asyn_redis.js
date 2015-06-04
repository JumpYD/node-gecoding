var fs = require('fs');
var redis = require("redis");
var channel,client;
var spawn = require('child_process').spawn
var shells =[];

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

    client = redis.createClient(config.port, config.redis);
    channel = config.channel;
    
    var pubdata = function (data){
        client.publish(channel, data);
    }
    var MAX = 5 ;
    for (var i=0;i<MAX;i++){

        var gcd=spawn('node',[__dirname+'/t1.js',i,type,config.bd_maptoken,config.tx_maptoken]);

        gcd.stdout.on('data',pubdata);
        gcd.on('exit', function (code) {
            console.log('child process exited with code ' + code);
        });
        shells.push(gcd);
    }


    if (val.match(/.txt/) || val.match(/.csv/)) {
        fs.readFile(val, 'utf-8', function (err, data) {
            if (err) {
                console.error(err);
            } else {
                var reg = /[\r\n]+|[\n\r]+|[\n]/;
                var arrdata = data.split(reg);
                for (var i = 0; i < arrdata.length; i++) {
                    var dispath_index = parseInt(Math.random()*shells.length);
                    shells[dispath_index].stdin.write(arrdata[i]+"\n");
                }
            }
        });
    } else {
        console.log('Invalid file format')
    }
}

process.on('uncaughtException',function(err){
    console.log('error: '+err);
}) 