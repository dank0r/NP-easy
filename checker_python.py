import os, sys
f = open("/root/return_code", "w")
os.system("cd /root/")
f.write(str(os.system("python3 /root/" + sys.argv[1])))
f.close()
