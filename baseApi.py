import pymysql  
from os import urandom
import hashlib

salt = 'loleasy'


def execute(s, com = 0):
    con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
    cur = con.cursor()
    cur.execute(s)
    rows = cur.fetchall()
    if com == 1:
        cur.execute("commit;")
    con.close()
    return rows
    
    
def checkToken(chk, ids = 2):
    rows = execute("select * from tokens")
    for i in rows:
        if chk == i[ids]:
            return i
    return None


def createToken(usr):
    token = urandom(16).hex()
    execute("insert into tokens(username, token) values('" + usr +"', '" + str(token) + "')", 1)
    return token
    

def hs(usr, passwd):
    return str(hashlib.md5((str(usr) + str(passwd) + str(salt)).encode()).hexdigest())
    
    
def addUser(usr, email, passwd):
    hashed = hs(usr, passwd)
    execute("insert into users(username, email, passHash, avatarURL) values('" + usr + "', '" + email + "', '" + str(hashed) + "', '')", 1)