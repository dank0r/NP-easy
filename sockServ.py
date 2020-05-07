import socket
import json

# import pymysql
#  
# con = pymysql.connect('localhost', 'user17', 
#     's$cret', 'testdb')
#  
# with con: 
#  
#     cur = con.cursor()
#     cur.execute("SELECT * FROM cities")
#  
#     rows = cur.fetchall()
#  
#     for row in rows:
#         print("{0} {1} {2}".format(row[0], row[1], row[2]))


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
            snd = ['asd', 'trek', 'preter']
            st = json.dumps(snd)
            conn.send(bytes('HTTP/1.1 200 OK\r\n' + st + '\r\n', 'UTF-8'))
        else:
            conn.send()
        conn.close()
    except:
        pass
