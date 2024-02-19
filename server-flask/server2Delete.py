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
import subprocess
import os
from concurrent.futures import ThreadPoolExecutor
import asyncio
import math

app = Flask(__name__)
CORS(app)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'robo'

mysql = MySQL(app)



async def crawl(url,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post):
    if len(visited_urls) >= MAX_VISITED_URLS:
        return
    
    else:
        if url not in visited_urls:
            print(url,project_name,user,Host,baseURL,)
            visited_urls.append(url)
            response = await get_response(url,cookies_data)
            if response is not None:
                if urlparse(response.url).netloc == Host:
 
                    re_location = 'None'
                    soup = BeautifulSoup(response.text, 'lxml')
                    formlist = await findActForm(soup)
                    if format != {}:
                        i = 1
                        await save_log(response, i,project_name,user,Host,http_log_data,formlist)
                        i += 1
                        i = await checkAct(formlist,i,project_name,user,baseURL,Host,cookies_data,http_log_data,visited_urls,visited_post)
                        
                    else:
                        await save_log(response, i,project_name,user,Host,http_log_data)
                   
                        i += 1
                    
                        
                    
                    print(f'Collect.. {response.url} -> {response.status_code} ..is {response.is_redirect} to {re_location}')
                    await checkRedirect(response,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
                    await get_links(soup,project_name,user,baseURL,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
                    
        else:
            return


async def checkRedirect(response,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post):
    if response.status_code in (301,302):
        re_location = response.headers.get('Location')
        if re_location:
            if not re_location.startswith('http'):
                if re_location.startswith('/'):
                    await crawl(baseURL+re_location,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
                else:
                    await crawl(baseURL+'/'+re_location,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
            else:
                await crawl(re_location,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)



async def post_response(url,cookies_data,postbody=None):
    try:
        response = requests.post(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},
                                cookies=cookies_data,allow_redirects=False,data=postbody)
        response.raise_for_status()
        await set_cookies(response,cookies_data)
        return response
    except requests.exceptions.RequestException as e:
        print(f"HTTP error: {e}")
        print(f'Cannot request: {url}')
        return None


async def get_response(url, cookies_data,payload=None):
    try:
        print(f"url", url)
        print(f"cookies_data", cookies_data)
        print(f"get_response", payload)
        payload = {key: value for key, value in (payload or {}).items() if value is not None}
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},
                                cookies=cookies_data, allow_redirects=False, params=payload)
        await set_cookies(response,cookies_data)
        return response
    except requests.exceptions.RequestException as e:
        print(f"HTTP error: {e}")
        print(f'Cannot request: {url}')
        return None

                
           
async def save_log(response, i,project_name,user,Host,http_log_data,formlist=None, state='c'):
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
        "INSERT INTO urllist (URL, method, URI, Host, HTTPVer, status_code, reason,state,length, isredirect,redirect_to, ActionFound, req_header, req_body, res_header, res_body, PID) VALUES (%s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s)"
    )
    values = (
        str(http_log_data['URL']),
        str(req['METHOD']),
        str(req['URI']),
        str(req['Host']),
        str(req['httpver']),
        str(res['status']),
        str(res['reason']),
        state,
        str(res['clength']),
        str(res['isredirect']),
        str(res['redirect_to']),
        str(res['ActionFound']),
        str(req['header']),
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
    # csv_name = f"{project_name}.csv"
    # with open(csv_name, "a", encoding='utf-8') as f:
    #     fieldnames = ['no.', 'URL', 'METHOD', 'URI', 'Host', 'HTTPVer', 'status', 'reason', 'length', 'isredirect',
    #                   'redirect_to', 'ActionFound', 'requestheader', 'requestbody', 'responseheader', 'responsebody']
    #     data = csv.DictWriter(f, fieldnames=fieldnames)
    #     url_str = str(http_log_data['URL'])
    #     method_str = str(req['METHOD'])
    #     path_str = str(req['URI'])
    #     Host_str = str(req['Host'])
    #     HTTPVer_str = str(req['httpver'])
    #     status_str =str(res['status'])
    #     reason_str =str(res['reason'])
    #     clength_str = str(res['clength'])
    #     isredirect_str =str(res['isredirect'])
    #     redirect_to_str = str(res['redirect_to'])
    #     actionfound_str =str(res['ActionFound'])
    #     requestheader_str = str(req['header'])
    #     requestbody_str = str(req['body'])
    #     responseheader_str = str(res['header'])
    #     responsebody_str = base64.b64encode(res['body'].encode()).decode('utf-8')
    #     rowdata = {
    #         'no.': k,
    #         'URL': url_str,
    #         'METHOD': method_str,
    #         'URI': path_str,
    #         'Host': Host_str,
    #         'HTTPVer': HTTPVer_str,
    #         'status': status_str,
    #         'reason': reason_str,
    #         'length': clength_str,
    #         'isredirect': isredirect_str,
    #         'redirect_to': redirect_to_str,
    #         'ActionFound': actionfound_str,
    #         'requestheader': requestheader_str,
    #         'requestbody': requestbody_str,
    #         'responseheader': responseheader_str,
    #         'responsebody': responsebody_str
    #     }
    #     data.writerow(rowdata)

    # db.close()
        



    

async def set_cookies(response,cookies_data):
    for req_headers in response.request.headers:
        if req_headers == 'Cookie':
            cookies_data.update(
                {str(response.request.headers[req_headers]).split('=')[0]: str(response.request.headers[req_headers]).split('=')[1]})
            pass  
    for res_headers in response.headers:
        if res_headers == 'Set-Cookie':
            cookies_data.update(
                {str(response.headers[res_headers]).split(';')[0].split('=')[0]: str(response.headers[res_headers]).split(';')[0].split('=')[1]})
            pass  



async def get_links(soup,project_name,user,scope_url,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post):
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
                await crawl(link,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)



async def findActForm(soup):
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


async def checkAct(formlist,i,project_name,user,baseURL,Host,cookies_data,http_log_data,visited_urls,visited_post):
    temppost = ''
    data = {}
    posttemp = set()
    for tempAct in formlist:
        if tempAct == 'unknown':
            print(f"checkAct: {tempAct}")
            continue 
        print("tempAct",tempAct)
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
        
        print("action",baseURL+formlist[str(tempAct)]['action'])
        print("action",temppost[:-1])  # Remove the trailing '&'
        print("action",posttemp)
        
        if formlist[str(tempAct)]['action'].startswith('/'):
            acturl = baseURL+formlist[str(tempAct)]['action']
        else:
            acturl = baseURL+'/'+formlist[str(tempAct)]['action']
        print('acturl: '+acturl)
        if str(formlist[str(tempAct)]['method']) == 'GET' :
            try:
                
                if acturl not in visited_urls:
                    visited_urls.append(acturl)
                    response = await get_response(acturl,cookies_data, data)
                    print('R:'+response.url)
                    if response is not None:
                        visited_urls.append(response.url)
                        await save_log(response, i,project_name,user,Host,http_log_data,formlist)
                        i = i+1
            except Exception as e:
                print('checkact error:', e)
            
        elif formlist[str(tempAct)]['method'] == 'POST':
            try:
                response = await post_response(acturl,cookies_data, data)
                if response is not None:
                    if acturl not in visited_post:
                        visited_post[acturl] = set()
                    if (acturl in visited_post) and ((tuple(sorted(posttemp))) not in visited_post[acturl]): 
                        visited_post[acturl].add(tuple(sorted(posttemp)))
                        await save_log(response, i,project_name,user,Host,http_log_data,formlist)
                        i=i+1


            except Exception as e:
                print('checkact error2:', e)
            
        data ={}
        tempAct = ''
        temppost = ''
        

    return i


async def contentlenpercent(response,baseper):
    
    per = len(response.content)
    diffper = ((per-baseper)/baseper) * 100
    return diffper


async def checkerr(response):
    errors = {
        # MySQL
        "you have an error in your sql syntax;",
        "warning: mysql",
        # SQL Server
        "unclosed quotation mark after the character string",
        # Oracle
        "quoted string not properly terminated",
    }
    for error in errors:
        if error in response.content.decode().lower():
            return True
    # no error detected
    return False



async def brutesql(att_url, att_params, baseper,select_url_id_data,baseatt_URL,project_name, user,cookies_data_):
    db = mysql.connection.cursor()
    query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.sql')) AS payload FROM owasp WHERE OID=11")
    db.execute(query,)             
    sql_ = db.fetchall() 

    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=11")
    db.execute(query2,)             
    sql2_ = db.fetchall() 
    # print("sql2_[0][0]",sql2_[0][0])
    # print("sql2_[0][1]",sql2_[0][1])
    # print("sql2_[0][2]",sql2_[0][2])
    # print("sql2_[0][2]",sql2_[0][3])
    word_list = json.loads(sql_[0][0])
    # print(word_list)
    wordlist_path = 'wordlistsql.txt'
    with open(wordlist_path, 'w') as file:
        for item in word_list:
            file.write(item + '\n')   
    results = [] 
    f = open(wordlist_path, "r") 
    for payload in f:
        for i in att_params:
            try:
                new_att_params = att_params.copy()
                new_att_params[i] = new_att_params[i] + payload.strip()
                print(f'att_url',new_att_params[i])
                print(f'new_att_params',new_att_params[i])
                response = await get_response(att_url, cookies_data_,new_att_params)
                select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
                db.execute(select_project_name_id_query, (project_name, user))
                project_name_id_result = db.fetchall()
                print(f'select_url_id_data',select_url_id_data[0])
                print(f'project_name_id_result',project_name_id_result[0][0])
                select_url_id_query = "SELECT URL FROM urllist WHERE PID = %s AND URL_ID = %s "
                db.execute(select_url_id_query, (project_name_id_result[0][0],select_url_id_data[0]))
                select_url_id = db.fetchall()
                select_URL_data = select_url_id[0][0]
                # insert_query = (
                #     "INSERT INTO att_ps (URL_ID, PID, OID, URL) VALUES (%s, %s, %s,%s)"
                # )
                # values = (select_url_id_data[0],project_name_id_result[0][0],'11',select_URL_data)
                # db.execute(insert_query, values)
                # mysql.connection.commit()

                print(unquote(response.url))  
                print(len(response.content))
                print(await contentlenpercent(response, baseper))
                vres = False
                if response.status_code == 500:
                    print('SQL found with :' + payload.strip() + 'in ' + i)  
                    vres = True
                    vparams = i
                    results.append((vres, vparams))
                    insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType) VALUES (  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                    )
                    values = (select_url_id_data[0],project_name_id_result[0][0],'11',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                    return vres,vparams
                elif await checkerr(response) == True:
                    print('SQL found with :' + payload.strip() + 'in ' + i) 
                    vres = True
                    vparams = i
                    results.append((vres, vparams))
                    insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType) VALUES ( %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                    )
                    values = (select_url_id_data[0],project_name_id_result[0][0],'11',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                    return vres,vparams
                    # ,response.text,response.request.headers,response.request.body,response.request.method
                elif int(await contentlenpercent(response, baseper)) > 70:
                    print('SQL found with :' + payload.strip() + ' in ' + i)
                    print(int(await contentlenpercent(response, baseper)))
 
                    vres = True
                    vparams = i
                    results.append((vres, vparams))
                    insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType) VALUES (%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                    )
                    values = (select_url_id_data[0],project_name_id_result[0][0],'11',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                    return vres,vparams
                else:
                    print('sqli not found')
            except Exception as e:
                print(f"An error occurred: {str(e)}")

    


async def checkscript(response,payload):
    
    
    if payload.lower() in response.content.decode().lower():
        return True
    # no error detected
    return False

async def brutexss(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data_):
# f = open("wordlistxss-sql.txt", "r", encoding='utf-8')
    db = mysql.connection.cursor()
    query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.xss-sql')) AS payload FROM owasp WHERE OID=10")
    db.execute(query,)
    sql_ = db.fetchall()
    select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
    db.execute(select_project_name_id_query, (project_name, user))
    project_name_id_result = db.fetchall()
    select_url_id_query = "SELECT URL FROM urllist WHERE PID = %s AND URL_ID = %s "
    db.execute(select_url_id_query,
               (project_name_id_result[0][0], select_url_id_data[0]))
    select_url_id = db.fetchall()
    select_URL_data = select_url_id[0][0]
    # print(common)
    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=10")
    db.execute(query2,)             
    sql2_ = db.fetchall() 
    word_list = json.loads(sql_[0][0])
    # print(word_list)
    wordlist_path = 'wordlistxss-sql.txt'
    with open(wordlist_path, 'w') as file:
        for item in word_list:
            file.write(item + '\n')
    results = []
    f = open(wordlist_path, "r")
    for i in att_paramsname:
        f.seek(0)
        for payload in f:
            new_att_params = att_params.copy()
            new_att_params[i] = payload.strip()
            print(new_att_params)
            if payload != '':
                response = await get_response(att_url, cookies_data_,new_att_params)
                print(f"att_url",att_url)  
                print(unquote(response.url))
                # print(len(response.content))
                # print(contentlenpercent(response,baseper))
                vres = False
                
                
                if await checkscript(response,payload.strip()) == True:
                    print('XSS found with : '+ payload.strip()+' in '+ i)
                    vres = True
                    vparams = i
                    insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                    )
                    values = (select_url_id_data[0],project_name_id_result[0][0],'10',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                    return vres,vparams
                elif int(await contentlenpercent(response,baseper)) > 70:
                    print('XSS found with : '+ payload.strip()+' in '+ i) 
                    print(int(await contentlenpercent(response,baseper)))
                    vres = True
                    vparams = i
                    insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                    )
                    values = (select_url_id_data[0],project_name_id_result[0][0],'10',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
                    mysql.connection.commit()
                    return vres,vparams
                else:
                    print('XSS not found w/ '+ payload.strip())



async def brutepathtraversal(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data_):
    db = mysql.connection.cursor()
    query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.pathraversal')) AS payload FROM owasp WHERE OID=4")
    db.execute(query,)
    sql_ = db.fetchall()
    select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
    db.execute(select_project_name_id_query, (project_name, user))
    project_name_id_result = db.fetchall()
    select_url_id_query = "SELECT URL FROM urllist WHERE PID = %s AND URL_ID = %s "
    db.execute(select_url_id_query,
               (project_name_id_result[0][0], select_url_id_data[0]))
    select_url_id = db.fetchall()
    # select_URL_data = select_url_id[0][0]
    # print(common)
    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=4")
    db.execute(query2,)             
    sql2_ = db.fetchall() 
    word_listpathraversal = json.loads(sql_[0][0])
    # print(word_list)
    wordlist_path = 'word_listpathraversal.txt'
    with open(wordlist_path, 'w') as file:
        for item in word_listpathraversal:
            file.write(item + '\n')
    results = []
    f = open(wordlist_path, "r")
    for i in att_paramsname:
        f.seek(0)
        for payload in f:
            new_att_params = att_params.copy()
            new_att_params[i] = payload.strip()
            print(new_att_params)
    
            response = await get_response(att_url, cookies_data_,new_att_params)
            # print(unquote(response.url))  
            # print(len(response.content))
            # print(contentlenpercent(response,baseper))
            vres = False
            
            
            if response.status_code == 200 and (int(await contentlenpercent(response,baseper)) > 70):
                print('[+] Path traversal found with : '+ payload.strip()+' in '+ i + ' case 1')
                print(response.status_code)
                vres = True
                vparams = i
                insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType) VALUES ( %s, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                    )
                values = (select_url_id_data[0],project_name_id_result[0][0],'11',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])               
                db.execute(insert_query, values)
                mysql.connection.commit()
                # return vres,vparams
            
            else:
                print('[-] Path traversal not found w/ '+ payload.strip())
    
    # return vres,vparams


