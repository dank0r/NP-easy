import traceback
import json
from flask import Flask, jsonify, send_file, request

from app import *

@app.route('/', methods=['GET', 'POST']) 
def index():
    try:
        ######################################################### GET 
        if request.method == 'GET':
            ans, status = metGet()
            return jsonify(ans), status
        
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
                ans, status  = login(usr, passwd)
                return jsonify(ans), status 
            
            ####################################### SIGN UP
            if pst['type'] == 'SIGN_UP':
                ######## 
                usr = pst['username']
                passwd = pst['password']
                email = pst['email']
                ########                
                ans, status = createUser(usr, email, passwd)
                return jsonify(ans), status 
            
            ####################################### SIGN OUT
            if pst['type'] == 'SIGN_OUT':
                ########
                usr = pst['username']
                token = pst['token']
                ########
                ans, status = logout(usr, token)
                return jsonify(ans), status
            
            ####################################### AUTHENTICATION
            if pst['type'] == 'AUTHENTICATION':
                ########
                token = pst['token']
                ########
                ans, status = auth(token)
                return jsonify(ans), status
            
            ####################################### SUBMIT_SOLUTION
            if pst['type'] == "SUBMIT_SOLUTION":
                ########
                data = pst["data"]
                filename = pst["filename"]
                token = pst["token"]
                userId = pst["userId"]
                competitionId = pst["competitionId"]
                ########                
                ans, status = submit(data, filename, token, userId, competitionId)
                return jsonify(ans), status
            
            ####################################### FETCH_COMPETITIONS
            if pst['type'] == "FETCH_COMPETITIONS":
                ########
                userId = pst["userId"]
                token = pst["token"]
                ########
                ans, status = competitions(userId, token)
                return jsonify(ans), status
            
            ####################################### JOIN_COMPETITION
            if pst['type'] == "JOIN_COMPETITION":
                ########
                userId = pst["userId"]
                competitionId = pst["competitionId"]
                token = pst["token"]
                ########
                ans, status = join(userId, competitionId, token)
                return jsonify(ans), status
            
            ####################################### FETCH_SUBMISSIONS
            if pst['type'] == "FETCH_SUBMISSIONS":
                ########
                competitionId = pst["competitionId"]
                ########
                ans, status = submissions(competitionId)
                return jsonify(ans), status
                
                
            return 'working on it...', 404
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
    

