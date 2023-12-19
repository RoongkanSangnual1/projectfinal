from cmath import e
from flask import Flask, request, jsonify ,Response
from flask_cors import CORS
import numpy as np
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote
import csv
import base64
from flask_mysqldb import MySQL
import json
import jwt


app = Flask(__name__)
CORS(app)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'robo'

mysql = MySQL(app)



def crawl(url):
    if len(visited_urls) >= MAX_VISITED_URLS:
        return
    
    else:
        if url not in visited_urls:
            visited_urls.append(url)
            response = get_response(url)
            if response is not None:
                if urlparse(response.url).netloc == Host:
 
                    re_location = 'None'
                    soup = BeautifulSoup(response.text, 'lxml')
                    formlist = findActForm(soup)
                    if format != {}:
                        i = 1
                        save_log(response, i,formlist)
                        i += 1
                        i = checkAct(formlist,i)
                        
                    else:
                        save_log(response, i)
                   
                        i += 1
                    
                        
                    
                    print(f'Collect.. {response.url} -> {response.status_code} ..is {response.is_redirect} to {re_location}')
                    checkRedirect(response)
                    get_links(soup)
                    
        else:
            return


def checkRedirect(response):
    if response.status_code in (301,302):
        re_location = response.headers.get('Location')
        if re_location:
            if not re_location.startswith('http'):
                if re_location.startswith('/'):
                    crawl(baseURL+re_location)
                else:
                    crawl(baseURL+'/'+re_location)
            else:
                crawl(re_location)



def post_response(url,postbody=None):
    try:
        response = requests.post(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},
                                cookies=cookies_data,allow_redirects=False,data=postbody)
        response.raise_for_status()
        set_cookies(response)
        return response
    except requests.exceptions.RequestException as e:
        print(f"HTTP error: {e}")
        print(f'Cannot request: {url}')
        return None


def get_response(url,payload=None):
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},
                                cookies=cookies_data,allow_redirects=False,params=payload)
        response.raise_for_status()
        set_cookies(response)
        return response
    except requests.exceptions.RequestException as e:
        print(f"HTTP error: {e}")
        print(f'Cannot request: {url}')
        return None 
                
