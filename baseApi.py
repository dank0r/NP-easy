import pymysql  
from os import urandom
import hashlib
import base64
from config import *
import subprocess
import socket
import traceback

salt = 'loleasy'

    
def snd(sock, s):
    log("_"*5 + str(s))
    sock.send(s)
    result = str(sock.recv(1024))
    log(" "*10 + result)
    return result


def run(sol, filename, solutionId):
    try:
        sock = socket.socket()
        sock.connect(('localhost', 1100))
        #####
        log(snd(sock, (str(solutionId) + '\0').encode()))
        log(snd(sock, (str(0) + '\0').encode()))
        log(snd(sock, str(filename + '\0').encode()))
        log(str(type(sol)))
        result = snd(sock, bytes(sol.decode('utf-8') + '\0', 'utf-8'))
        #####
        sock.close()
        return result
    except:
        log(str(traceback.format_exc()))
        return "Error 0"


def stat(solutionId):
    try:
        sock = socket.socket()
        sock.connect(('localhost', 1100))
        #####
        snd(sock, (str(solutionId) + '\0').encode())
        result = snd(sock, (str(1) + '\0').encode())
        #####
        sock.close()
        return result 
    except:
        return "refused 1"
    
    
def updt(solutionId, result):
    execute("update solutions set result = '" + result + "' where id = '" + str(solutionId) + "'", 1)
    
    
def getRes(solutionId):
    try:
        sock = socket.socket()
        sock.connect(('localhost', 1100))
        #####
        snd(sock, (str(solutionId) + '\0').encode())
        result = snd(sock, (str(2) + '\0').encode('utf-8'))
        #####
        sock.close()
        return result 
    except:
        return None
    

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


def updateStat(solutionId, status):
    execute("update solutions set status = '" + str(status) + "' where id = '" + str(solutionId) + "'", 1)


def createToken(usr):
    token = urandom(16).hex()
    execute("insert into tokens(username, token) values('" + str(usr) +"', '" + str(token) + "')", 1)
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


def addSolution(userId, competitionId, sol, filename, time, stat):
    solution = base64.b64encode(sol).decode('utf-8')
    execute("insert into solutions(userId, competitionId, solution, filename, time, result, status) values('" + str(userId) + "', '" + str(competitionId) + "', '" + str(solution) + "', '" + str(filename) + "', '" + str(time)  + "', '0', '" + str(stat) + "')", 1)
    
    
def joincomp(userId, competitionId):
    execute("insert into usercompets(userId, competitionId) values('" + str(userId) + "', '" + str(competitionId) + "')", 1)
    
    
    
    