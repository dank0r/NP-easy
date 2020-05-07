import pymysql  
con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')

cur = con.cursor()

def exc(s):
    cur.execute(s)
    rows = cur.fetchall()
    for i in rows:
        print(i)

exc("DROP TABLE IF EXISTS events;")
exc("DROP TABLE IF EXISTS events;")