k = 0              
def save_log(response, i,formlist=None):
    global req,res,user,project_name,http_log_data,k
    k += 1
    log_key = str(i)
    http_log_data = {}
    if response.raw.version == 10:
        http_ver = 'HTTP/1.0'
    elif response.raw.version == 11:
        http_ver = 'HTTP/1.1'
    elif response.raw.version == 20:
        http_ver = 'HTTP/2'
    elif response.raw.version == 30:
        http_ver = 'HTTP/3'
    else:
        http_ver = 'unknown'
    if response.status_code in (301,302):
        re_location = response.headers.get('Location')
    else:
        re_location = 'NONE'
    req = {
        'METHOD': response.request.method,
        'URI': urlparse(response.request.path_url).path,
        'Host': Host,
        'httpver': http_ver,
        'header': response.request.headers,
        'body': response.request.body
    }
    res = {
        'status': response.status_code,
        'reason': response.reason,
        'isredirect': response.is_redirect,
        'redirect_to' : re_location,
        'ActionFound' : formlist,
        'header': response.headers,
        'body': response.text,
        'clength': len(response.text)
    }
    http_log_data['URL'] = response.url
    http_log_data['request'] = req
    http_log_data['response'] = res
    # http_log[log_key] = http_log_data
    # print(f'{i}-{http_log[log_key]["URL"]}')




    db = mysql.connection.cursor()
    select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
    db.execute(select_project_name_id_query, (project_name, user))
    project_name_id_result = db.fetchall()

    insert_query = (
        "INSERT INTO urllist (URL, method, URI, Host, HTTPVer, status_code, reason,length, isredirect,redirect_to, ActionFound, req_header, req_body, res_header, res_body, PID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s)"
    )
    values = (
        str(http_log_data['URL']),
        str(req['METHOD']),
        str(req['URI']),
        str(req['Host']),
        str(req['httpver']),
        str(res['status']),
        str(res['reason']),
        str(res['clength']),
        str(res['isredirect']),
        str(res['redirect_to']),
        str(res['ActionFound']),
        str(res['header']),
        str(req['body']),
        str(res['header']),
        base64.b64encode(res['body'].encode()).decode('utf-8'),
        project_name_id_result[0],
    )
    db.execute(insert_query, values)
    mysql.connection.commit()
    db.close()
    # http_log[log_key] = http_log_data
    # print(f'{i}-{http_log[log_key]["URL"]}')
    csv_name = f"{project_name}.csv"
    with open(csv_name, "a", encoding='utf-8') as f:
        fieldnames = ['no.', 'URL', 'METHOD', 'URI', 'Host', 'HTTPVer', 'status', 'reason', 'length', 'isredirect',
                      'redirect_to', 'ActionFound', 'requestheader', 'requestbody', 'responseheader', 'responsebody']
        data = csv.DictWriter(f, fieldnames=fieldnames)
        url_str = str(http_log_data['URL'])
        method_str = str(req['METHOD'])
        path_str = str(req['URI'])
        Host_str = str(req['Host'])
        HTTPVer_str = str(req['httpver'])
        status_str =str(res['status'])
        reason_str =str(res['reason'])
        clength_str = str(res['clength'])
        isredirect_str =str(res['isredirect'])
        redirect_to_str = str(res['redirect_to'])
        actionfound_str =str(res['ActionFound'])
        requestheader_str = str(req['header'])
        requestbody_str = str(req['body'])
        responseheader_str = str(res['header'])
        responsebody_str = base64.b64encode(res['body'].encode()).decode('utf-8')


    #     db = mysql.connection.cursor()
    #     select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
    #     db.execute(select_project_name_id_query,(project_name, user))             
    #     project_name_id_result = db.fetchall()   
        
    #     insert_query = ("INSERT INTO urllist (URL, method, URI, Host, HTTPVer, status_code, reason, req_header, req_body, res_header, res_body, PID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    #     values = (url_str, method_str, path_str, Host_str, HTTPVer_str, status_str, reason_str, requestheader_str, requestbody_str, responseheader_str, responsebody_str, project_name_id_result[0])
    #     db.execute(insert_query, values)
    #     mysql.connection.commit()
        rowdata = {
            'no.': k,
            'URL': url_str,
            'METHOD': method_str,
            'URI': path_str,
            'Host': Host_str,
            'HTTPVer': HTTPVer_str,
            'status': status_str,
            'reason': reason_str,
            'length': clength_str,
            'isredirect': isredirect_str,
            'redirect_to': redirect_to_str,
            'ActionFound': actionfound_str,
            'requestheader': requestheader_str,
            'requestbody': requestbody_str,
            'responseheader': responseheader_str,
            'responsebody': responsebody_str
        }
        data.writerow(rowdata)

    # db.close()
        


    
    

def set_cookies(response):
    for req_headers in response.request.headers:
        if req_headers == 'Cookie':
            cookies_data.update(
                {str(response.request.headers[req_headers]).split('=')[0]: str(response.request.headers[req_headers]).split('=')[1]})
    for res_headers in response.headers:
        if res_headers == 'Set-Cookie':
            cookies_data.update(
                {str(response.headers[res_headers]).split(';')[0].split('=')[0]: str(response.headers[res_headers]).split(';')[0].split('=')[1]})



def get_links(soup):
    links = soup.find_all('a', href=True)
    for link in links:
        link = link.get('href')
        if link in visited_urls:
            continue
        if link != ('#' or '/'):
            if not link.startswith('http'):
                if link.startswith('/'):
                    link = baseURL + link
                else:
                    link = baseURL+'/' + link
            if link.startswith(scope_url) and not link.endswith(('pdf', 'xls', 'docx')):
                crawl(link)



def findActForm(soup):
    formlist = {}
    forms = soup.find_all('form')
    for form in forms:
        if form.get('id') is not None:
            formid = form.get('id')
        elif form.get('class') is not None:
            formid = form.get('class')[0]
        else:
            formid = 'unknown'
        act = form.get('action')
        met = form.get('method')
        formdetail = {}
        parameters = {}
        for input_element in form.find_all('input'):
            name = input_element.get('name')
            value = input_element.get('value', '')
            input_type = input_element.get('type', '')
            # Check for the presence of the required attribute in any form of capitalization
            required = 'required' in [attr.lower() for attr in input_element.attrs]
            paramsdetail = {'required': required, 'type': input_type,'value': value}
            parameters[name] = paramsdetail

        for select_element in form.find_all('select'):
            name = select_element.get('name')
            input_type = 'select'
            required = 'required' in [attr.lower() for attr in select_element.attrs]
            # Collect all option values
            options = select_element.find_all('option')
            option_values = [option.get('value', '') for option in options]
            paramsdetail = {'required': required, 'type': input_type, 'value': option_values}
            parameters[name] = paramsdetail
        formdetail['action'] = act
        formdetail['method'] = met
        formdetail['parameters'] = parameters
        formlist[formid] = formdetail

    
    return formlist
