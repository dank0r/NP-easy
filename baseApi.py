#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pymysql  


def execute(s, com = 0):
    con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')
    cur = con.cursor()
    cur.execute(s)
    rows = cur.fetchall()
    if com == 1:
        cur.execute("commit;")
    con.close()
    return rows
    
    
def checkToken(token):
    rows = execute("select * from tokens")
    for i in rows:
        if token == i[2]:
            return i
    return None

