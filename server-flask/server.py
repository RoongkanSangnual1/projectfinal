from cmath import e
from flask import Flask, request, jsonify ,Response
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote
import csv
import base64
import urllib.parse
from flask_mysqldb import MySQL
import json

app = Flask(__name__)
CORS(app)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'robo'

mysql = MySQL(app)



def crawl(url):
    global i
    if len(visited_urls) >= 100:
        return
    # if not url.startswith(SCOPE_URL):
    #     url = SCOPE_URL + url
    if url not in visited_urls:
        visited_urls.append(url)
        response = get_response(url)
        if response is not None:
            if urlparse(response.url).netloc == Host:
                if response.status_code in (301,302):
                    re_location = response.headers.get('Location')
                    if re_location:
                        ##bug :V
                        if not re_location.startswith('http'):
                            if re_location.startswith('/'):
                                crawl(response.url[:-1]+re_location)
                            else:
                                crawl(response.url+re_location)
                        else:
                            crawl(re_location)
                        # print(re_location)
                    # crawl(re_location)
                print(f'Collect.. {response.url} -> {response.status_code} ..is {response.is_redirect} from {response.history}')
                save_log(response, i)
                i += 1
                soup = BeautifulSoup(response.text, 'lxml')
                get_links(response,soup)
    else:
        return

def get_response(url):
    try:
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},
                                cookies=cookies_data, allow_redirects=False)
        response.raise_for_status()
        # set_cookies(response)
        return response
    except requests.exceptions.RequestException as e:
        print(f"HTTP error: {e}")
        print(f'Cannot request: {url}')
        return None
  
                

def save_log(response, i):
    log_key = str(i)
    http_log_data = {}
    if response.raw.version == 10:
        http_ver = 'HTTP/1.0'
    elif response.raw.version == 11:
        http_ver = 'HTTP/1.1'
    req = {
        'METHOD': response.request.method,
        'URI': response.request.path_url,
        'Host': urlparse(response.url).netloc,
        'httpver': http_ver,
        'header': response.request.headers,
        'body': response.request.body
    }
    res = {
        'status': response.status_code,
        'reason': response.reason,
        'header': response.headers,
        'body': response.text
    }
    http_log_data['URL'] = response.url
    http_log_data['request'] = req
    http_log_data['response'] = res
    http_log[log_key] = http_log_data
    print(f'{i}-{http_log[log_key]["URL"]}')

    
    

def set_cookies(response):
    for req_headers in response.request.headers:
        if req_headers == 'Cookie':
            cookies_data.update(
                {str(response.request.headers[req_headers]).split('=')[0]: str(response.request.headers[req_headers]).split('=')[1]})
    for res_headers in response.headers:
        if res_headers == 'Set-Cookie':
            cookies_data.update(
                {str(response.headers[res_headers]).split(';')[0].split('=')[0]: str(response.headers[res_headers]).split(';')[0].split('=')[1]})
    # print(response.cookies)

def get_links(response,soup):
    links = soup.find_all('a', href=True)
    for link in links:
        link = link.get('href')
        if link in visited_urls:
            continue
        if link != ('#' or '/'):
            if not link.startswith('http'):
                if link.startswith('/'):
                    link = scope_url[:-1] + link
                else:
                    link = scope_url + link
            if link.startswith(scope_url) and not link.endswith(('pdf', 'xls', 'docx')):
                totalurl.append(link)
                crawl(link)

@app.route("/crawl", methods=['POST'])
def crawl_endpoint():
    global scope_url, totalurl, visited_urls, http_log, i,Host,cookies_data
    try:
        totalurl = []  
        visited_urls = [] 
        cookies_data = {}
        http_log = {} 
        i = 1
       
        project_name = request.json['project_name']
        user = request.json['authUser']  
        scope_url = request.json['url']  
        Host = urlparse(scope_url).netloc
        description_name = request.json['description']
        crawl(scope_url)
    
      

        csv_name = f"{project_name}.csv"
        csv_show = f"{project_name}_data.csv"
        db = mysql.connection.cursor()
        insert_query11 =('INSERT INTO project(PName,PTarget,PDes,username) VALUES(%s, %s, %s, %s)')
        values11=(project_name,scope_url,description_name,user)
        db.execute(insert_query11, values11)
        mysql.connection.commit()

        with open(csv_name, "w", encoding='utf-8') as f:
            fieldnames = ['no.', 'URL', 'METHOD', 'URI', 'Host', 'HTTPVer', 'requestheader', 'requestbody', 'status', 'reason', 'responseheader', 'responsebody']
            data = csv.DictWriter(f, fieldnames=fieldnames)
            data.writeheader()
        

            for k in range(1,i):
                url_str = unquote(http_log[str(k)]['URL'])
                method_str = str(http_log[str(k)]['request']['METHOD'])
                URI_str = unquote(http_log[str(k)]['request']['URI'])
                Host_str = str(http_log[str(k)]['request']['Host'])
                HTTPVer_str = str(http_log[str(k)]['request']['httpver'])
                requestheader_str = str(http_log[str(k)]['request']['header'])
                requestbody_str = str(http_log[str(k)]['request']['body'])
                status_str = str(http_log[str(k)]['response']['status'])
                reason_str = str(http_log[str(k)]['response']['reason'])
                responseheader_str = str(http_log[str(k)]['response']['header'])
                responsebody_str = base64.b64encode(http_log[str(k)]['response']['body'].encode()).decode('utf-8')

                rowdata = {
                    'no.': k,
                    'URL': url_str,
                    'METHOD': method_str,
                    'URI': URI_str,
                    'Host': Host_str,
                    'HTTPVer': HTTPVer_str,
                    'requestheader': requestheader_str,
                    'requestbody': requestbody_str,
                    'status': status_str,
                    'reason': reason_str,
                    'responseheader': responseheader_str,
                    'responsebody': responsebody_str
                }
                data.writerow(rowdata)



                
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
                url_str = (urllib.parse.unquote(http_log[str(k)]['URL']))
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
        return jsonify({"error": str(e)})
    
    

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
        return jsonify({"error": str(e)})