def checkAct(formlist,i):
    temppost = ''
    data = {}
    posttemp = set()
    for tempAct in formlist:
        print(tempAct)
        print('Act: ' + formlist[str(tempAct)]['action'])
        print('method: ' + str(formlist[str(tempAct)]['method']))
        Params = formlist[str(tempAct)]['parameters']
        print('params :' + str(Params))

        for p in Params:
            #ข้อมูลjsonของparameterแต่ละตัว
            Pinfo = Params[p]
            #วนจบครบทุกพารามิเตอร์
            if isinstance(Pinfo['value'], list):
                #เช็คว่าเป็นตัวแปรselectมั้ย ถ้าใช่เอาค่าเดียวก็พอมาเป็นเบสไลน์
                temppost += str(p) + '=' + str(Pinfo['value'][0]) + '&'
                data.update({str(p): Pinfo['value'][0]})
                posttemp.add(str(p))
            else:
                temppost += str(p) + '=' + str(Pinfo['value']) + '&'
                data.update({str(p): Pinfo['value']})
                posttemp.add(str(p))
            # print('+++++++++')
        
        print(baseURL+formlist[str(tempAct)]['action'])
        print(temppost[:-1])  # Remove the trailing '&'
        print(posttemp)
        
        if formlist[str(tempAct)]['action'].startswith('/'):
            acturl = baseURL+formlist[str(tempAct)]['action']
        else:
            acturl = baseURL+'/'+formlist[str(tempAct)]['action']
        print('acturl: '+acturl)
        if str(formlist[str(tempAct)]['method']) == 'GET' :
            try:
                
                if acturl not in visited_urls:
                    visited_urls.append(acturl)
                    response = get_response(acturl, data)
                    print('R:'+response.url)
                    if response is not None:
                        visited_urls.append(response.url)
                        save_log(response, i,formlist)
                        i = i+1
            except Exception as e:
                print('checkact error:', e)
            
        elif formlist[str(tempAct)]['method'] == 'POST':
            try:
                response = post_response(acturl, data)
                
                if response is not None:
                    if acturl not in visited_post:
                        visited_post[acturl] = set()
                    if (acturl in visited_post) and ((tuple(sorted(posttemp))) not in visited_post[acturl]): 
                        visited_post[acturl].add(tuple(sorted(posttemp)))
                        save_log(response, i,formlist)
                        i=i+1


            except Exception as e:
                print('checkact error2:', e)
            
        data ={}
        tempAct = ''
        temppost = ''
        

    return i





