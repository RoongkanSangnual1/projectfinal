@app.route("/home", methods=['GET'])
def home():
    try:
        user_data = None
        token = request.headers.get('Authorization').split(' ')[1]
        if token is None:
            return jsonify({'error': 'Token is missing'}), 403        
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)

        mydb = mysql.connector.connect(
                    user='root',
                   password='',
                    host= 'localhost',
                    database='robo'
                )
        mycursor = mydb.cursor()
        query = "SELECT PName, PTarget, PDes, timeproject, EndTime, PID, image FROM project WHERE username = %s"
        mycursor.execute(query, (user_data,))
        project_data = mycursor.fetchall()

        owasp_query2 = """
            SELECT project.PName, project.PTarget, project.PDes, project.timeproject, project.EndTime, project.PID, att_ps.Severity, project.image
            FROM att_ps
            JOIN project ON att_ps.PID = project.PID
            JOIN urllist ON att_ps.URL_ID = urllist.URL_ID
            JOIN user ON project.username = user.username
            JOIN owasp ON owasp.PID = project.PID AND owasp.Vul_name = att_ps.Vul_name
            WHERE att_ps.state = %s AND user.username = %s
        """
        mycursor.execute(owasp_query2, ('T', user_data,))
        owasp_data2 = mycursor.fetchall()

        combined_data = []
        for project_item in project_data:
            combined_item = list(project_item)  
            combined_item.extend([0, 0, 0, 0])  
            combined_data.append(combined_item)

        for owasp_item in owasp_data2:
            pid = owasp_item[5]  
            for combined_item in combined_data:
                if combined_item[5] == pid:  
                    severity = owasp_item[6]
                    if severity == 'Critical':
                        combined_item[6] += 1
                    elif severity == 'High':
                        combined_item[7] += 1
                    elif severity == 'Medium':
                        combined_item[8] += 1
                    elif severity == 'Low':
                        combined_item[9] += 1

                    # ตรวจสอบว่าข้อมูลภาพไม่ใช่ค่าว่าง
                    if owasp_item[7] is not None:
                        # แปลงข้อมูลภาพให้เป็น base64 string
                        base64_image = base64.b64encode(owasp_item[7]).decode('utf-8')
                        # เพิ่ม base64 string ของภาพลงในลิสต์ข้อมูลโครงการ
                        combined_item.append(base64_image)
                    else:
                        # ถ้าข้อมูลภาพเป็นค่าว่างให้ใส่ค่า None แทน
                        combined_item.append(None)
        return jsonify({"project_data": combined_data})
    except Exception as e:
        return jsonify({"server error": str(e)})
