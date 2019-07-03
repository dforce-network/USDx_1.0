#!/bin/bash

for((i=0;i<10;))
do
        curl https://ethgasstation.info/json/ethgasAPI.json > $1
        sleep $2
done