async def detect_pathtraversal(pathtraversal):
    db = mysql.connection.cursor()
    query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.pathraversal')) AS payload FROM owasp WHERE OID=4")
    db.execute(query,)
    sql_ = db.fetchall()
    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=4")
    db.execute(query2,)             
    sql2_ = db.fetchall() 
    # select_URL_data = select_url_id[0][0]
    # print(common)
    word_listpathraversal = json.loads(sql_[0][0])
    # print(word_list)
    wordlist_path = 'word_listpathraversal.txt'
    with open(wordlist_path, 'w') as file:
        for item in word_listpathraversal:
            file.write(item + '\n')
    results = []
    f = open(wordlist_path, "r")
    results = []
    with open(wordlist_path, "r") as f:
            for line in f:
                line = line.strip()  
                for Server_data in pathtraversal:
                    # print(f"res_header[1]", Server_data[1])
                    # print(f"URL[0]", Server_data[0])
                    # print(f"PID[2]", Server_data[2])
                    # print(f"URL_ID[3]", Server_data[3])
                    Server_word = line
                    if Server_data[1].find(Server_word) != -1:
                        print("พบ detect word listpathraversal")
                        db = mysql.connection.cursor()
                        insert_query = (
                            "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,payload,vul_des , vul_sol , vul_ref , OType ) VALUES (%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                        )
                        values = (Server_data[3], Server_data[2], '4', Server_data[0], 'T', Server_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
                        db.execute(insert_query, values)
                        mysql.connection.commit()
                    else:
                        print("ไม่พบ detect word listpathraversal")


async def run_gobuster(url):
    try:
        db = mysql.connection.cursor()
        query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.common')) AS payload FROM owasp WHERE OID=20")
        db.execute(query,)             
        common = db.fetchall() 
        # print(common)
        word_list = json.loads(common[0][0])
        # print(word_list)
        wordlist_path = 'wordlist.txt'
        with open(wordlist_path, 'w') as file:
            for item in word_list:
                file.write(item + '\n')
        command = [
            'C:\\Users\\b_r_r\\OneDrive\\เดสก์ท็อป\\pj2566new\\gobuster_Windows_x86_64\\gobuster.exe',
            'dir',
            '-u', url,
            '-r',
            '-t', '10',
            '-w', wordlist_path,
            '-o', 'tempfuzz.txt'
]

        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running gobuster: {e}")



async def checkTempFuzz(i,project_name,user,baseURL,Host,cookies_data,http_log_data,visited_urls,state='T'):
    file_path = "tempfuzz.txt"
    if os.path.exists(file_path):
        try:
            with open(file_path, "r") as f:
                lines = f.readlines()
            lines = [line.replace('', ' ') for line in lines]
            lines = [line for line in lines if '(Status: 500)' not in line and '(Status: 429)' not in line and '(Status: 403)' not in line and '(Status: 400)' not in line and '(Status: 301)' not in line]


            with open(file_path, 'w') as file:
                file.writelines(lines)

            with open(file_path, "r") as f:
                j = 1

                for x in f:
                    print(str(j))
                    print(baseURL + x.split()[0])
                    url = baseURL+x.split()[0]
                    # query = (
                    #     'INSERT INTO urllist(URL,state,PID)  VALUES(%s, %s, %s)')
                    # db.execute(query, (url, state, project_name_id_result),)
                    # print(baseURL+ x.split()[0], end='\n')
                    j = j+1
                    if (url) not in visited_urls:
                        response = await get_response(url,cookies_data)
                        if response is not None:
                            print("responsefuzz",response)
                            await save_log(response, i,project_name,user,Host,http_log_data)
                            i = i+1

        except IOError as e:
            print(f"Error reading file: {e}")
    else:
        print(f"The file {file_path} does not exist.")
    return i

async def detect_web_server_leakage(Server):
    db = mysql.connection.cursor()
    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=1")
    db.execute(query2,)             
    sql2_ = db.fetchall() 
    for Server_data in Server:
        # print(f"res_header[1]",Server_data[1])
        # print(f"URL[0]",Server_data[0])
        # print(f"PID[2]",Server_data[2])
        # print(f"URL_ID[3]",Server_data[3])
        Server_word = "Server"
        if  Server_data[1].find(Server_word) != -1:
            print("พบ Server")
            db = mysql.connection.cursor()
            insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                    )
            values = (Server_data[3],Server_data[2],'1',Server_data[0],'T',Server_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
            db.execute(insert_query, values)
            mysql.connection.commit()
        else :
            print("ไม่พบ Server")





async def HSTS(PTarget):
    db = mysql.connection.cursor()
    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=8")
    db.execute(query2,)             
    sql2_ = db.fetchall()
    for HSTS_data in PTarget:
        print(f"res_header[1]",HSTS_data[1])
        print(f"URL[0]",HSTS_data[0])
        print(f"PID[2]",HSTS_data[2])
        print(f"URL_ID[3]",HSTS_data[3])
        HSTS_word = ["Strict-Transport-Security", "includeSubDomains", "preload", "max-age"]

        if HSTS_word[0] in HSTS_data[1]:
            print("Strict-Transport-Security")
        elif HSTS_word[1] in HSTS_data[1]:
            print("includeSubDomains")
        elif HSTS_word[2] in HSTS_data[1]:
            print("preload")
        elif HSTS_word[3] in HSTS_data[1]:
            print("max-age")
        else:
            db = mysql.connection.cursor()
            insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                    )
            values = (HSTS_data[3],HSTS_data[2],'8',HSTS_data[0],'T',HSTS_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
            db.execute(insert_query, values)
            mysql.connection.commit()
            print("ไม่พบ Strict-Transport-Security")






async def check_cookie_attributes(Server):
    db = mysql.connection.cursor()
    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=2")
    db.execute(query2,)             
    sql2_ = db.fetchall()
    query3 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=3")
    db.execute(query3,)             
    sql3_ = db.fetchall()
    query5 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=5")
    db.execute(query5,)             
    sql5_ = db.fetchall()
    query6 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=6")
    db.execute(query6,)             
    sql6_ = db.fetchall()
    for Server_data in Server:
        # print(f"res_header[1]", Server_data[1])
        Set_Cookie = 'Set-Cookie'
        Secure_Header = 'Secure'
        HttpOnly_Header = 'HttpOnly'
        Expires_Header = 'Expires'
        SameSite_Header = 'SameSite'
        if Server_data[1].find(Set_Cookie) != -1:
             print(f'พบ Set-Cookie ที่ URL: {Server_data[0]}')
             if  Server_data[1].find(Secure_Header) != -1:
                    web = Server_data[1].find(Secure_Header)
             else:
                print(f'ไม่พบ Secure:{Server_data[0]}')
                db = mysql.connection.cursor()
                insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                    )
                values = (Server_data[3],Server_data[2],'2',Server_data[0],'T',Server_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3])
                db.execute(insert_query, values)
                mysql.connection.commit()
            
             if Server_data[1].find(HttpOnly_Header) != -1:
                    web = Server_data[1].find(HttpOnly_Header)
             else:
                db = mysql.connection.cursor()
                insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                    )
                values = (Server_data[3],Server_data[2],'3',Server_data[0],'T',Server_data[1],sql3_[0][0],sql3_[0][1],sql3_[0][2],sql3_[0][3])
                db.execute(insert_query, values)
                mysql.connection.commit()
                print(f'ไม่พบ HttpOnly:{Server_data[0]}')

             if Server_data[1].find(Expires_Header) != -1:
                    web = Server_data[1].find(Expires_Header)
                    print(f'{web}')
             else:

                db = mysql.connection.cursor()
                insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                    )
                values = (Server_data[3],Server_data[2],'5',Server_data[0],'T',Server_data[1],sql5_[0][0],sql5_[0][1],sql5_[0][2],sql5_[0][3])
                db.execute(insert_query, values)
                mysql.connection.commit()
                print(f'ไม่พบ Expires:{Server_data[0]}')


             if Server_data[1].find(SameSite_Header) != -1:
                    web = Server_data[1].find(SameSite_Header)
                    print(f'{web}')
             else:
                  
                db = mysql.connection.cursor()
                insert_query = (
                       "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType) VALUES (%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                    )
                values = (Server_data[3],Server_data[2],'6',Server_data[0],'T',Server_data[1],sql6_[0][0],sql6_[0][1],sql6_[0][2],sql6_[0][3])
                db.execute(insert_query, values)
                mysql.connection.commit()
                print(f'ไม่พบ SameSite:{Server_data[0]}')



@app.route("/crawl", methods=['POST'])
async def crawl_endpoint():
    global  MAX_VISITED_URLS
    try:
        # token = request.headers.get('Authorization').split(" ")[1]
        # user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        # admin = user.get('role', None)
        MAX_VISITED_URLS = 100
        visited_urls = []
        cookies_data = {}
        http_log_data = {}
        res = {}
        req = {}
        i = 1
        visited_post={}

        project_name = request.json['project_name']
     
        user = request.json['authUser']
        scope_url = request.json['url']
        Host = urlparse(scope_url).netloc
        baseURL = urlparse(scope_url).scheme + '://' + urlparse(scope_url).netloc
        description_name = request.json['description']
        # print(i)
        # print(visited_urls)

        
        db = mysql.connection.cursor()
        insert_query11 = ('INSERT INTO project(PName,PTarget,PDes,username) VALUES(%s, %s, %s, %s)')
        values11 = (project_name, scope_url, description_name, user)
        db.execute(insert_query11, values11)
        mysql.connection.commit()
        csv_name = f"{project_name}.csv"
        
        await crawl(scope_url,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)

        db = mysql.connection.cursor()
        select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
        db.execute(select_project_name_id_query, (project_name, user))             
        project_name_id_result = db.fetchall()   
        print(project_name_id_result)
        await run_gobuster(baseURL)
        print("baseURL",baseURL)
        i = await checkTempFuzz(i,project_name,user,baseURL,Host,cookies_data,http_log_data,visited_urls)
        
        db = mysql.connection.cursor()
        query = "SELECT URL,res_header,PID,URL_ID FROM urllist WHERE PID = %s"
        db.execute(query, (project_name_id_result))
        Server = db.fetchall()
        await detect_web_server_leakage(Server)
        await check_cookie_attributes(Server)
         
        db = mysql.connection.cursor()
        query = "SELECT URL,req_header,PID,URL_ID FROM urllist WHERE PID = %s"
        db.execute(query, (project_name_id_result))
        pathtraversal = db.fetchall()
        await detect_pathtraversal(pathtraversal)

        query = "SELECT URL,res_header,PID,URL_ID  FROM urllist WHERE PID = %s AND URL = %s"
        db.execute(query, (project_name_id_result,scope_url))
        PTarget = db.fetchall()
        print("PTarget", PTarget[0][1])
        await HSTS(PTarget)

        db = mysql.connection.cursor()
        query = "SELECT URL FROM urllist WHERE PID = %s"
        db.execute(query, (project_name_id_result))
        URL_data = db.fetchall()
        for url_data in URL_data:
            baseatt_URL = url_data[0]
            print(f'baseatt_URL',baseatt_URL)
            select_url_id_query = "SELECT URL_ID FROM urllist WHERE PID = %s AND URL = %s "
            db.execute(select_url_id_query, (project_name_id_result,baseatt_URL))
            select_url_id = db.fetchall()
            select_url_id_data = select_url_id[0]
            print(f'select_url_id crawl',select_url_id)
            Host = urlparse(baseatt_URL).netloc
            cookies_data_ = {}
            baseper = len((await get_response(baseatt_URL,cookies_data)).content)
            print('b:'+str(baseper))
            # print(baseatt_URL)
            print(urlparse(baseatt_URL))
            att_url = urlparse(baseatt_URL).scheme+'://'+urlparse(baseatt_URL).netloc+urlparse(baseatt_URL).path
            att_paramsnum = len(urlparse(baseatt_URL).query.split('&'))
            #parse full query to dictionary


            if urlparse(baseatt_URL).query != '' :
                att_paramsnum = len(urlparse(baseatt_URL).query.split('&'))
                att_params={}
                #parse full query to dictionary
                for i in urlparse(baseatt_URL).query.split('&'):
                    #params=value
                    # print(i)
                    att_params.update({i.split('=')[0]: i.split('=')[1]})
                print(att_url)
                await brutesql(att_url, att_params, baseper,select_url_id_data,baseatt_URL,project_name, user,cookies_data)
            # print(vresults)
            # all_results.extend(vresults)
            # for vres, vparams in vresults:
            #     print(vres)
            #     print(vparams)           
            else:
                print('we cannot find sql injection')

            if urlparse(baseatt_URL).query != '' :
                att_paramsnum = len(urlparse(baseatt_URL).query.split('&'))
                att_params={}
                att_paramsname = []
                #parse full query to dictionary
                for i in urlparse(baseatt_URL).query.split('&'):
                    #params=value
                    # print(i)
                    att_params.update({i.split('=')[0]: i.split('=')[1]})
                    att_paramsname.append(i.split('=')[0])
                # print(att_url)
                    
                await brutexss(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data)
                # if vres and vparams != None:
                #     print(vres)
                #     print(vparams)
            else:
                print('we cannot find xss injection in this way')


            if urlparse(baseatt_URL).query != '' :
                att_paramsnum = len(urlparse(baseatt_URL).query.split('&'))
                att_params={}
                att_paramsname = []
                #parse full query to dictionary
                for i in urlparse(baseatt_URL).query.split('&'):
                    #params=value
                    # print(i)
                    att_params.update({i.split('=')[0]: i.split('=')[1]})
                    att_paramsname.append(i.split('=')[0])
                # print(att_url)
                    
                await brutepathtraversal(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data)
                # if vres and vparams != None:
                #     print(vres)
                #     print(vparams)
            else:
                print('[-] we cannot find path traversal')


        return {"project_name_id_result": project_name_id_result}
    except Exception as e:
        return jsonify({"server error": str(e)})
    
    
@app.route("/home", methods=['GET'])
def home():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        db = mysql.connection.cursor()
        query = "SELECT PDes, PName, PID,PTarget,timeproject FROM project WHERE username = %s"
        db.execute(query, (user_data,))
        project_data = db.fetchall()
        db.close()
        # print(project_data)

        return jsonify({"project_data": project_data})
    except Exception as e:
        return jsonify({"server error": str(e)})

@app.route("/DashboardAll", methods=['GET'])
def DashboardAll():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        db = mysql.connection.cursor()
        query = "SELECT project.PName, project.PTarget ,att_ps.OID,att_ps.position,project.PID FROM att_ps JOIN project ON att_ps.PID = project.PID JOIN urllist ON att_ps.URL_ID = urllist.URL_ID JOIN user ON project.username = user.username WHERE att_ps.state = %s AND user.username = %s "
        db.execute(query, ('T',user_data,))
        project_data_DashboardAll = db.fetchall()
        db.close()
        # print(project_data)

        return jsonify({"project_data_DashboardAll": project_data_DashboardAll})
    except Exception as e:
        return jsonify({"server error": str(e)})


@app.route("/dashboard", methods=['GET'])
def dashboard():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Role = user.get('role', None)
        print(Role)
        project_name_id = request.args.get('project_name_id')
        db = mysql.connection.cursor()

#         query = """
#            SELECT tbl1.URL, tbl1.method, tbl1.status_code, tbl1.URL_ID
# FROM urllist tbl1
# JOIN project tbl2 ON tbl1.PID = tbl2.PID
# WHERE tbl2.username = %s AND tbl2.PID = %s AND tbl1.state = %s AND tbl1.status_code != %s
#         """
#         db.execute(query, (user_data, project_name_id, 'c', '404'))
#         crawl_data = db.fetchall()

        targets_url = "SELECT PTarget , PDes FROM project WHERE username = %s AND PID = %s"
        db.execute(targets_url, (user_data, project_name_id))
        url_target = db.fetchall()

        # print(url_target)
        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        select_att_ID_traversal = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        select_att_ID_secure = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_name_id, '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        select_att_ID_httponly = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_name_id, '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        select_att_ID_expire = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_name_id, '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        select_att_ID_samsite = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_name_id, '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()

        return jsonify({"url_target": url_target}, {"select_att_sql_DATA": select_att_ID_sql_DATA}, {"select_att_ID_xsssql_DATA": select_att_ID_xsssql_DATA}, {"select_att_ID_select_att_traversal_DATA": select_att_ID_select_att_traversal_DATA}, {"Role": Role},{"select_att_ID_select_att_secure_DATA":select_att_ID_select_att_secure_DATA},{"select_att_ID_select_att_httponly_DATA":select_att_ID_select_att_httponly_DATA},{"select_att_ID_select_att_expire_DATA":select_att_ID_select_att_expire_DATA},{"select_att_ID_select_att_samsite_DATA":select_att_ID_select_att_samsite_DATA}
                       ,{"select_att_ID_select_att_server_DATA":select_att_ID_select_att_server_DATA},{"select_att_ID_select_att_HSTS_DATA":select_att_ID_select_att_HSTS_DATA})
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})
    


