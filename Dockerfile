FROM ubuntu:16.04
RUN apt-get update && apt-get install -y \
python3 \
apt-utils \
python3-pip \
gcc \
g++
RUN pip3 install numpy