# k = 0
@app.route("/crawl", methods=['POST'])
def crawl_endpoint():
    global scope_url, csv_name, project_name, user, MAX_VISITED_URLS, visited_post, visited_urls, http_log_data, i, Host, cookies_data, baseURL, k
    try:
        MAX_VISITED_URLS = 100
        visited_urls = []
        visited_post = {}
        cookies_data = {}
        http_log_data = {}
        res = {}
        req = {}
        i = 1

        project_name = request.json['project_name']
        user = request.json['authUser']
        scope_url = request.json['url']
        Host = urlparse(scope_url).netloc
        baseURL = urlparse(scope_url).scheme + '://' + urlparse(scope_url).netloc
        description_name = request.json['description']
        print(i)
        print(visited_urls)
        print(visited_post)
        # k += 1

        csv_name = f"{project_name}.csv"
        # csv_show = f"{project_name}_data.csv"

        db = mysql.connection.cursor()
        insert_query11 = ('INSERT INTO project(PName,PTarget,PDes,username) VALUES(%s, %s, %s, %s)')
        values11 = (project_name, scope_url, description_name, user)
        db.execute(insert_query11, values11)
        mysql.connection.commit()
        csv_name = f"{project_name}.csv"
        
        crawl(scope_url)


        # with open(csv_name, "w", encoding='utf-8') as f:
        #     fieldnames = ['no.', 'URL', 'METHOD', 'URI', 'Host', 'HTTPVer', 'status', 'reason','length','isredirect','redirect_to','ActionFound'
        #               ,'requestheader', 'requestbody','responseheader', 'responsebody']
        #     data = csv.DictWriter(f, fieldnames=fieldnames)
        #     data.writeheader()
        

        # for k in range(1, i):
        #     #ดูไม่รู้เรื่องเดี๋ยวค่อยกลับมาencode
        #     #url_str = base64.b64encode((http_log[str(k)]['URL']).encode()).decode('utf-8')
        #     url_str = http_log_data['URL']
        #     method_str = req['METHOD']
        #     path_str = req['URI']
        #     host_str = req['Host']
        #     httpver_str = req['httpver']
        #     status_str = res['status']
        #     reason_str = res['reason']
        #     clength_str = res['clength']
        #     isredirect_str = res['isredirect']
        #     redirect_to_str = res['redirect_to']
        #     actionfound_str = res['ActionFound']
        #     requestheader_str = str(req['header'])
        #     requestbody_str = str(req['body'])
        #     responseheader_str = str(res['header'])
        #     responsebody_str = base64.b64encode(res['body'].encode()).decode('utf-8')
        #     rowdata = {
        #     'no.': i,
        #     'URL': url_str,
        #     'METHOD': method_str,
        #     'URI': path_str,
        #     'Host': host_str,
        #     'HTTPVer': httpver_str,
        #     'status': status_str,
        #     'reason': reason_str,
        #     'length': clength_str,
        #     'isredirect': isredirect_str,
        #     'redirect_to': redirect_to_str,
        #     'ActionFound': actionfound_str,
        #     'requestheader': requestheader_str,
        #     'requestbody': requestbody_str,
        #     'responseheader': responseheader_str,
        #     'responsebody': responsebody_str
        # }
        #     data.writerow(rowdata)


                
        db = mysql.connection.cursor()
        select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
        db.execute(select_project_name_id_query,(project_name, user))             
        project_name_id_result = db.fetchall()   
        
        # insert_query = ("INSERT INTO urllist (URL, method, URI, Host, HTTPVer, status_code, reason, req_header, req_body, res_header, res_body, PID) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        # values = (url_str, method_str, URI_str, Host_str, HTTPVer_str, status_str, reason_str, requestheader_str, requestbody_str, responseheader_str, responsebody_str, project_name_id_result[0])
        # db.execute(insert_query, values)
        # mysql.connection.commit()
        # db.close()






        # with open(csv_show, "w", encoding='utf-8') as f:
        #     fieldnames = ['no.', 'URL', 'METHOD',   'status']
        #     data = csv.DictWriter(f, fieldnames=fieldnames)
        #     data.writeheader()
        

        #     for k in range(1, i):
        #         url_str = base64.b64encode(http_log[str(k)]['URL'].encode()).decode('utf-8')
        #         method_str = str(http_log[str(k)]['request']['METHOD'])
        #         status_str = str(http_log[str(k)]['response']['status'])
        #         rowdata2 = {
        #             'no.': k,
        #             'URL': url_str,
        #             'METHOD': method_str,                
        #             'status': status_str,
        #         }
        #         data.writerow(rowdata2)

                
        # with open(csv_show,'rb') as csv_file:
        #     csv_read = csv_file.read()
        #     s = Response(csv_read,content_type='text/csv')
        #     s.headers['Content-Disposition']=f'attrachment; filename="{csv_show}"'
        #     csv_file.close()
        return ({"project_name_id_result":project_name_id_result})
    except Exception as e:
        return jsonify({"server error": str(e)})
    
    
@app.route("/home", methods=['GET'])
def home():
    try:
        token = request.headers.get('Authorization').split(' ')[1]      
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)


        db = mysql.connection.cursor()
        query = "SELECT PDes, PName, PID FROM project WHERE username = %s"
        db.execute(query, (user_data,))
        project_data = db.fetchall()
        db.close()
        print(project_data)

        return jsonify({"project_data": project_data})
    except Exception as e:
        return jsonify({"server error": str(e)})



