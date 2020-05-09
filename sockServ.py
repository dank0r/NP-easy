import pymysql  
import traceback
import datetime
import json
from os import urandom
import hashlib
from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

def log(s):
    f = open('/root/back/log.txt', 'a')
    f.write(str(datetime.datetime.now()) + ' ::: ' + str(s) + '\n')
    f.close()

@app.route('/', methods=['GET', 'POST'])
def index():
    try:
        ######################################################### just get 
        if request.method == 'GET':
            con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
            cur = con.cursor()
            cur.execute("SELECT * FROM events")
            pt = []
            rows = cur.fetchall()
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
        
## {type: "SIGN_IN", username: "user", password: "123"} (ты должен вернуть {responseStatus: "success", "error": "null", user: information_about_user})
## {type: "SIGN_UP", username: "user", password: "123", email: "something"} (вернуть - {responseStatus: "success", "error": "null", user: information_about_user})

# {type: "SIGN_OUT", username: "user", token: "123"} (вернуть - {responseStatus: "success", "error": "null"})


# {type: "AUTHENTICATION", token: "123"} (вернуть - {responseStatus: "success", "error": "null", user: information_about_user})
        
        elif request.method == 'POST':
            content = request.data.decode("utf-8").replace("'", '"')
            log('postetd: ' + content)
            pst = json.loads(content)
            
            ####################################### SIGN IN
            if pst['type'] == 'SIGN_IN':
                usr = pst['username']
                passwd = pst['password']
                con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
                cur = con.cursor()
                cur.execute("SELECT * FROM users where username = '" + usr + "' and passHash = '" + str(hashlib.md5(passwd.encode()).hexdigest()) + "'")
                rows = cur.fetchall()
                ans = {"responseStatus":"error", "error":"wrong user!"}
                if len(rows) == 1:
                    token = urandom(16).hex()
                    cur.execute("insert into tokens(username, token) values('" + usr +"', '" + str(token) + "')")
                    cur.execute("commit;")
                    ans = {"responseStatus": "success", "error": "null", "token":str(token), "user": str(rows[0][2]) + '\n' + str(rows[0][4])}
                con.close()
                return jsonify(ans)
            
            ####################################### SIGN UP
            if pst['type'] == 'SIGN_UP':
                usr = pst['username']
                passwd = pst['password']
                email = pst['email']
                
                con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
                cur = con.cursor()
                cur.execute("insert into users(username, email, passHash) values('" + usr + "', '" + email + "', '" + str(hashlib.md5(passwd.encode()).hexdigest()) + "')")
                ans = {"responseStatus": "success", "error": "null"}
                cur.execute('commit;')
                con.close()
                return jsonify(ans)
            
            ####################################### SIGN OUT
            if pst['type'] == 'SIGN_OUT':
                usr = pst['username']
                token = pst['token']
                
                con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
                cur = con.cursor()
                cur.execute("SELECT * FROM tokens where username = '" + usr + "' and token = '" + token + "'")
                rows = cur.fetchall()
                ans = {"responseStatus":"error", "error":"wrong!"}
                if len(rows) == 1:
                    
                ans =  {responseStatus: "success", "error": "null", user: information_about_user}
                return jsonify(ans)
            
            ####################################### AUTHENTICATE
            if pst['type'] == 'AUTHENTICATE':
                token = pst['token']
                
                con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
                cur = con.cursor()
                cur.execute("SELECT * FROM tokens where username = '" + usr + "' and token = '" + token + "'")
                rows = cur.fetchall()
                ans = {"responseStatus":"error", "error":"wrong!"}
                if len(rows) == 1:
                    ans =  {responseStatus: "success", "error": "null", user: }
                return jsonify(ans)
                
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
