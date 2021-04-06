#!/bin/sh

generate () {
    echo
    echo ">>> Generating for $1..."
    echo

    openssl genrsa -out $1.key 2048
    openssl req -new -key $1.key -out $1.csr -config $1.conf
    openssl x509 -req -days 3650 -in $1.csr -signkey $1.key -out $1.crt -extensions req_ext -extfile $1.conf

    echo
    echo ">>> Generated! Here is the CRT info for $1:"
    echo

    openssl x509 -in $1.crt -text -noout
}

generate "ssl/bank"
generate "client/ssl/client"

