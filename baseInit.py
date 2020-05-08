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

    

##################################################### events
exc("""drop table if exists events;""")
exc("""create table events (id int(11) auto_increment, title varchar(40), previewURL varchar(250), briefDescription varchar(300), description varchar(500), teams int(11), deadline varchar(30), constraint event_pk primary key (id)) CHARSET=utf8;""")

exc("""insert into events values(1, "Travelling Salesman Person", "some_url", "Определить кратчайший путь, проходящий через все вершины графа", "Long description", 3, "07.07.2020 00:00");""")
exc("""insert into events values(2, "Travelling Salesman Person", "some_url", "Определить кратчайший путь, проходящий через все вершины графа", "Long description", 3, "07.07.2020 00:00");""")



##################################################### users
#{id: 1, username: "user", email: "something", passHash: "something", avatarURL: "something"}
exc("""drop table if exists users;""")
exc("""create table events (id int(11) auto_increment, username varchar(40), email varchar(40), passHash varchar(300), avatarURL varchar(500), constraint user_pk primary key (id)) CHARSET=utf8;""")

exc("""insert into users values(1, "MigmasADMIN", "h4ckit@mail.ru", "somehash123123123", "nourl");""")
exc("""insert into users values(2, "user", "something", "something", "something");""")



##################################################### end
exc("""select * from events;""")
exc("""select * from users;""")
exc("""commit;""")