@app.route("/check", methods=['GET'])
def check():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Admin = user.get('role', None)
        db = mysql.connection.cursor()
        query = "SELECT PDes, PName, PID FROM project WHERE username = %s"
        db.execute(query, (user_data,))
        project_data = db.fetchall()
        db.close()
        # print(project_data)

        return jsonify({"project_data": project_data}, {"Admin": Admin})
    except Exception as e:
        return jsonify({"server error": str(e)})


@app.route("/addurls", methods=['POST'])
def addurls():
    try:
        url = request.json['urls']
        method = request.json['method']
        parameter = request.json['parameter']
        project_name_id = request.json['project_name_id']
        db = mysql.connection.cursor()

        query = ('INSERT INTO urllist(URL,method,PID,state) VALUES(%s,%s,%s,%s)')
        db.execute(query, (url, method, project_name_id, 'c'),)
        mysql.connection.commit()
        print(url)
        print(method)
        print(parameter)
        print(project_name_id)
        return jsonify("Add URLS สำเร็จ")
    except Exception as e:
        return jsonify({"server error": str(e)})


@app.route("/addurlsedit", methods=['POST'])
def addurlsedit():
    try:
        url = request.json['urls']
        method = request.json['method']
        parameter = request.json['parameter']
        token = request.json['token']
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret',
                          algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        print(f'user_data = {user_data}')
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        project_id = decoded_token.get('project_id', '')
        print(f'user_id = {user_id}')
        if user_id is None or project_id is None:
            return jsonify({'error': 'Invalid token'}), 401
# เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User not allowed to edit project'}), 403
        db = mysql.connection.cursor()

        query = ('INSERT INTO urllist(URL,method,PID) VALUES(%s,%s,%s,%s)')
        db.execute(query, (url, method, project_id, 'c'),)
        mysql.connection.commit()
        print(url)
        print(method)
        print(parameter)
        print(project_id)
        return jsonify("Add URLS สำเร็จ")
    except Exception as e:
        return jsonify({"server error": str(e)})



@app.route("/update", methods=['PUT'])
def update():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        project_name = request.json['project_name']
        project_name_id = request.json['project_name_id']
        scope_url = request.json['url']
        description_name = request.json['description']
        db = mysql.connection.cursor()
        print(user_data)
        print(description_name)
        print(project_name_id)
        update_query = 'UPDATE project SET PName = %s , PDes=%s WHERE PID = %s AND username = %s '
        values = (project_name, description_name, project_name_id,user_data)
        db.execute(update_query, values)
        mysql.connection.commit()
        return jsonify("Add URLS สำเร็จ")
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})
    

@app.route("/onedata", methods=['GET'])
def onedata():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Role = user.get('role', None)
        print(Role)
        project_name_id = request.args.get('project_name_id')
        db = mysql.connection.cursor()


        query = """
           SELECT tbl1.URL, tbl1.method, tbl1.status_code, tbl1.URL_ID
FROM urllist tbl1
JOIN project tbl2 ON tbl1.PID = tbl2.PID
WHERE tbl2.username = %s AND tbl2.PID = %s AND tbl1.state = %s AND tbl1.status_code != %s
        """
        db.execute(query, (user_data, project_name_id, 'c', '404'))
        crawl_data = db.fetchall()

        # query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType FROM owasp WHERE OID=11")
        # db.execute(query2,)             
        # sql2_ = db.fetchall() 
        # print("sql2_[0][0]",sql2_[0][0])
        # print("sql2_[0][1]",sql2_[0][1])
        # print("sql2_[0][2]",sql2_[0][2])
        # print("sql2_[0][2]",sql2_[0][3])

        targets_url = "SELECT PTarget , PDes,PName FROM project WHERE username = %s AND PID = %s"
        db.execute(targets_url, (user_data, project_name_id))
        url_target = db.fetchall()

        # print(url_target)
        select_att_ID_sql = "SELECT URL , payload ,position ,Vul_des , Vul_sol , OType , ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT URL , payload,position ,Vul_des , Vul_sol , OType , ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        select_att_ID_traversal = "SELECT URL , payload,position,Vul_des , Vul_sol , OType, ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        select_att_ID_secure = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_name_id, '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        select_att_ID_httponly = "SELECT URL , res_header,Vul_des , Vul_sol, OType , ATT_ID  FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_name_id, '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        select_att_ID_expire = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_name_id, '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        select_att_ID_samsite = "SELECT URL , res_header,Vul_des , Vul_sol  ,OType, ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_name_id, '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        
        # print(select_att_ID_sql_DATA)

        # wordlist_path = 'wordlistsql.txt'
        # with open(wordlist_path, 'w') as file:
        #     for item in word_list:
        #         file.write(item + '\n')
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

        return jsonify({"crawl_data": crawl_data}, {"url_target": url_target}, {"select_att_sql_DATA": select_att_ID_sql_DATA}, {"select_att_ID_xsssql_DATA": select_att_ID_xsssql_DATA}, {"select_att_ID_select_att_traversal_DATA": select_att_ID_select_att_traversal_DATA}, 
                       {"Role": Role},{"select_att_ID_select_att_secure_DATA":select_att_ID_select_att_secure_DATA},{"select_att_ID_select_att_httponly_DATA":select_att_ID_select_att_httponly_DATA},{"select_att_ID_select_att_expire_DATA":select_att_ID_select_att_expire_DATA},{"select_att_ID_select_att_samsite_DATA":select_att_ID_select_att_samsite_DATA}
                       ,{"select_att_ID_select_att_server_DATA":select_att_ID_select_att_server_DATA},{"select_att_ID_select_att_HSTS_DATA":select_att_ID_select_att_HSTS_DATA})
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})



