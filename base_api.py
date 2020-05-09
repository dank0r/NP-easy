import pymysql  


def execute(s):
    con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
    cur = con.cursor()
    cur.execute(s)
    rows = cur.fetchall()
    con.close()
    return rows
    
    
def checkToken(token):
    if len(token) == 16:
        rows = execute("select * from tokens")
        tokens = [i[2] for i in rows]
        if token in tokens:
            return rows
    else:
        return None