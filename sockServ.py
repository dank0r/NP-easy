#!/usr/bin/env python
# -*- coding: utf-8 -*-

import socket

sock = socket.socket()
sock.bind(('', 9090))
sock.listen(1)

while True:
    try:
        conn, addr = sock.accept()
        print('connected:', addr)
        data = conn.recv(1024)
        if not data:
            break
        conn.send(data.upper())
        conn.close()
    except:
        pass
