#!/bin/sh

NAME=bank

echo
echo ">>> Generating for $NAME..."
echo

openssl genrsa -out $NAME.key 2048
openssl req -new -key $NAME.key -out $NAME.csr -config $NAME.conf
openssl x509 -req -days 3650 -in $NAME.csr -signkey $NAME.key -out $NAME.crt -extensions req_ext -extfile $NAME.conf

echo
echo ">>> Generated! Here is the CRT info for $NAME:"
echo

openssl x509 -in $NAME.crt -text -noout

exit
fi