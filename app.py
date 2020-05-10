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
    return ans


def createUser(usr, email, passwd):
    rows = execute("select * from users")
    for i in rows:
        if i[1] == usr:
            return {"responseStatus": "fail", "error": "user exist"}
    addUser(usr, email, passwd)
    ids = len(execute("select * from users"))
    userInfo = {"email": str(email), "avatarURL": "", "username": str(usr), "id": str(ids)}
    ans = {"responseStatus": "success", "error": "null", "user": userInfo}
    return ans


def login(usr, passwd):
    hashed = hs(usr, passwd)
    rows = execute("select * from users")
    correct = False
    for i in rows:
        if i[1] == usr and i[3] == hashed:
            correct = True
            break
    if not correct:
        return {"responseStatus":"error", "error":"wrong user or pass!"}
    token = checkToken(usr, 1)
    if token is None:
        token = createToken(usr)
    else:
        token = token[2]
    userInfo = {"token": str(token), "email": str(rows[0][2]), "avatarURL": str(rows[0][4]), "username": str(usr), "id": str(rows[0][0])}
    ans = {"responseStatus": "success", "error": "null", "user": userInfo}
    return ans
        
    
def logout(usr, token):
    rows = execute("select * from tokens")
    correct = False
    for i in rows:
        if i[1] == usr and i[2] == token:
            correct = True
            break
    if not correct:
        return {"responseStatus":"error", "error":"wrong user or token!"}
    execute("delete from tokens where username = '" + usr + "'", 1)
    ans = {"responseStatus": "success", "error": "null"}
    return ans
        