import traceback
import json
from os import urandom
import hashlib
from flask import Flask, jsonify, send_file, request

from config import *
from base_api import *


@app.route('/', methods=['GET', 'POST'])
def index():
    try:
        ######################################################### GET 
        if request.method == 'GET':
            
            rows = execute("select * from events") ###
            pt = []
            for i in rows:
                snd = {}
                snd['id'] = i[0]
                snd['title'] = i[1]
                snd['previewURL'] = i[2]
                snd['briefDescription'] = i[3]
                snd['description'] = i[4]
                snd['teams'] = i[5]
                snd['deadline'] = i[6]
                pt.append(snd)
            return jsonify(pt)
        
        
        ######################################################### POST         
        elif request.method == 'POST':
            content = request.data.decode("utf-8").replace("'", '"')
            log('postetd: ' + content)
            pst = json.loads(content)
            
            ####################################### SIGN IN
            if pst['type'] == 'SIGN_IN':
                usr = pst['username']
                passwd = pst['password']
                
                rows = execute("select * from users where username = '" + usr + "' and passHash = '" + str(hashlib.md5(passwd.encode()).hexdigest()) + "'") ###
                ans = {"responseStatus":"error", "error":"wrong user!"}
                if len(rows) == 1:
                    token = urandom(16).hex()
                    execute("insert into tokens(username, token) values('" + usr +"', '" + str(token) + "')") ###
                    execute("commit;") ###
                    
                    ans = {"responseStatus": "success", "error": "null", "user": {"token": str(token), "email": str(rows[0][2]), "avatarURL": str(rows[0][4]), "username": str(usr), "id": str(rows[0][0])}}
                return jsonify(ans)
            
            ####################################### SIGN UP
            if pst['type'] == 'SIGN_UP':
                usr = pst['username']
                passwd = pst['password']
                email = pst['email']
                token = hashlib.md5(passwd.encode()).hexdigest()
            
                execute("insert into users(username, email, passHash, avatarURL) values('" + usr + "', '" + email + "', '" + str(token) + "', '')") ###
                
                rows = execute("select * from users where username = '" + usr + "' and passHash = '" + str(token) + "'") ###
                ans = {"responseStatus": "success", "error": "null", "user": {"token": str(token), "email": str(rows[0][2]), "avatarURL": str(rows[0][4]), "username": str(usr), "id": str(rows[0][0])}}
                execute('commit;')
                return jsonify(ans)
            
            ####################################### SIGN OUT
            if pst['type'] == 'SIGN_OUT':
                usr = pst['username']
                token = pst['token']
                
                rows = execute("select * from tokens where username = '" + usr + "' and token = '" + token + "'")
                ans = {"responseStatus":"error", "error":"wrong!"}
                if len(rows) == 1:
                    pass
                ans =  {responseStatus: "success", "error": "null", user: information_about_user}
                return jsonify(ans)
            
            ####################################### AUTHENTICATE
            if pst['type'] == 'AUTHENTICATE':
                token = pst['token']
                
                execute("select * from tokens where token = '" + token + "'")
                if len(rows) == 1:
                   pass 
                ans = {"responseStatus":"error", "error":"wrong!"}
                if len(rows) == 1:
                    ans =  {responseStatus: "success", "error": "null", user: ""}
                return jsonify(ans)
            
            ####################################### SUBMIT_SOLUTION
            if pst['type'] == "SUBMIT_SOLUTION":
                compId = pst["competitionId"]
                userId = pst["userId"]
                token = pst["token"]
                solution = pst["solution"]
                cmp = pst["compiler"]
                time = str(datetime.datetime.now())
                
                rows = execute("select * from tokens where token = '" + token + "'")
                return {"responseStatus": "success", "error": "null", "solutions": [{"competitionId": compId, "solution": solution, "compiler": cmp, "submissionDateTime": time, "status": "testing", "result": "", "time": ""}]}
                
                
                
            return 'working on it...'
    except Exception as e:
        return 'ERROR: ' + str(traceback.format_exc())

    
@app.route('/images/<name>', methods=['POST', 'GET'])
def images(name):
    try:
        return send_file('../images/' + name)
    except Exception as e:
        return 'ERROR: ' + str(traceback.format_exc())


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='9090')