@app.route('/edit-issue', methods=['GET'])
def edit_issue():
    token = request.args.get('token')
    token_user = request.headers.get('Authorization').split(" ")[1]
    user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
    user_data = user.get('username', None)
    print(token)
    decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
    user_id = decoded_token.get('user_id', '')
    project_id = decoded_token.get('project_id', '')
    print("user_id", user_id, project_id)
    print("user_data", user_data)

    if user_id is None or project_id is None:
        return jsonify({'error': 'Invalid token'}), 401
# เชคสิทธิ์
    if user_id not in user_data:
        return jsonify({'error': 'User not allowed to edit project'}), 403
    # print(crawl_data)

    db = mysql.connection.cursor()
    targets_url = "SELECT PTarget, PDes FROM project WHERE PID = %s"
    db.execute(targets_url, (project_id,))
    url_target = db.fetchall()
    print("url_target", url_target)

    # print(url_target)
    select_att_ID_sql = "SELECT URL , payload ,position FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_sql, (project_id, '11'))
    select_att_ID_sql_DATA = db.fetchall()
    select_att_ID_sql = "SELECT URL , payload,position FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_sql, (project_id, '10'))
    select_att_ID_xsssql_DATA = db.fetchall()
    select_att_ID_traversal = "SELECT URL , payload,position FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_traversal, (project_id, '4'))
    select_att_ID_select_att_traversal_DATA = db.fetchall()
    select_att_ID_secure = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_secure, (project_id, '2'))
    select_att_ID_select_att_secure_DATA = db.fetchall()
    select_att_ID_httponly = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_httponly, (project_id, '3'))
    select_att_ID_select_att_httponly_DATA = db.fetchall()
    select_att_ID_expire = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_expire, (project_id, '5'))
    select_att_ID_select_att_expire_DATA = db.fetchall()
    select_att_ID_samsite = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_samsite, (project_id, '6'))
    select_att_ID_select_att_samsite_DATA = db.fetchall()
    select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
    db.execute(select_att_ID_Server, (project_id, '1'))
    select_att_ID_select_att_server_DATA = db.fetchall()
    return jsonify({"url_target": url_target}, {"select_att_sql_DATA": select_att_ID_sql_DATA}, {"select_att_ID_xsssql_DATA": select_att_ID_xsssql_DATA}, {"select_att_ID_select_att_traversal_DATA": select_att_ID_select_att_traversal_DATA},{"select_att_ID_select_att_secure_DATA":select_att_ID_select_att_secure_DATA},{"select_att_ID_select_att_httponly_DATA":select_att_ID_select_att_httponly_DATA},
                   {"select_att_ID_select_att_expire_DATA":select_att_ID_select_att_expire_DATA},{"select_att_ID_select_att_samsite_DATA":select_att_ID_select_att_samsite_DATA}
                       ,{"select_att_ID_select_att_server_DATA":select_att_ID_select_att_server_DATA})

