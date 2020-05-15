#!/bin/bash
#echo "FROM main" > Dockerfile
#echo "COPY ./$1 ./root/$1" >> Dockerfile
#echo "COPY ./input ./root/input" >> Dockerfile
#echo "CMD cd /root/ && python3 $1" >> Dockerfile
#docker --log-level fatal build -t t .
docker --log-level fatal run -ti t
docker --log-level fatal cp $(docker ps -aq | grep $1):/root/output .
docker --log-level fatal rmi -f t
docker system prune -f
