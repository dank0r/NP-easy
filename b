#!/bin/bash
if [[ $1 == "r" ]];
then
	echo 'restart service';
	service backend_api restart;

fi

if [[ $1 == "t" ]];
then
	service backend_api status;
fi

if [[ $1 == "s" ]];
then 
	echo 'starting service';
	service backend_api start;
fi

if [[ $1 == "sp" ]];
then 	
	echo 'stopping service';
	service backend_api stop;
fi 

if [[ $1 == "b" ]];
then 
	echo 'base reload';
	python3 /root/back/baseInit.py;
fi 

if [[ $1 == "l" ]];
then 	
	echo 'logs';
	tail /root/back/log.txt -n 20;
fi

