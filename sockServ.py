import json


from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

import pymysql  
con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')

@app.route('/')
def index():
    try:
        cur = con.cursor()
        cur.execute("SELECT * FROM events")

        rows = cur.fetchall()
        st = json.dumps(rows)
        return st
    except Exception as e:
        return str(e)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='9090')
