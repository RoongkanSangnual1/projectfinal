from flask import Flask, request, jsonify ,Response
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
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
    if len(visited_urls) > 100:
        return
    else:
        if url not in visited_urls:
            visited_urls.append(url)
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},cookies=cookiesdata)
            if response.status_code != 200:
                print('Cannot request:', response.url)
                return
            else:
                setcookies(response)
                print('Collect.. '+response.url)
                savelog(response,i)
                i = i+1
                soup = BeautifulSoup(response.text, 'lxml')
                get_links(soup)
                
                

def savelog(response,i):
    
    log_key = str(i)
    httplogdata = {}
    req = {}
    res = {}
    if response.raw.version == 10:
        httpver = 'HTTP/1.0'
    elif response.raw.version == 11:
        httpver = 'HTTP/1.1'
    
    req['METHOD'] = response.request.method
    req['URI'] = response.request.path_url
    req['Host'] = urlparse(response.url).netloc
    req['httpver'] = httpver
    req['header'] = response.request.headers
    req['body'] = response.request.body

    # res['httpver'] = httpver
    res['status'] = response.status_code
    res['reason'] = response.reason
    res['header'] = response.headers
    res['body'] = response.text
    httplogdata['URL'] = response.url
    httplogdata['request'] = req
    httplogdata['response'] = res
    httplog[log_key] = httplogdata
    print(str(i)+'-'+httplog[log_key]['URL'])
    
    
    

#logic not correct yet
def setcookies(response):
    for req_headers in response.request.headers:
        if (req_headers=='Cookie'):
            cookiesdata.update({str(response.request.headers[req_headers]).split('=')[0] : str(response.request.headers[req_headers]).split('=')[1]} )

    for res_headers in response.headers:
        if (res_headers=='Set-Cookie'):
            cookiesdata.update({str(response.headers[res_headers]).split(';')[0].split('=')[0] : str(response.headers[res_headers]).split(';')[0].split('=')[1]} )


#logic not correct yet
def findform(url,soup):
    parameters={}
    form = soup.find('form')
    if form:
        for input_element in form.find_all('input'):
            name = input_element.get('name')
            value = input_element.get('value', '')
            parameters[name] = value
            print(parameters)
        del parameters    
        
            
            
    else:
        print(url+'has no params')
        return


def get_links(soup):
    
    links = soup.find_all('a', href=True)
    for link in links:
        link = link.get('href')
        if link in totalurl:
            return
        else:
            if link != ('#' or '/'):
                if not link.startswith('http'):
                    if link.startswith('/'):
                        link = scope_url[:-1] + link
                    else:
                        link =  scope_url + link
                if not link.startswith(scope_url):
                    continue
                elif  (link not in totalurl )and not link.endswith('pdf') and not link.endswith('xls') and not link.endswith('docx'):
                    # print(link)
                    totalurl.append(link)
                    crawl(link)



@app.route("/crawl", methods=['POST'])
def crawl_endpoint():
    global scope_url, totalurl, visited_urls, cookiesdata, httplog, i
    try:
        totalurl = []  
        visited_urls = [] 
        cookiesdata = {} 
        httplog = {} 
        i = 1
        project_name = request.json['project_name']
        user = request.json['authUser']  
        scope_url = request.json['url']  
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
                url_str = (urllib.parse.unquote(httplog[str(k)]['URL']))
                method_str = str(httplog[str(k)]['request']['METHOD'])
                URI_str = urllib.parse.unquote(httplog[str(k)]['request']['URI'])
                Host_str = str(httplog[str(k)]['request']['Host'])
                HTTPVer_str = str(httplog[str(k)]['request']['httpver'])
                requestheader_str = str(httplog[str(k)]['request']['header'])
                requestbody_str = str(httplog[str(k)]['request']['body'])
                status_str = str(httplog[str(k)]['response']['status'])
                reason_str = str(httplog[str(k)]['response']['reason'])
                responseheader_str = str(httplog[str(k)]['response']['header'])
                responsebody_str =base64.b64encode((httplog[str(k)]['response']['body'].encode())).decode('utf-8')

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
                select_project_name_id_query = "SELECT PID	 FROM project WHERE PName = %s AND  username = %s"
                db.execute(select_project_name_id_query,(project_name, user))             
                project_name_id_result = db.fetchall()   
        
                insert_query = ("INSERT INTO urllist (URL, METHOD, URI, Host, HTTPVer, statuscode, reason, req_header, req_body, res_header, res_body, PID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
                values = (url_str, method_str, URI_str, Host_str, HTTPVer_str, status_str, reason_str, requestheader_str, requestbody_str, responseheader_str, responsebody_str, project_name_id_result[0])
                db.execute(insert_query, values)
                mysql.connection.commit()
                db.close()






        with open(csv_show, "w", encoding='utf-8') as f:
            fieldnames = ['no.', 'URL', 'METHOD',   'status']
            data = csv.DictWriter(f, fieldnames=fieldnames)
            data.writeheader()
        

            for k in range(1, i):
                url_str = (urllib.parse.unquote(httplog[str(k)]['URL']))
                method_str = str(httplog[str(k)]['request']['METHOD'])
                status_str = str(httplog[str(k)]['response']['status'])
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



@app.route("/dashboard", methods=['GET'])
def dashboard():
    try:
        user = request.args.get('user')
        project_name_id = request.args.get('project_name_id')
        db = mysql.connection.cursor()
        query = "SELECT PTarget FROM project WHERE username = %s AND PID= %s"
        db.execute(query, (user, project_name_id))
        urls = db.fetchall()

        json_payload = '''
{
  "payload": ["\\\"%22--%3E%3C/style%3E%3C/script%3E%3Cscript%3Eshadowlabs(0x000045)%3C/script%3E", "asdaasd","v"]
}
'''

        data = json.loads(json_payload)
        payload = data.get("payload")
        url_item_all = []

        for item in payload:
            for url in urls:
                url_item = url[0] + item
                url_item_all.append(url_item)

        return jsonify({"url": url_item_all})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)