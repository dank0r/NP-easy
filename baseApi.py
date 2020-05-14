import pymysql  
from os import urandom
import hashlib
import base64
from config import *
import subprocess
import socket

salt = 'loleasy'


def run(sol, filename):
    sock = socket.socket()
    sock.connect(('localhost', 1100))
    log(filename.encode())
    sock.send((filename + '\0').encode())
    result = str(sock.recv(1024))
    sock.send(sol)
    result = str(sock.recv(1024))
    if 'OK' in result:
        result = 'ok'
    else:
        result = 'false'
    sock.close()
    return result

def execute(s, com = 0):
    con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
    cur = con.cursor()
    cur.execute(s)
    rows = cur.fetchall()
    if com == 1:
        cur.execute("commit;")
    con.close()
    return rows


def checkId(userId, token):
    tkn = checkToken(token)
    if tkn is None:
        return {"error":"wrong token"}, 401
    
    ##### check userId
    rows = execute("select * from users")
    usrInfo = None
    for i in rows:
        if i[0] == userId:
            usrInfo = i
    return usrInfo
    
    
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
    return str(hashlib.sha256((str(usr) + str(passwd) + str(salt)).encode()).hexdigest())
    
    
def addUser(usr, email, passwd):
    hashed = hs(usr, passwd)
    execute("insert into users(username, email, passHash, avatarURL) values('" + usr + "', '" + email + "', '" + str(hashed) + "', '')", 1)
    

def dcd(data):
    dtd = data.split(';base64,')[1]
    dtd = base64.b64decode(dtd)
    return dtd


def addSolution(userId, competitionId, sol, comp, time, result):
    solution = base64.b64encode(sol).decode('utf-8')
    execute("insert into solutions(userId, competitionId, solution, compiler, time, result) values('" + str(userId) + "', '" + str(competitionId) + "', '" + str(solution) + "', '" + str(comp) + "', '" + str(time)  + "', '" + str(result) + "')", 1)
    
    
def joincomp(userId, competitionId):
    execute("insert into usercompets(userId, competitionId) values('" + str(userId) + "', '" + str(competitionId) + "')", 1)
    
    
    
    