@app.route("/onedata", methods=['GET'])
def onedata():
    try:
        user = request.args.get('user') 
        project_name_id = request.args.get('project_name_id') 
        db = mysql.connection.cursor()
        
        query = """ 
            SELECT tbl1.URL, tbl1.METHOD, tbl1.statuscode
            FROM urllist tbl1
            JOIN project tbl2 ON tbl1.PID = tbl2.PID
            WHERE tbl2.username = %s AND tbl2.PID = %s"""
        
        db.execute(query, (user, project_name_id))
        crawl_data = db.fetchall()
        db.close()

        return jsonify({"crawl_data": crawl_data})
    except Exception as e:
        return jsonify({"error": str(e)})
    





@app.route("/onedelete", methods=['DELETE'])
def onedelete():
    try :
        user = request.args.get('user')   
        project_name_id = request.args.get('project_name_id')    
           
        db = mysql.connection.cursor()
        delete_crawl_query = "DELETE FROM urllist WHERE PID = %s"
        db.execute(delete_crawl_query, (project_name_id,))
        delete_project_query = "DELETE FROM project WHERE PID = %s AND username = %s"
        db.execute(delete_project_query, (project_name_id, user))
        mysql.connection.commit()
        db.close()

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"error": str(e)})



# @app.route("/dashboard", methods=['GET'])
# def dashboard():
#     try:
#         user = request.args.get('user')
#         project_name_id = request.args.get('project_name_id')
#         db = mysql.connection.cursor()
#         query = "SELECT PTarget FROM project WHERE username = %s AND PID= %s"
#         db.execute(query, (user, project_name_id))
#         urls = db.fetchall()

#         json_payload = '''
# {
#   "payload": ["\\\"%22--%3E%3C/style%3E%3C/script%3E%3Cscript%3Eshadowlabs(0x000045)%3C/script%3E", "asdaasd","v"]
# }
# '''

#         data = json.loads(json_payload)
#         payload = data.get("payload")
#         url_item_all = []


#         for item in payload:
#             for url in urls:
#                 url_item = url[0] + item
#                 url_item_all.append(url_item)

#         return jsonify({"url": url_item_all})
#     except Exception as e:
#         return jsonify({"error": str(e)})






# @app.route("/dashboard", methods=['GET'])
# def dashboard():
#     try:
#         user = request.args.get('user')
#         project_name_id = request.args.get('project_name_id')
#         db = mysql.connection.cursor()
#         query = "SELECT res_header,URL FROM urllist WHERE  PID= %s"
#         db.execute(query, (project_name_id))
#         res_header_Server = db.fetchall()
#         Web_Server = 'Server:'
#         url_web_server = []
#         for res_header_list_Server,url in res_header_Server:
#             if res_header_list_Server.find(Web_Server) != -1:
#                 web = res_header_list_Server.find(Web_Server)
#                 url_web_server.append(url)
#                 print(f'{web}')
#                 print(f'พบ Server URL: {url}')
#             else:
#                 print(f'ไม่พบ:{url}')

#         return jsonify({"url": url_web_server})
#     except Exception as e:
#         return jsonify({"error": str(e)})





@app.route("/dashboard", methods=['GET'])
def dashboard():
    try:
        project_name_id = request.args.get("project_name_id")
        db = mysql.connection.cursor()
        query = "SELECT res_header,URL FROM urllist WHERE  PID= %s"
        db.execute(query,(project_name_id))
        res_header_Cookies = db.fetchall()
        Set_Cookie = 'Set-Cookie'
        Secure_Header = 'Secure'
        HttpOnly_Header = 'HttpOnly'
        Expires_Header = 'Expires'
        SameSite_Header = 'SameSite'
        url_web_Secure = []
        url_web_HttpOnly = []
        url_web_Expires = []
        url_web_SameSite = []
        for res_header_list_Secure,url in res_header_Cookies:

            if res_header_list_Secure.find(Set_Cookie) != -1:
                print(f'พบ Set-Cookie ที่ URL: {url}')
                if res_header_list_Secure.find(Secure_Header) != -1:
                    web = res_header_list_Secure.find(Secure_Header)
                    print(f'พบ Secure URL: {url}')
                else:
                    url_web_Secure.append(url)
                    print(f'ไม่พบ Secure:{url}')


                if res_header_list_Secure.find(HttpOnly_Header) != -1:
                    web = res_header_list_Secure.find(HttpOnly_Header)
                    print(f'พบ HttpOnly URL: {url}')
                else:
                    url_web_HttpOnly.append(url)
                    print(f'ไม่พบ HttpOnly:{url}')

                if res_header_list_Secure.find(Expires_Header) != -1:
                    web = res_header_list_Secure.find(Expires_Header)
                    print(f'{web}')
                    print(f'พบ Expires URL: {url}')
                else:
                   url_web_Expires.append(url)
                   print(f'ไม่พบ Expires:{url}')


                if res_header_list_Secure.find(SameSite_Header) != -1:
                    web = res_header_list_Secure.find(SameSite_Header)
                    print(f'{web}')
                    print(f'พบ SameSite URL: {url}')
                else:
                    url_web_SameSite.append(url)
                    print(f'ไม่พบ SameSite:{url}')


        return jsonify({"Secure":url_web_Secure},{"HttpOnly":url_web_HttpOnly},{"Expires":url_web_Expires},{"SameSite":url_web_SameSite})
    except:
       return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)