@app.route("/onedelete", methods=['DELETE'])
def onedelete():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        user_data = user.get('username', None)
        project_name_id = request.args.get('project_name_id')

        db = mysql.connection.cursor()
        delete_crawl_query = "DELETE FROM att_ps WHERE PID = %s"
        db.execute(delete_crawl_query, (project_name_id,))
        delete_crawl_query = "DELETE FROM urllist WHERE PID = %s"
        db.execute(delete_crawl_query, (project_name_id,))
        delete_project_query = "DELETE FROM project WHERE PID = %s AND username = %s"
        db.execute(delete_project_query, (project_name_id, user_data))
        mysql.connection.commit()
        db.close()

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error": str(e)})


@app.route("/oneurlsdelete", methods=['DELETE'])
def oneurlsdelete():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        Role = user.get('role', None)
        project_name_id = request.args.get('project_name_id')
        print(project_name_id)
        urls_id = request.args.get('record')
        if (Role == 'Advance'):
            db = mysql.connection.cursor()
            delete_crawl_query = "DELETE FROM urllist WHERE PID = %s AND URL_ID = %s"
            db.execute(delete_crawl_query, (project_name_id, urls_id),)
            mysql.connection.commit()
            db.close()
        else:
            return jsonify({"Delete": "Error-Delete"})
        



        


