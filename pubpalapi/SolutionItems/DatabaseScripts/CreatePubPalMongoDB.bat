@ECHO OFF

cd C:\Program Files\MongoDB\Server\4.0\bin
mongo.exe --eval "use pubpal;"
mongo.exe pubpal --eval "db.createCollection('userstore');"
mongo.exe pubpal --eval "db.createCollection('sellerstore');"
mongo.exe pubpal --eval "db.createCollection('purchasestore');"
mongo.exe pubpal --eval "db.createCollection('feestore');"
mongo.exe pubpal --eval "db.createCollection('cartstore');"
mongo.exe pubpal --eval "db.createCollection('passwordresetstore');"
mongo.exe pubpal --eval "db.feestore.insert({'fee':'1.00','feediscount':'20'});"
::mongo.exe pubpal --eval "db.userstore.insert({'email':'briankhines@gmail.com','password':'P^bP@l','enabled':true, 'firstname': 'Brian', 'lastname': 'Hines'});"
pause