@app.route("/onedata", methods=['GET'])
def onedata():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token,'jwtSecret',algorithms=["HS256"])['user']
        user_data = user.get('username',None)
        project_name_id = request.args.get('project_name_id')
        db = mysql.connection.cursor()

        query = """
            SELECT tbl1.URL, tbl1.method, tbl1.status_code
            FROM urllist tbl1
            JOIN project tbl2 ON tbl1.PID = tbl2.PID
            WHERE tbl2.username = %s AND tbl2.PID = %s
        """

        db.execute(query, (user_data, project_name_id))
        crawl_data = db.fetchall()
        # print(crawl_data)

        # query2 = "SELECT URL FROM urllist WHERE PID = %s "
        # db.execute(query2, (project_name_id))
        # crawl_data2 = db.fetchall()
        # # print(crawl_data2)
        # db.close()


        # decoded_strings = []

        # for row in crawl_data2:
        #     encoded_string = row[0]
        #     decoded_bytes = base64.urlsafe_b64decode(encoded_string)
        #     decoded_string = decoded_bytes.decode('utf-8')
        #     decoded_strings.append(decoded_string)
        #     print(decoded_strings)

        return jsonify({"crawl_data": crawl_data})
    except Exception as e:
        return jsonify({"server error": str(e)})

    

@app.route("/onedelete", methods=['DELETE'])
def onedelete():
    try :
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token,'jwtSecret',algorithms=['HS256'])['user']   
        user_data=user.get('username',None)
        project_name_id = request.args.get('project_name_id')    
           
        db = mysql.connection.cursor()
        delete_crawl_query = "DELETE FROM urllist WHERE PID = %s"
        db.execute(delete_crawl_query, (project_name_id,))
        delete_project_query = "DELETE FROM project WHERE PID = %s AND username = %s"
        db.execute(delete_project_query, (project_name_id, user_data))
        mysql.connection.commit()
        db.close()

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error": str(e)})








@app.route("/dashboard", methods=['GET'])
def dashboard():
    try:
        project_name_id = request.args.get("project_name_id")
        db = mysql.connection.cursor()
        query = "SELECT res_header,URL FROM urllist WHERE PID= %s"
        db.execute(query,(project_name_id,))
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
                else:
                    url_web_Secure.append(url)
                    print(f'ไม่พบ Secure:{url}')


                if res_header_list_Secure.find(HttpOnly_Header) != -1:
                    web = res_header_list_Secure.find(HttpOnly_Header)
                else:
                    url_web_HttpOnly.append(url)
                    print(f'ไม่พบ HttpOnly:{url}')

                if res_header_list_Secure.find(Expires_Header) != -1:
                    web = res_header_list_Secure.find(Expires_Header)
                    print(f'{web}')
                else:
                   url_web_Expires.append(url)
                   print(f'ไม่พบ Expires:{url}')


                if res_header_list_Secure.find(SameSite_Header) != -1:
                    web = res_header_list_Secure.find(SameSite_Header)
                    print(f'{web}')
                else:
                    url_web_SameSite.append(url)
                    print(f'ไม่พบ SameSite:{url}')
                print(url_web_Secure)
                print(url_web_HttpOnly)
                print(url_web_Expires)
                print(url_web_SameSite)

        
        

        return jsonify({"Secure":url_web_Secure},{"HttpOnly":url_web_HttpOnly},{"Expires":url_web_Expires},{"SameSite":url_web_SameSite})
    except:
       return jsonify({"server error": str(e)})



# ยิงjson
# @app.route("/dashboard", methods=['GET'])
# def jsonnn():
#     try:
#         db = mysql.connection.cursor()
#         query = "SELECT payloadlist FROM owasp WHERE OID = 5"
#         db.execute(query)
#         res_payloadlist = db.fetchall()   
#         #print(res_payloadlist)
#         resssss=[] 
#         if res_payloadlist:
#             json_data_str = res_payloadlist[0][0]
      
            
#            #json_data_str = json_data_str.replace('"',"'")
#             json_data_str = json.loads(json_data_str)
#             res =[]
#             index = 0
#             for i in json_data_str['payload']:
#                 resssss.append(i)
#                 index +=1
             
#             # res  = resssss
#             # print(*resssss, sep = ", ")

            

#             print(resssss[49])
                 
            
            
                
            
            
            
            

#         return jsonify("Error:")
#         # return jsonify(payload_list)
#     except Exception as e:
#         print(f"Error: {e}")
 
 
if __name__ == "__main__":
    app.run(debug=True) 