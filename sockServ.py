#!/usr/bin/env python
# -*- coding: utf-8 -*-

import socket

sock = socket.socket()
sock.bind(('', 9090))
sock.listen(1)

str = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script type="text/javascript">window.close();</script>
</head>
<body>
</body>
</html>"""

while True:
    try:
        conn, addr = sock.accept()
        print('connected:', addr)
        data = conn.recv(2048)
        if not data:
            break

        if b'GET' in data:
            conn.send(bytes('HTTP/1.1 200 OK\r\n\r\n', 'UTF-8'))
        else:
            pass
        conn.close()
    except:
        pass
