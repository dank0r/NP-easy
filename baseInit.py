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

    

##################################################### competitions(title, previewURL, briefDescription, description, teams, deadline)
exc("""drop table if exists competitions;""")
exc("""create table competitions (id int(11) auto_increment, title varchar(40), previewURL varchar(250), briefDescription varchar(300), description varchar(500), teams int(11), deadline varchar(30), constraint competition_pk primary key (id)) CHARSET=utf8;""")

exc("""insert into competitions(title, previewURL, briefDescription, description, teams, deadline) values("Travelling Salesman Person", "some_url", "Определить кратчайший путь, проходящий через все вершины графа", "Long description", 3, "07.07.2020 00:00");""")
exc("""insert into competitions(title, previewURL, briefDescription, description, teams, deadline) values("Travelling Salesman Person", "some_url", "Определить кратчайший путь, проходящий через все вершины графа", "Long description", 3, "07.07.2020 00:00");""")



##################################################### users (username, email, passHash, avatarURL)
exc("""drop table if exists users;""")
exc("""create table users (id int(11) auto_increment, username varchar(40), email varchar(40), passHash varchar(300), avatarURL varchar(500), constraint user_pk primary key (id)) CHARSET=utf8;""")

exc("""insert into users(username, email, passHash, avatarURL) values("mig", "h4ckit@mail.ru", "cc73627ab0bc316564f216a81ec467422a905d4ce758a274ad8b1cea8a0ca506", "");""")


##################################################### tokens (username, token)
exc("""drop table if exists tokens;""")
exc("""create table tokens (id int(11) auto_increment, username varchar(40), token varchar(32), constraint token_pk primary key (id)) CHARSET=utf8;""")

##################################################### usercompets (userId, competiionId)
exc("""drop table if exists usercompets;""")
exc("""create table usercompets (id int(11) auto_increment, userId int(11), competitionId int(11), constraint usercompet_pk primary key (id)) CHARSET=utf8;""")

exc("""insert into usercompets(userId, competitionId) values(1, 1)""")

##################################################### solutions (userId, competiionId, solution, filename, time, result, status)
exc("""drop table if exists solutions;""")
exc("""create table solutions (id int(11) auto_increment, userId int(11), competitionId int(11), solution varchar(10000), filename varchar(40), time varchar(60), result varchar(40), status varchar(40), constraint solution_pk primary key (id)) CHARSET=utf8;""")


##################################################### end
exc("""select * from events;""")
exc("""select * from users;""")
exc("""commit;""")

