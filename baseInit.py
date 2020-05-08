import pymysql  
con = pymysql.connect('localhost', 'npadmin',  'nppass', 'npeasy')

cur = con.cursor()

def exc(s):
    cur.execute(s)
    rows = cur.fetchall()
    for i in rows:
        print(i)
    print(':::::executed:::::')
    print(s)

exc("""drop table if exists events;""")
exc("""create table events (id int(11) auto_increment, title varchar(40), previewURL varchar(250), briefDescription varchar(300), description varchar(500), teams int(11), deadline varchar(30), constraint event_pk primary key (id))CHARSET=utf8;""")


exc("""insert into events values(1, "Travelling Salesman Person", "some_url", "Определить кратчайший путь, проходящий через все вершины графа", "Long description", 3, "07.07.2020 00:00");""")
exc("""insert into events values(2, "Travelling Salesman Person", "some_url", "Определить кратчайший путь, проходящий через все вершины графа", "Long description", 3, "07.07.2020 00:00");""")


exc("""select * from events;""")
exc("""commit;""")
