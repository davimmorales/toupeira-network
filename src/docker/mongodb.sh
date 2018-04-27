#!/bin/bash
# Script para subir o container do mongodb

NAME="--name mongo"
PORTA="-p 27017:27017"
VOLUME="-v $PWD/data:/data/db"

docker run $NAME \
    $PORTA \
    $VOLUME \
    -d mongo
