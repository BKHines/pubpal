@ECHO OFF

cd C:\Program Files\MongoDB\Server\4.0\bin
mongo.exe --eval "use pubpal-dev;"
mongo.exe pubpal-dev --eval "db.createCollection('userstore');"
mongo.exe pubpal-dev --eval "db.createCollection('sellerstore');"
mongo.exe pubpal-dev --eval "db.createCollection('purchasestore');"
mongo.exe pubpal-dev --eval "db.createCollection('feestore');"
mongo.exe pubpal-dev --eval "db.createCollection('cartstore');"
mongo.exe pubpal-dev --eval "db.createCollection('passwordresetstore');"
mongo.exe pubpal-dev --eval "db.feestore.insert({'fee':'1.00','feediscount':'20'});"
::mongo.exe pubpal-dev --eval "db.userstore.insert({'email':'briankhines@gmail.com','password':'P^bP@l','enabled':true, 'firstname': 'Brian', 'lastname': 'Hines'});"
pause
