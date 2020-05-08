import pymysql  

from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    try:
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
        elif request.method == 'POST':
            content = request.json
            print(content)
            dd = {"responseStatus": "success", "error": "null", "solutions": [{"competitionId": 1, "solution": "some_code", "compiler": "c++", "submissionDateTime": "07.05.2020 23:21", "status": "testing", "result": "", "time": ""}]} 
            return jsonify(dd)
    except Exception as e:
        return 'ERROR: ' + str(e)

    
@app.route('/images/<name>', methods=['POST', 'GET'])
def images(name):
    try:
        return send_file('../images/' + name)
    except Exception as e:
        return 'ERROR: ' + str(e)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='9090')