#         token = request.args.get('token')
#         token_user = request.headers.get('Authorization').split(" ")[1]
#         user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
#         user_data = user.get('username', None)
#         print(f'user_data = {user_data}')
#         decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
#         user_id = decoded_token.get('user_id', '')
#         print(f'user_id = {user_id}')
#         project_id = decoded_token.get('project_id', '')
#         if user_id is None or project_id is None:
#             return jsonify({'error': 'Invalid token'}), 401
# # เชคสิทธิ์
#         if user_id not in user_data:
#             return jsonify({'error': 'User not allowed to edit project'}), 403
#         db = mysql.connection.cursor()
#         delete_crawl_query = "DELETE FROM urllist WHERE PID = %s AND URL_ID = %s"
#         db.execute(delete_crawl_query, (project_id, urls_id),)
#         mysql.connection.commit()
#         db.close()

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error oneurlsdelete": str(e)})
    




@app.route("/oneVulsdelete", methods=['DELETE'])
def oneVulsdelete():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        Role = user.get('role', None)
        project_name_id = request.args.get('project_name_id')
        print(project_name_id)
        urls_id = request.args.get('record')
        if (Role == 'Advance'):
            db = mysql.connection.cursor()
            print("project_name_id",project_name_id)
            print("att_id",urls_id)
            delete_crawl_query = "DELETE FROM att_ps WHERE PID = %s AND ATT_ID = %s"
            db.execute(delete_crawl_query, (project_name_id, urls_id),)
            mysql.connection.commit()
            db.close()
        else:
            return jsonify({"Delete": "Error-Delete"})
        



        


#         token = request.args.get('token')
#         token_user = request.headers.get('Authorization').split(" ")[1]
#         user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
#         user_data = user.get('username', None)
#         print(f'user_data = {user_data}')
#         decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
#         user_id = decoded_token.get('user_id', '')
#         print(f'user_id = {user_id}')
#         project_id = decoded_token.get('project_id', '')
#         if user_id is None or project_id is None:
#             return jsonify({'error': 'Invalid token'}), 401
# # เชคสิทธิ์
#         if user_id not in user_data:
#             return jsonify({'error': 'User not allowed to edit project'}), 403
#         db = mysql.connection.cursor()
#         delete_crawl_query = "DELETE FROM urllist WHERE PID = %s AND URL_ID = %s"
#         db.execute(delete_crawl_query, (project_id, urls_id),)
#         mysql.connection.commit()
#         db.close()

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error oneurlsdelete": str(e)})


# @app.route("/dashboard", methods=['GET'])
# def dashboard():
#     try:
#         project_name_id = request.args.get("project_name_id")
#         db = mysql.connection.cursor()
        # query = "SELECT res_header,URL FROM urllist WHERE PID= %s"
        # db.execute(query,(project_name_id,))
        # res_header_Cookies = db.fetchall()
        # Set_Cookie = 'Set-Cookie'
        # Secure_Header = 'Secure'
        # HttpOnly_Header = 'HttpOnly'
        # Expires_Header = 'Expires'
        # SameSite_Header = 'SameSite'
        # url_web_Secure = []
        # url_web_HttpOnly = []
        # url_web_Expires = []
        # url_web_SameSite = []
        # for res_header_list_Secure,url in res_header_Cookies:

        #     if res_header_list_Secure.find(Set_Cookie) != -1:
        #         print(f'พบ Set-Cookie ที่ URL: {url}')
        #         if res_header_list_Secure.find(Secure_Header) != -1:
        #             web = res_header_list_Secure.find(Secure_Header)
        #         else:
        #             url_web_Secure.append(url)
        #             print(f'ไม่พบ Secure:{url}')


        #         if res_header_list_Secure.find(HttpOnly_Header) != -1:
        #             web = res_header_list_Secure.find(HttpOnly_Header)
        #         else:
        #             url_web_HttpOnly.append(url)
        #             print(f'ไม่พบ HttpOnly:{url}')

        #         if res_header_list_Secure.find(Expires_Header) != -1:
        #             web = res_header_list_Secure.find(Expires_Header)
        #             print(f'{web}')
        #         else:
        #            url_web_Expires.append(url)
        #            print(f'ไม่พบ Expires:{url}')


        #         if res_header_list_Secure.find(SameSite_Header) != -1:
        #             web = res_header_list_Secure.find(SameSite_Header)
        #             print(f'{web}')
        #         else:
        #             url_web_SameSite.append(url)
        #             print(f'ไม่พบ SameSite:{url}')
        #         print(url_web_Secure)
        #         print(url_web_HttpOnly)
        #         print(url_web_Expires)
        #         print(url_web_SameSite)


#         return jsonify({"Secure":url_web_Secure},{"HttpOnly":url_web_HttpOnly},{"Expires":url_web_Expires},{"SameSite":url_web_SameSite})
#     except:
#        return jsonify({"server error": str(e)})
# @app.route("/dashboard", methods=['GET'])
# def dashboard():
#     try:
#         token = request.headers.get('Authorization').split(' ')[1]
#         user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
#         user_data = user.get('username', None)
#         Role = user.get('role', None)
#         print(Role)
#         project_name_id = request.args.get('project_name_id')
#         db = mysql.connection.cursor()

# #         query = """
# #            SELECT tbl1.URL, tbl1.method, tbl1.status_code, tbl1.URL_ID
# # FROM urllist tbl1
# # JOIN project tbl2 ON tbl1.PID = tbl2.PID
# # WHERE tbl2.username = %s AND tbl2.PID = %s AND tbl1.state = %s AND tbl1.status_code != %s
# #         """
# #         db.execute(query, (user_data, project_name_id, 'c', '404'))
# #         crawl_data = db.fetchall()

#         targets_url = "SELECT PTarget , PDes FROM project WHERE username = %s AND PID = %s"
#         db.execute(targets_url, (user_data, project_name_id))
#         url_target = db.fetchall()

#         # print(url_target)
#         select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
#         db.execute(select_att_ID_sql, (project_name_id, '11'))
#         select_att_ID_sql_DATA = db.fetchall()
#         select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
#         db.execute(select_att_ID_sql, (project_name_id, '10'))
#         select_att_ID_xsssql_DATA = db.fetchall()
#         select_att_ID_traversal = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
#         db.execute(select_att_ID_traversal, (project_name_id, '4'))
#         select_att_ID_select_att_traversal_DATA = db.fetchall()

     

#         return jsonify({"url_target": url_target}, {"select_att_sql_DATA": select_att_ID_sql_DATA}, {"select_att_ID_xsssql_DATA": select_att_ID_xsssql_DATA}, {"select_att_ID_select_att_traversal_DATA": select_att_ID_select_att_traversal_DATA}, {"Role": Role})
#     except Exception as e:
#         app.logger.error(str(e))
#         return jsonify({"server error": str(e)})

# payloadทั้งหมด


@app.route("/payload", methods=['POST'])
def payload():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        admin = user.get('role', None)
        if (admin == 'Admin'):
            Owasp = request.json['Owasp']
            db = mysql.connection.cursor()
            query = "SELECT JSON_KEYS(payloadlist) AS json_keys FROM owasp WHERE OID = %s "
            db.execute(query, (Owasp,))
            json_keys = db.fetchall()
        else:
            return jsonify({"login"})

        return jsonify({"value": json_keys})
        # return jsonify(payload_list)
    except Exception as e:
        print(f"Error: {e}")

 # payloadเพิ่มที่ละตัว


