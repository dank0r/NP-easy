import os, sys
f = open("/root/return_code", "w")
os.system("g++ /root/" + sys.argv[1] + " -o /root/a.out")
f.write(str(os.system("/root/a.out")))
f.close()
