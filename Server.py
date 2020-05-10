import traceback
import json
from flask import Flask, jsonify, send_file, request

from config import *
from app import *

@app.route('/', methods=['GET', 'POST']) 
def index():
    try:
        ######################################################### GET 
        if request.method == 'GET':
            ans = metGet()
            return jsonify(ans)
        
        ######################################################### POST         
        elif request.method == 'POST':
            content = request.data.decode("utf-8").replace("'", '"')
            log('postetd: ' + content)
            pst = json.loads(content)
            
            ####################################### SIGN IN
            if pst['type'] == 'SIGN_IN':
                ######## 
                usr = pst['username']
                passwd = pst['password']
                ########
                ans = login(usr, passwd)
                return jsonify(ans)
            
            ####################################### SIGN UP
            if pst['type'] == 'SIGN_UP':
                ######## 
                usr = pst['username']
                passwd = pst['password']
                email = pst['email']
                ########                
                ans = createUser(usr, email, passwd)
                return jsonify(ans)
            
            ####################################### SIGN OUT
            if pst['type'] == 'SIGN_OUT':
                ########
                usr = pst['username']
                token = pst['token']
                ########
                ans = logout(usr, token)
                return jsonify(ans)
            
            ####################################### AUTHENTICATION
            if pst['type'] == 'AUTHENTICATION':
                ########
                token = pst['token']
                ########
                ans = auth(token)
                return jsonify(ans)
            
            ####################################### SUBMIT_SOLUTION
            if pst['type'] == "SUBMIT_SOLUTION":
                competitionId = pst["competitionId"]
                userId = pst["userId"]
                token = pst["token"]
                solution = pst["solution"]
                compiler = pst["compiler"]
                time = str(datetime.datetime.now())
                
                if checkToken(token):
                   pass 
                
                return jsonify({"error": "null", "solutions": [{"competitionId": compId, "solution": solution, "compiler": cmp, "submissionDateTime": time, "status": "testing", "result": "", "time": ""}]})
            
            ####################################### BYTE
            if pst['type'] == "BYTE":
                byte = pst["byte"]
                return jsonify({"bytesLeft": 664863})
            
            ####################################### BYTE
            if pst['type'] == "BYTE":
                byte = pst["byte"]
                return jsonify({"bytesLeft": 664863})
                
                
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
    

