import pymysql  
from os import urandom
import hashlib
import base64

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
    dtd = data.split('data:application/octet-stream;base64:')[1]
    dtd = base64.b64decode(dtd)
    return dtd

def addSolution(userId, competitionId, sol, comp, time):
    solution = base64.b64encode(sol)
    execute("insert into solutions(userId, competitionId, solution, compiler, time) values('" + userId + "', '" + competitionId + "', '" + solution + "', '" + comp + "', '" + time  + "')")
    