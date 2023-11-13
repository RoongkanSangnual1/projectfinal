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

        query2 = "SELECT URL FROM urllist WHERE PID = %s "
        db.execute(query2, (project_name_id))
        crawl_data2 = db.fetchall()
        db.close()

        crawl_data3 = [row[0] for row in crawl_data2]
        decoded_strings = []

        for encoded_string in crawl_data3:
            decoded_string = unquote(encoded_string, 'utf-8')
            decoded_strings.append(decoded_string)
            print(decoded_strings)

        return jsonify({"crawl_data": crawl_data, "decoded_strings": decoded_strings})
    except Exception as e:
        return jsonify({"server error": str(e)})

