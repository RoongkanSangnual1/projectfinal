


                
                db = mysql.connection.cursor()
                select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
                db.execute(select_project_name_id_query,(project_name, user))             
                project_name_id_result = db.fetchall()   
        
                insert_query = ("INSERT INTO urllist (URL, method, URI, Host, HTTPVer, status_code, reason, req_header, req_body, res_header, res_body, PID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
                values = (url_str, method_str, URI_str, Host_str, HTTPVer_str, status_str, reason_str, requestheader_str, requestbody_str, responseheader_str, responsebody_str, project_name_id_result[0])
                db.execute(insert_query, values)
                mysql.connection.commit()
                db.close()






        with open(csv_show, "w", encoding='utf-8') as f:
            fieldnames = ['no.', 'URL', 'METHOD',   'status']
            data = csv.DictWriter(f, fieldnames=fieldnames)
            data.writeheader()
        

            for k in range(1, i):
                url_str = base64.b64encode(http_log[str(k)]['URL'].encode()).decode('utf-8')
                method_str = str(http_log[str(k)]['request']['METHOD'])
                status_str = str(http_log[str(k)]['response']['status'])
                rowdata2 = {
                    'no.': k,
                    'URL': url_str,
                    'METHOD': method_str,                
                    'status': status_str,
                }
                data.writerow(rowdata2)

                
        with open(csv_show,'rb') as csv_file:
            csv_read = csv_file.read()
            s = Response(csv_read,content_type='text/csv')
            s.headers['Content-Disposition']=f'attrachment; filename="{csv_show}"'
            csv_file.close()
        return ({"project_name_id_result": project_name_id_result})
    except Exception as e:
        return jsonify({"server error": str(e)})
    
    

@app.route("/home", methods=['GET'])
def home():
    try:
        user = request.args.get('user') 
        db = mysql.connection.cursor()
        query = "SELECT PDes, PName ,PID FROM project WHERE username = %s"
        db.execute(query, (user,))
        project_data = db.fetchall()
        db.close()

        return jsonify({"project_data": project_data})
    except Exception as e:
        return jsonify({"server error": str(e)})





@app.route("/onedata", methods=['GET'])
def onedata():
    try:
        user = request.args.get('user')
        project_name_id = request.args.get('project_name_id')
        db = mysql.connection.cursor()

        query = """
            SELECT tbl1.URL, tbl1.method, tbl1.status_code
            FROM urllist tbl1
            JOIN project tbl2 ON tbl1.PID = tbl2.PID
            WHERE tbl2.username = %s AND tbl2.PID = %s
        """

        db.execute(query, (user, project_name_id))
        crawl_data = db.fetchall()
        print(crawl_data)

        # query2 = "SELECT URL FROM urllist WHERE PID = %s "
        # db.execute(query2, (project_name_id))
        # crawl_data2 = db.fetchall()
        # # print(crawl_data2)
        # db.close()


        # decoded_strings = []