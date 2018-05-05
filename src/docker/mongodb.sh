#!/bin/bash
# Script to run mongodb container

NAME="--name toupeira-network"
PORTA="-p 27017:27017"
VOLUME="-v $PWD/data:/data/db"

docker run $NAME \
    $PORTA \
    $VOLUME \
    -d mongo
