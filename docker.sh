#!/bin/bash
#echo "FROM main" > Dockerfile
#echo "COPY ./$1 ./root/$1" >> Dockerfile
#echo "COPY ./input ./root/input" >> Dockerfile
#echo "CMD cd /root/ && python3 $1" >> Dockerfile
#docker --log-level fatal build -t t .
echo "" > ./$1/output
echo "" > ./$1/return_code
docker --log-level error run -dt --name solution_$1 main 
docker --log-level error cp ./$1/$2 $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/$2
#rm ./$1/$2
docker --log-level error exec -t solution_$1 bash -c "cd /root/ && python3 $2 && echo \$? > return_code"
docker --log-level error cp $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/output ./$1/output
docker --log-level error cp $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/return_code ./$1/return_code
docker --log-level error stop solution_$1
docker --log-level error system prune -f
