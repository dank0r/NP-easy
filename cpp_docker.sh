#!/bin/bash
echo "" > ./$1/output
echo "" > ./$1/return_code
docker --log-level error run -dt --name solution_$1 main 
docker --log-level error cp ./input $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/input
docker --log-level error cp ./$1/$2 $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/$2
docker --log-level error cp ./$1/output $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/output
docker --log-level error cp ./checker_gcc.py $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/checker.py
docker --log-level error exec -t solution_$1 bash -c "python3 /root/checker.py $2"
docker --log-level error cp $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/output ./$1/output
docker --log-level error cp $(docker ps -a | grep "solution_$1" | cut -d " " -f 1):/root/return_code ./$1/return_code
docker --log-level error stop solution_$1
docker --log-level error system prune -f
