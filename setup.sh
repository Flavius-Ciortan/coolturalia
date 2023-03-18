#!/bin/bash

dir_name=${PWD##*/}
sed -i -e "s/changeme/$dir_name/" ./.env

#read APP_NAME from .env
APP_NAME=$(grep APP_NAME .env | xargs)
IFS='=' read -ra APP_NAME <<< "$APP_NAME"
APP_NAME=${APP_NAME[1]}


#build up docker containers
if [[ "$OSTYPE" == "linux-gnu" ]]; then
   if [[ "$(< /proc/version)" == *@(microsoft|WSL)* ]]; then
     #this is docker running in WSL on windows
     #on windows we need xdebug_remote_connect_back to 0  because it will not work, and if 0 then remote_host will work. basically this overwrites the env variable
     XDEBUG_REMOTE_CONNECT_BACK=0 docker-compose up -d --force-recreate --build
   else
     docker-compose up -d --force-recreate --build
   fi
else
    #on windows we need xdebug_remote_connect_back to 0  because it will not work, and if 0 then remote_host will work. basically this overwrites the env variable
    XDEBUG_REMOTE_CONNECT_BACK=0 docker-compose up -d --force-recreate --build
fi

#with newer versions of wordpress images the database seems not to be created automatically, so create it manually
docker exec -i cozmoslabs-mysql mysql -uroot -ppassword  <<< "CREATE DATABASE $APP_NAME"

#add hosts file entries
bash ../../cli/setup-hosts-file.sh "$APP_NAME.local" "a"
