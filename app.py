from baseApi import *

def metGet():
    rows = execute("select * from events") ###
    ans = []
    for i in rows:
        snd = {}
        snd['id'] = i[0]
        snd['title'] = i[1]
        snd['previewURL'] = i[2]
        snd['briefDescription'] = i[3]
        snd['description'] = i[4]
        snd['teams'] = i[5]
        snd['deadline'] = i[6]
        ans.append(snd)
    return ans, 200


def createUser(usr, email, passwd):
    rows = execute("select * from users")
    for i in rows:
        if i[1] == usr:
            return {"error": "user exist"}, 401
    addUser(usr, email, passwd)
    token = createToken(usr)
    ids = len(execute("select * from users"))
    userInfo = {"token":token, "email": str(email), "avatarURL": "", "username": str(usr), "id": str(ids)}
    ans = {"error": "null", "user": userInfo}
    return ans, 200


def login(usr, passwd):
    hashed = hs(usr, passwd)
    rows = execute("select * from users")
    correct = False
    for i in rows:
        if i[1] == usr and i[3] == hashed:
            correct = True
            break
    if not correct:
        return {"error":"wrong user or pass!"}, 401
    token = checkToken(usr, 1)
    if token is None:
        token = createToken(usr)
    else:
        token = token[2]
    userInfo = {"token": str(token), "email": str(rows[0][2]), "avatarURL": str(rows[0][4]), "username": str(usr), "id": str(rows[0][0])}
    ans = {"error": "null", "user": userInfo}
    return ans, 200
        
    
def logout(usr, token):
    rows = execute("select * from tokens")
    correct = False
    for i in rows:
        if i[1] == usr and i[2] == token:
            correct = True
            break
    if not correct:
        return {"error":"wrong user or token!"}, 401
    execute("delete from tokens where username = '" + usr + "'", 1)
    ans = {"error": "null"}
    return ans, 200


def auth(token):
    rows = execute("select * from tokens")
    correct = False
    usr = ''
    for i in rows:
        if i[2] == token:
            usr = i[1]
            correct = True
            break
    if not correct:
        return {"error":"wrong token!"}, 401
    rows = execute("select * from users where username = '" + usr + "'")
    userInfo = {"token": str(token), "email": str(rows[0][2]), "avatarURL": str(rows[0][4]), "username": str(rows[0][1]), "id": str(rows[0][0])}
    ans = { "error": "null", "user": userInfo}
    return ans, 200


def competitions(userId, token):
    ##### check token and user
    usrInfo = checkId(userId, token)
    if usrInfo is None:
        return {"error":"wrong userId or token"}, 401
    
    ##### 
    rows = execute("select * from usercompets where userId = '" + str(userId) + "'")
    compets = [i[2] for i in rows]
    
    ##### answer
    ans = {"error": "null", "competitions":compets}
    return ans, 200


def submissions(competitionId):
    rows = execute("select * from competitions")
    correct = False
    for i in rows:
        if i[0] == competitionId:
            correct = True
            break
    if not correct:
        return {"error":"wrong competitionId"}, 401
    #####
    subs = []
    rows = execute("select * from solutions where competitionId = '" + str(competitionId) + "'")
    for i in rows:
        if i[7] != 'end' or i[7] != 'error':
            status = stat(i[0])
            log(str(i[0]))
            log(str(status))
            if status == 'end':
                res = getRes(i[0])
                log(str(i[0]))
                log(str(res))
        subs.append({"competitionId":competitionId, "userId": i[1], "compiler": i[4], "submissionDateTime": i[5], "status": i[7], "result": i[6], "time": ""})
    ans = subs
    return ans, 200
    

def submit(data, filename, token, userId, competitionId):
    time = str(datetime.now())
    
    ##### check token and user
    usrInfo = checkId(userId, token)
    if usrInfo is None:
        return {"error":"wrong userId or token"}, 401
    
    ##### check competition
    rows = execute("select * from usercompets")
    correct = False
    for i in rows:
        if i[1] == userId and i[2] == competitionId:
            correct = True
            break
    if not correct:
        return {"error":"wrong competitionId"}, 401
    
    ##### decode data
    sol = dcd(data)
    
    ##### compiler
    comp = None
    if '.cpp' in filename:
        comp = 'gcc'
    if '.py' in filename:
        comp = 'python'
    if comp is None:
        return {"error":"wrong file type"}, 401
    
    ##### save sol 
    solutionId = addSolution(userId, competitionId, sol, comp, time)
    res = run(sol, filename, solutionId)
    log("res:" + str(res))
    ##### answer
    rows = execute("select * from solutions where userId = '" + str(userId) + "'")
    sols = []
    for i in rows:
        sols.append({"competitionId": i[2], "solution": i[3], "compiler":i[4], "submissionDateTime":i[5], "status":i[7], "result":i[6], "time":""})
        
    ans = {"error":"null", "solutions":sols}
    return ans, 200
        
    
def join(userId, competitionId, token):
    ##### check token and user
    usrInfo = checkId(userId, token)
    if usrInfo is None:
        return {"error":"wrong userId or token"}, 401
    
    ##### check competition
    rows = execute("select * from competitions")
    correct = False
    for i in rows:
        if i[0] == competitionId:
            correct = True 
            break
    if not correct:
        return {"error":"wrong competitionId"}, 401
    ##### 
    rows = execute("select * from usercompets")
    for i in rows:
        if i[1] == userId and i[2] == competitionId:
            return {"error":"already joined"}, 401
    joincomp(userId, competitionId)
    ans = {"error":"null"}
    return ans, 200
    
    
def info(userId):
    rows = execute("select * from users")
    for i in rows:
        if i[0] == userId:
            return {"id":i[0], "username":i[1], "email":i[2], "avatarURL":i[4]}, 200
    ans = {"error":"wrong userId"}
    return ans, 401