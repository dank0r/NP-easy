from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)


import datetime
def log(s):
    f = open('/root/back/log.txt', 'a')
    f.write(str(datetime.datetime.now()) + ' ::: ' + str(s) + '\n')
    f.close()