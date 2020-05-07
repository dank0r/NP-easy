import socket

sock = socket.socket()
sock.bind(('', 9090))
sock.listen(1)

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
