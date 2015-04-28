var test=require('./index.js');

var arguments=['./data/hello.txt','tx','./data/hello.csv','bd']
/*
    argument:
    ./data/hello.txt tx  ./data/hello.csv bd
    ./data/hello.txt ./data/hello.csv tx
    ./data/hello.txt ./data/hello.csv
    ./data/hello.txt
*/

test.gecoding_aync(arguments);