@app.route("/payload2", methods=['POST'])
def payload2():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        admin = user.get('role', None)
        if (admin == 'Admin'):
            payload_ = request.json['payloadone']
            value_payload = request.json['valuepayload']
            Owasp = request.json['Owasp']
            print(payload_)
            print(f'\"{value_payload}\"')
            print(Owasp)
            print(f'\"$.{payload_}\"')

            db = mysql.connection.cursor()
            query = "UPDATE owasp SET payloadlist = JSON_ARRAY_APPEND(payloadlist, %s, %s) WHERE OID = %s"
            db.execute(query, (f'$.{payload_}', value_payload, Owasp),)
            mysql.connection.commit()
        else:
            return jsonify({"login"})

        return jsonify({"value": "value"})
        # return jsonify(payload_list)
    except Exception as e:
        print(f"Error: {e}")

 # payloadเพิ่มทั้งเพลโลด


@app.route("/payload3", methods=['POST'])
def payload3():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        admin = user.get('role', None)
        if (admin == 'Admin'):
            payload_ = request.json['payloadall']
            Owasp = request.json['Owasp']
            print(payload_)

            data_dict = json.loads(payload_)
            with mysql.connection.cursor() as db:
                for key_, values_ in data_dict.items():
                    print(f'Key: {key_}')
                    print(f'Values: {json.dumps(values_),}')
                    query = "UPDATE owasp SET payloadlist = JSON_SET(payloadlist, %s, JSON_ARRAY(%s)) WHERE OID = %s"
                    db.execute(
                        query, (f'$.{key_}', json.dumps(values_), Owasp))

            mysql.connection.commit()
        else:
            return jsonify({"login"})

        return jsonify(data_dict)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)})

 # payloadShow


@app.route("/payload4", methods=['POST'])
def payload4():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        admin = user.get('role', None)
        if (admin == 'Admin'):
            Owasp = request.json['Owasp']
            db = mysql.connection.cursor()
            query = "SELECT payloadlist  FROM owasp WHERE OID = %s "
            db.execute(query, (Owasp,))
            Owasp_payloadlist = db.fetchall()
        else:
            return jsonify({"login"})

        return jsonify({"Owasp_payloadlist": Owasp_payloadlist})
        # return jsonify(payload_list)
    except Exception as e:
        print(f"Error: {e}")


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


@app.route('/generate-link', methods=['POST'])
def generate_link():
    try:
        token = request.headers.get('Authorization').split('Bearer ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        project_name_id = request.json['project_name']
        usershare = request.json['usershare']
        allowed_users = [usershare, user_data]
        if usershare not in allowed_users:
            return jsonify({'error': 'User not allowed to share project'}), 403
        db = mysql.connection.cursor()
        query2 = "SELECT PName FROM project WHERE PID = %s "
        db.execute(query2, (project_name_id,))
        project_name = db.fetchall()
        query3 = "SELECT username FROM project WHERE PID = %s "
        db.execute(query3, (project_name_id,))
        username = db.fetchall()
        payload = {'user_id': usershare, 'project_id': project_name_id,
                   'project_name': project_name, 'username': username}
        token = jwt.encode(payload, 'jwtSecret', algorithm='HS256')
        link = f'http://localhost:3000/edit-project?token={token}'
        return jsonify({'link': link})
    except Exception as e:
        print(f"Error: {e}")


@app.route('/edit-project', methods=['GET'])
def edit_project():
    token = request.args.get('token')
    token_user = request.headers.get('Authorization').split(" ")[1]
    user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
    user_data = user.get('username', None)
    print(token)
    decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
    user_id = decoded_token.get('user_id', '')
    project_id = decoded_token.get('project_id', '')
    # print(user_id, project_id)
    # print(user_data)

    if user_id is None or project_id is None:
        return jsonify({'error': 'Invalid token'}), 401
# เชคสิทธิ์
    if user_id not in user_data:
        return jsonify({'error': 'User not allowed to edit project'}), 403
    db = mysql.connection.cursor()
    query = "SELECT URL,method, status_code , URL_ID FROM urllist WHERE PID = %sAND (state = %s OR state IS NULL) AND status_code != %s"
    db.execute(query, (project_id, 'c', '404'))
    crawl_data = db.fetchall()
    # print(crawl_data)

    return jsonify({"crawl_data": crawl_data})

@app.route('/edit-Dashboard', methods=['GET'])
def edit_Dashboard():
    try:
        token = request.args.get('token')
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        print(token)
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        project_id = decoded_token.get('project_id', '')
    # print(user_id, project_id)
    # print(user_data)

        if user_id is None or project_id is None:
            return jsonify({'error': 'Invalid token'}), 401
    # เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User not allowed to edit project'}), 403
        
        db = mysql.connection.cursor()
        targets_url = "SELECT PTarget , PDes FROM project WHERE PID = %s"
        db.execute(targets_url, (project_id,))
        url_target = db.fetchall()

            # print(url_target)
        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        select_att_ID_traversal = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()

     

        return jsonify({"url_target": url_target}, {"select_att_sql_DATA": select_att_ID_sql_DATA}, {"select_att_ID_xsssql_DATA": select_att_ID_xsssql_DATA}, {"select_att_ID_select_att_traversal_DATA": select_att_ID_select_att_traversal_DATA})
    except Exception as e:
        return jsonify({"server error": str(e)})




@app.route("/edit-oneurlsdelete", methods=['DELETE'])
def edit_issueoneurlsdelete():
    try:
        # project_name_id = request.args.get('project_name_id')
        # print(project_name_id)
        urls_id = request.args.get('record')
        # db = mysql.connection.cursor()
        # delete_crawl_query = "DELETE FROM urllist WHERE PID = %s AND URL_ID = %s"
        # db.execute(delete_crawl_query, (project_name_id, urls_id),)
        # mysql.connection.commit()
        # db.close()

        token = request.args.get('token')
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret',
                          algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        print(f'user_data = {user_data}')
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        print(f'user_id = {user_id}')
        project_id = decoded_token.get('project_id', '')
        if user_id is None or project_id is None:
            return jsonify({'error': 'Invalid token'}), 401
# เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User not allowed to edit project'}), 403
        db = mysql.connection.cursor()
        delete_crawl_query = "DELETE FROM urllist WHERE PID = %s AND URL_ID = %s"
        db.execute(delete_crawl_query, (project_id, urls_id),)
        mysql.connection.commit()
        db.close()

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error oneurlsdelete": str(e)})




# @app.route('/generate_pdf', methods=['GET'])
# def generate_pdf():
#     try:

#         project_name_id = request.json['name_id']
#         db = mysql.connection.cursor()
#         targets_url = "SELECT PTarget FROM project WHERE PID = %s"
#         db.execute(targets_url, (project_name_id))
#         url_data = db.fetchall()
#         print(url_data)
#         db.close()
#         return jsonify({'url_data': "url_data"})
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True) 
