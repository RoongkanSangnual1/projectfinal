import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="MYSQL_ROOT_PASSWORD",
  database="robo"
)

mycursor = mydb.cursor()

mycursor.execute("SELECT * FROM att_ps WHERE OID = 10")

myresult = mycursor.fetchall()
print(myresult)
if myresult != []:
    print('we have the result')
else:
    print('empty')
# for x in myresult:
#   print(x)