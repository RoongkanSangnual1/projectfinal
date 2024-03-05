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
from urllib.parse import quote
import jwt
import subprocess
import os
from concurrent.futures import ThreadPoolExecutor
import asyncio
import math
from collections import Counter
import re
import ast
app = Flask(__name__)
CORS(app)



app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'robo'
app.config['MYSQL_CONNECT_TIMEOUT'] = 900
app.config['MYSQL_MAX_PACKET'] = 32 * 1024 * 1024 

mysql = MySQL(app)



async def crawl(url,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post):
    try:
        if len(visited_urls) >= 100:
            return "crawl"
        
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
                return "crawl"
    except Exception as e:
        print(f"crawl: {e}")
        return None

async def crawladd(url,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post):
    try:
        if len(visited_urls) >= 100:
            return "crawl"
        
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
                        
                            
                        
                        # print(f'Collect.. {response.url} -> {response.status_code} ..is {response.is_redirect} to {re_location}')
                        # await checkRedirect(response,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
                        # await get_links(soup,project_name,user,baseURL,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
                        
            else:
                return "crawl"
    except Exception as e:
        print(f"crawl: {e}")
        return None

async def checkRedirect(response,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post):
    try:
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
    except Exception as e:
        print(f"HTTP error: {e}")
        return None


async def post_response(url,cookies_data,postbody=None):
    try:
        response = requests.post(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},
                                cookies=cookies_data,allow_redirects=False,data=postbody)
        response.raise_for_status()
        await set_cookies(response,cookies_data)
        return response
    except requests.exceptions.RequestException as e:
        print(f"checkRedirect: {e}")
        print(f'Cannot request: {url}')
        return None


async def get_response(url, cookies_data,payload=None):
    try:
        print(f"url", url)
        print(f"cookies_data", cookies_data)
        print(f"get_response", payload)
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'},
                                cookies=cookies_data, allow_redirects=False, params=payload)
        await set_cookies(response,cookies_data)
        return response
    except requests.exceptions.RequestException as e:
        print(f"get_response: {e}")
        print(f'Cannot request: {url}')
        return None

                
           
async def save_log(response, i,project_name,user,Host,http_log_data,formlist=None, state='c'):
    try:
        log_key = str(i)
        MAX_IMAGE_SIZE_BYTES = 1024 * 1024
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

        # if 'image' in response.headers.get('content-type', '').lower():
        #     image_size = len(response.content)
        #     if image_size > MAX_IMAGE_SIZE_BYTES:
        #         print(f"รูปใหญ่เกิน")
        #         return


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
        print("save log")
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
    except Exception as e:
        print(f"save_log: {e}")
        return None


    

async def set_cookies(response,cookies_data):
        try:
            for req_headers in response.request.headers:
                if req_headers == 'Cookie':
                    cookies_data.update(
                        {str(response.request.headers[req_headers]).split('=')[0]: str(response.request.headers[req_headers]).split('=')[1]})
                    pass  
            for res_headers in response.headers:
                if res_headers == 'Set-Cookie':
                    cookies_data.update(
                        {str(response.headers[res_headers]).split(';')[0].split('=')[0]: str(response.headers[res_headers]).split(';')[0].split('=')[1]})
        except Exception as e:
            print(f"set_cookies: {e}")
            return None


async def get_links(soup,project_name,user,scope_url,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post):
    try:
        # links = soup.find_all('a', href=True)
        links = soup.find_all(href=True)
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
                if link.startswith(scope_url) and not link.endswith(('pdf', 'xls', 'docx', 'jpg',"png","mp4")):
                    await crawl(link,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
    except Exception as e:
        print(f"get_links: {e}")
        return None


async def findActForm(soup):
    try:
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
    except Exception as e:
        print(f"findActForm: {e}")
        return None

async def checkAct(formlist,i,project_name,user,baseURL,Host,cookies_data,http_log_data,visited_urls,visited_post):
    try:
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

    except Exception as e:
        print(f"checkActr: {e}")
        return None
    

async def contentlenpercent(response,baseper):
    try:
    
        per = len(response.content)
        diffper = ((per-baseper)/baseper) * 100
        return diffper
    except Exception as e:
        print(f"contentlenpercent: {e}")
        return None

async def checkerr(response):
    try:
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
    except Exception as e:
        print(f"checkerr: {e}")
        return None


async def brutesql(att_url, att_params, baseper,select_url_id_data,baseatt_URL,project_name, user,cookies_data_):
    try:
        db = mysql.connection.cursor()
        key_query = "SELECT JSON_KEYS(payloadlist) AS json_keys FROM owasp WHERE OID = 11"
        db.execute(key_query,)
        json_keys_result = db.fetchone()
        print("json_keys_result",json_keys_result)
        if json_keys_result:
            json_keys_str = json_keys_result[0] 
            print("json_keys_str",json_keys_str)
            json_keys_list = json.loads(json_keys_str) 
            print("json_keys_list",json_keys_list)
            for key in json_keys_list:
                    print(key)
                    query = "SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, %s)) AS payload FROM owasp WHERE OID=11"
                    db.execute(query, (f'$.{key}',))             
                    sql_ = db.fetchall() 
                    print("sql_",sql_)
                    select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
                    db.execute(select_project_name_id_query, (project_name, user))
                    project_name_id_result = db.fetchall()
                    select_url_id_query = "SELECT URL FROM urllist WHERE PID = %s AND URL_ID = %s "
                    db.execute(select_url_id_query,
                            (project_name_id_result[0][0], select_url_id_data[0]))
                    select_url_id = db.fetchall()
                    select_URL_data = select_url_id[0][0]
                    # print(common)
                    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name,Severity FROM owasp WHERE OID=11")
                    db.execute(query2,)             
                    sql2_ = db.fetchall() 
                    word_list = json.loads(sql_[0][0])
                    # print(word_list)
                    wordlist_path = f'wordlistbrutesql-{key}.txt'
                    with open(wordlist_path, 'w') as file:
                        for item in word_list:
                            file.write(item + '\n')
                    results = []
                    with open(wordlist_path, 'r') as file:
                        data = file.read()

                    if await is_array(data):
                        array_data = ast.literal_eval(data)
                        with open(wordlist_path, 'w') as file:
                            for item in array_data:
                                file.write(str(item) + '\n')
                        print(f'newfile: {wordlist_path}')
                    else:
                        print('no newfile')

                    # Now you can open the new file
                    f = open(wordlist_path, "r")
                    for payload in f:
                        for i in att_params:
                            try:
                                new_att_params = att_params.copy()
                                new_att_params[i] = new_att_params[i] + payload.strip()
                                # print(f'att_url',new_att_params[i])
                                # print(f'new_att_params',new_att_params[i])
                                response = await get_response(att_url, cookies_data_,new_att_params)
                                select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
                                db.execute(select_project_name_id_query, (project_name, user))
                                project_name_id_result = db.fetchall()
                                # print(f'select_url_id_data',select_url_id_data[0])
                                # print(f'project_name_id_result',project_name_id_result[0][0])
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

                                # print(unquote(response.url))  
                                # print(len(response.content))
                                # print(await contentlenpercent(response, baseper))
                                vres = False
                                if response.status_code == 500:
                                    print('SQL found with :' + payload.strip() + 'in ' + i)  
                                    vres = True
                                    vparams = i
                                    results.append((vres, vparams))
                                    insert_query = (
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                                    )
                                    values = (select_url_id_data[0],project_name_id_result[0][0],'11',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                                    db.execute(insert_query, values)
                                    mysql.connection.commit()
                                    
                                    return vres,vparams
                                elif await checkerr(response) == True:
                                    print('SQL found with :' + payload.strip() + 'in ' + i) 
                                    vres = True
                                    vparams = i
                                    results.append((vres, vparams))
                                    insert_query = (
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                                    )
                                    values = (select_url_id_data[0],project_name_id_result[0][0],'11',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
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
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                                    )
                                    values = (select_url_id_data[0],project_name_id_result[0][0],'11',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                                    db.execute(insert_query, values)
                                    mysql.connection.commit()
                                    return vres,vparams
                                else:
                                    print('sqli not found')
                            except Exception as e:
                                print(f"An error occurred: {str(e)}")
    except Exception as e:
        print(f"brutesql: {e}")
        return None
    


async def checkscript(response,payload):
    print((payload))
    payload = str(payload)
    soup = BeautifulSoup(response.content,'lxml')
    if payload.lower() in response.content.decode().lower():
    #check if payload embbed on response content or not
        if unquote(payload).startswith("<"):
            print('payload is tag')
            escaped_payload = re.escape(payload)
            print(escaped_payload)
            find_element = None
            find_taglist = []
            for tag in soup.find_all():
                finding = re.search(escaped_payload, str(tag).strip())
                if finding:
                    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
                    print(tag)
                    find_taglist.append(tag)
                    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
            if find_taglist != [] :
                evidence = find_taglist[-1]
                print('[+] Found XSS in response body with this evidence '+ str(evidence))
                return True
        else:
            print('payload is not tag')
            escaped_payload = re.escape(payload)
            print(escaped_payload)
            # print('||||||||')
            # print(soup)
            find_element = None
            # check if payload that is not tag is in tag content. if yes means false positive
            find_taglist1 = []
            # check if payload that is in tag header or not. if yes check that it in value or not. if in value means false positive
            find_taglist2 = []
            for tag in soup.find_all():
                
                print('-*-')
                print(tag)
                tagheadname = str(tag)
                tagheadname = tagheadname.replace(" ","")
                tagheadname = tagheadname.replace(" ","")
                tagheadname = tagheadname.split('>',1)[0]+'>'
                ########check in tag content######
                finding1 = re.search(escaped_payload, str(tag.get_text()).strip())
                finding2 = re.search(escaped_payload, tagheadname)
                # finding = soup.find_all(string=payload)
                if finding1:
                    print('found payload in tag content')
                    print('**************************')
                    print(tag.name)
                    find_taglist1.append(tag.name)
                    print('**************************')
                if finding2:
                    print('BBBBBBBBBBBBBBBBBb')
                    # print(tag)
                    temptagattrs = tag.attrs
                    tempvalue = temptagattrs.get('value')
                    if tempvalue != escaped_payload:
                        print('[+] Not in value -> XSS')
                        find_taglist2.append(tag)
                    print('BBBBBBBBBBBBBBBBBb')
                else:
                    print('not found in tag content')
            if find_taglist1 != []:
                print(find_taglist1)
                find_element = find_taglist1[-1]
                # print(find_element)
                evidences = soup.find_all(find_element)
                for evidence in evidences:
                    # evidence_element = BeautifulSoup(evidence,'lxml')
                    print(evidence.get_text())
                    x = re.search(escaped_payload,evidence.get_text())
                    if x:
                        print(escaped_payload)
                        print('Yes')
                        print(evidence)
                        if escaped_payload.startswith("\""):
                            print("False Positive!!!!")
                            
            if find_taglist2 != []:
                print(find_taglist2)
                evidence = find_taglist2[-1]
                print(evidence)
                print('[+] Found XSS in tag element with this evidence '+ str(evidence))
                return True
    else:
        return False


async def is_array(data):
    try:
        ast.literal_eval(data)
        return True
    except (SyntaxError, ValueError):
        return False

async def brutexss(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data_):
    try:
        db = mysql.connection.cursor()
        key_query = "SELECT JSON_KEYS(payloadlist) AS json_keys FROM owasp WHERE OID = 10"
        db.execute(key_query,)
        json_keys_result = db.fetchone()
        print("json_keys_result",json_keys_result)
        if json_keys_result:
            json_keys_str = json_keys_result[0] 
            print("json_keys_str",json_keys_str)
            json_keys_list = json.loads(json_keys_str) 
            print("json_keys_list",json_keys_list)
            for key in json_keys_list:
                    print(key)
                    query = "SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, %s)) AS payload FROM owasp WHERE OID=10"
                    db.execute(query, (f'$.{key}',))             
                    sql_ = db.fetchall() 
                    print("sql_",sql_)
                    select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
                    db.execute(select_project_name_id_query, (project_name, user))
                    project_name_id_result = db.fetchall()
                    select_url_id_query = "SELECT URL FROM urllist WHERE PID = %s AND URL_ID = %s "
                    db.execute(select_url_id_query,
                            (project_name_id_result[0][0], select_url_id_data[0]))
                    select_url_id = db.fetchall()
                    select_URL_data = select_url_id[0][0]
                    # print(common)
                    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name,Severity FROM owasp WHERE OID=10")
                    db.execute(query2,)             
                    sql2_ = db.fetchall() 
                    word_list = json.loads(sql_[0][0])
                    # print(word_list)
                    wordlist_path = f'wordlistxss-sql-{key}.txt'
                    with open(wordlist_path, 'w') as file:
                        for item in word_list:
                            file.write(item + '\n')
                    results = []
                    with open(wordlist_path, 'r') as file:
                        data = file.read()

                    if await is_array(data):
                        array_data = ast.literal_eval(data)
                        with open(wordlist_path, 'w') as file:
                            for item in array_data:
                                file.write(str(item) + '\n')
                        print(f'newfile: {wordlist_path}')
                    else:
                        print('no newfile')

                    # Now you can open the new file
                    f = open(wordlist_path, "r")
                    for i in att_paramsname:
                        f.seek(0)
                        for payload in f:
                            new_att_params = att_params.copy()
                            new_att_params[i] = payload.strip()
                            # print(new_att_params)
                            if payload != '':
                                response = await get_response(att_url, cookies_data_,new_att_params)
                                # print(f"att_url",att_url)  
                                # print(unquote(response.url))
                                # print(len(response.content))
                                # print(contentlenpercent(response,baseper))
                                vres = False
                                
                                
                                if await checkscript(response,payload.strip()) == True:
                                    print('XSS found with : '+ payload.strip()+' in '+ i)
                                    vres = True
                                    vparams = i
                                    insert_query = (
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                                    )
                                    values = (select_url_id_data[0],project_name_id_result[0][0],'10',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                                    db.execute(insert_query, values)
                                    mysql.connection.commit()
                                    return vres,vparams
                                elif int(await contentlenpercent(response,baseper)) > 70:
                                    print('XSS found with : '+ payload.strip()+' in '+ i) 
                                    print(int(await contentlenpercent(response,baseper)))
                                    vres = True
                                    vparams = i
                                    insert_query = (
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                                    )
                                    values = (select_url_id_data[0],project_name_id_result[0][0],'10',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                                    db.execute(insert_query, values)
                                    mysql.connection.commit()
                                    return vres,vparams
                                else:
                        
                                    print('XSS not found w/ '+ payload.strip())
            i += 1
    except Exception as e:
        print(f"brutexss: {e}")
        return None


async def brutepathtraversal(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data_):
    try:
        db = mysql.connection.cursor()
        key_query = "SELECT JSON_KEYS(payloadlist) AS json_keys FROM owasp WHERE OID = 4"
        db.execute(key_query,)
        json_keys_result = db.fetchone()
        print("json_keys_result",json_keys_result)
        if json_keys_result:
            json_keys_str = json_keys_result[0] 
            print("json_keys_str",json_keys_str)
            json_keys_list = json.loads(json_keys_str) 
            print("json_keys_list",json_keys_list)
            for key in json_keys_list:
                    print(key)
                    query = "SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, %s)) AS payload FROM owasp WHERE OID=4"
                    db.execute(query, (f'$.{key}',))             
                    sql_ = db.fetchall() 
                    print("sql_",sql_)
                    select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
                    db.execute(select_project_name_id_query, (project_name, user))
                    project_name_id_result = db.fetchall()
                    select_url_id_query = "SELECT URL FROM urllist WHERE PID = %s AND URL_ID = %s "
                    db.execute(select_url_id_query,
                            (project_name_id_result[0][0], select_url_id_data[0]))
                    select_url_id = db.fetchall()
                    select_URL_data = select_url_id[0][0]
                    # print(common)
                    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name,Severity FROM owasp WHERE OID=4")
                    db.execute(query2,)             
                    sql2_ = db.fetchall() 
                    word_list = json.loads(sql_[0][0])
                    # print(word_list)
                    wordlist_path = f'wordlistbrutepathtraversal-{key}.txt'
                    with open(wordlist_path, 'w') as file:
                        for item in word_list:
                            file.write(item + '\n')
                    results = []
                    with open(wordlist_path, 'r') as file:
                        data = file.read()

                    if await is_array(data):
                        array_data = ast.literal_eval(data)
                        with open(wordlist_path, 'w') as file:
                            for item in array_data:
                                file.write(str(item) + '\n')
                        print(f'newfile: {wordlist_path}')
                    else:
                        print('no newfile')

                    # Now you can open the new file
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
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                                    )
                                values = (select_url_id_data[0],project_name_id_result[0][0],'4',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                                db.execute(insert_query, values)
                                mysql.connection.commit()
                                return vres,vparams
                                                      
                            else:
                                print('[-] Path traversal not found w/ '+ payload.strip())
                    
                    # return vres,vparams
    except Exception as e:
        print(f"brutepathtraversal: {e}")
        return None

async def brutecommand(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data_,req_body):
    try:
        db = mysql.connection.cursor()
        key_query = "SELECT JSON_KEYS(payloadlist) AS json_keys FROM owasp WHERE OID = 12"
        db.execute(key_query,)
        json_keys_result = db.fetchone()
        print("json_keys_result",json_keys_result)
        if json_keys_result:
            json_keys_str = json_keys_result[0] 
            print("json_keys_str",json_keys_str)
            json_keys_list = json.loads(json_keys_str) 
            print("json_keys_list",json_keys_list)
            for key in json_keys_list:
                    print(key)
                    query = "SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, %s)) AS payload FROM owasp WHERE OID=12"
                    db.execute(query, (f'$.{key}',))             
                    sql_ = db.fetchall() 
                    print("sql_",sql_)
                    select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
                    db.execute(select_project_name_id_query, (project_name, user))
                    project_name_id_result = db.fetchall()
                    select_url_id_query = "SELECT URL FROM urllist WHERE PID = %s AND URL_ID = %s "
                    db.execute(select_url_id_query,
                            (project_name_id_result[0][0], select_url_id_data[0]))
                    select_url_id = db.fetchall()
                    select_URL_data = select_url_id[0][0]
                    # print(common)
                    query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name,Severity FROM owasp WHERE OID=12")
                    db.execute(query2,)             
                    sql2_ = db.fetchall() 
                    word_list = json.loads(sql_[0][0])
                    # print(word_list)
                    wordlist_path = f'wordlistbrutepathtraversal-{key}.txt'
                    with open(wordlist_path, 'w') as file:
                        for item in word_list:
                            file.write(item + '\n')
                    results = []
                    with open(wordlist_path, 'r') as file:
                        data = file.read()

                    if await is_array(data):
                        array_data = ast.literal_eval(data)
                        with open(wordlist_path, 'w') as file:
                            for item in array_data:
                                file.write(str(item) + '\n')
                        print(f'newfile: {wordlist_path}')
                    else:
                        print('no newfile')

                    # Now you can open the new file
                    f = open(wordlist_path, "r")
                    for i in att_paramsname:
                        f.seek(0)
                        for payload in f:
                            new_att_params = att_params.copy()
                            new_att_params[i] = payload.strip()
                            print(new_att_params)
                    
                            response = await post_response(att_url, cookies_data_,req_body)
                            print('contenttttt : '+str(response.text))
                            # print(len(response.content))
                            # print(contentlenpercent(response,baseper))
                            vres = False
                            
                            checkcontent = (await contentlenpercent(response,baseper))
                            print(checkcontent)
                            if response.status_code == 200 and (int(checkcontent) > 70):
                                print('[+] Command injection found with : '+ payload.strip()+' in '+ i )
                                print(response.status_code)
                                vres = True
                                vparams = i
                                insert_query = (
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,position,state,payload,status_code,reason,res_header,res_body,req_header,req_body,method,URI,length,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s,  %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                                    )
                                values = (select_url_id_data[0],project_name_id_result[0][0],'12',baseatt_URL,unquote(response.url),'T',payload.strip(),response.status_code,response.reason,response.headers, base64.b64encode(response.text.encode()).decode('utf-8'),response.request.headers,response.request.body,response.request.method,urlparse(response.request.path_url).path, len(response.text) ,sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                                db.execute(insert_query, values)
                                mysql.connection.commit()   
           
                                return vres,vparams
                            
                            else:
                                print('[-] Command injection not found w/ '+ payload.strip())
        
        return vres,vparams
    except Exception as e:
        print(f"brutexss: {e}")
        return None
    




async def detect_pathtraversal(pathtraversal):
    try:
        db = mysql.connection.cursor()
        query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.pathraversal')) AS payload FROM owasp WHERE OID=4")
        db.execute(query,)
        sql_ = db.fetchall()
        query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType, Vul_name,Severity FROM owasp WHERE OID=4")
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
                                "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,payload,vul_des , vul_sol , vul_ref , OType, Vul_name ,Severity) VALUES (%s,%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s,%s)"
                            ),
                            values = (Server_data[3], Server_data[2], '4', Server_data[0], 'T', Server_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                            db.execute(insert_query, values)
                            mysql.connection.commit()
                        else:
                            print("ไม่พบ detect word listpathraversal")
    except Exception as e:
        print(f"HTTP error: {e}")
        return None

async def run_gobuster(url,project_name,user):
    try:
        db = mysql.connection.cursor()
        query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.common')) AS payload FROM owasp WHERE OID=13")
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
            # 'C:\\Users\\b_r_r\\OneDrive\\เดสก์ท็อป\\pj2566new\\gobuster_Windows_x86_64\\gobuster.exe',
            'D:\\SpecialP\\projectfinal\\gobuster_Windows_x86_64\\gobuster.exe',
            'dir',
            '-u', url,
            '-r',
            '-t', '10',
            '-w', wordlist_path,
            '-o', f'{project_name}{user}.txt'
]

        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running gobuster: {e}")



async def checkTempFuzz(i,project_name,user,baseURL,Host,cookies_data,http_log_data,visited_urls,state='T'):
    try:
        file_path = f"{project_name}{user}.txt"
        if os.path.exists(file_path):
            try:
                with open(file_path, "r") as f:
                    lines = f.readlines()
                lines = [line.replace('', ' ') for line in lines]
                lines = [line for line in lines if '(Status: 500)' not in line and '(Status: 429)' not in line and '(Status: 403)' not in line and '(Status: 400)' not in line and '(Status: 301)' not in line and '()']


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
    except Exception as e:
        print(f"HTTP error: {e}")
        return None

async def run_gobustersensitive(url,project_name,user):
    try:
        db = mysql.connection.cursor()
        query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.sensitive')) AS payload FROM owasp WHERE OID=7")
        db.execute(query,)             
        common = db.fetchall() 
        # print(common)
        word_list = json.loads(common[0][0])
        # print(word_list)
        wordlist_path = 'wordlistzsensitive.txt'
        with open(wordlist_path, 'w') as file:
            for item in word_list:
                file.write(item + '\n')
        command = [
            # 'C:\\Users\\b_r_r\\OneDrive\\เดสก์ท็อป\\pj2566new\\gobuster_Windows_x86_64\\gobuster.exe',
            'D:\\SpecialP\\projectfinal\\gobuster_Windows_x86_64\\gobuster.exe',
            'dir',
            '-u', url,
            '-r',
            '-t', '10',
            '-w', wordlist_path,
            '-o', f'Sensitive{project_name}{user}.txt'
]

        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running gobuster: {e}")



async def checkTempFuzzsensitive(i,project_name,user,scope_url,project_name_id):
    try:
        file_path = f"Sensitive{project_name}{user}.txt"
        print("project_name_id",project_name_id)
        print("scope_url",scope_url)
        db = mysql.connection.cursor()

        select_project_name_id_query = "SELECT URL_ID FROM urllist WHERE URL = %s AND PID = %s"
        db.execute(select_project_name_id_query, (scope_url, project_name_id))             
        url_ID = db.fetchone() 
        print("url_ID",url_ID[0])
        query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType, Vul_name , Severity FROM owasp WHERE OID=7")
        db.execute(query2)             
        sql2_ = db.fetchall() 
        print("sql2_",sql2_)
        if os.path.exists(file_path):
            try:
                with open(file_path, "r") as f:
                    lines = f.readlines()
                lines = [line.replace('', ' ') for line in lines]
                lines = [line for line in lines if '(Status: 500)' not in line and '(Status: 429)' not in line and '(Status: 403)' not in line and '(Status: 400)' not in line and '(Status: 301)' not in line and '()']


                with open(file_path, 'w') as file:
                    file.writelines(lines)

                with open(file_path, "r") as f:
                    j = 1

                    for x in f:
                        print(" x.split()[0]", x.split()[0])
                        baseURL = urlparse(scope_url).scheme + '://' + urlparse(scope_url).netloc
                        url = baseURL+x.split()[0]
                        print(url)
                        print(get_response(url))
                        db = mysql.connection.cursor()
                        insert_query = (
                            "INSERT INTO att_ps (URL_ID, position , PID, OID, URL, state, payload, vul_des, vul_sol, vul_ref, OType, Vul_name,Severity) "
                            "VALUES (%s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                        )
                        values = (url_ID[0], url ,project_name_id, '7', scope_url, 'T', x.split()[0], sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][3], sql2_[0][4], sql2_[0][5])
                        db.execute(insert_query, values)
                        mysql.connection.commit()

                        # # print(baseURL+ x.split()[0], end='\n')
                        # j = j+1
                        # if (url) not in visited_urls:
                        #     response = await get_response(url,cookies_data)
                        #     if response is not None:
                        #         print("responsefuzz",response)
                        #         await save_log(response, i,project_name,user,Host,http_log_data)
                        #         i = i+1

            except IOError as e:
                print(f"Error reading file: {e}")
        else:
            print(f"The file {file_path} does not exist.")
        return i
    except Exception as e:
        print(f"HTTP error: {e}")
        return None
    

async def detect_web_server_leakage(Server):
    try:
        db = mysql.connection.cursor()
        query2 = "SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name ,Severity FROM owasp WHERE OID=1"
        db.execute(query2)
        sql2_ = db.fetchall()
        
        for Server_data in Server:
            Server_word = "Server"
            if Server_data[1].find(Server_word) != -1:
                print("พบ Server")
                db = mysql.connection.cursor()
                insert_query = (
                    "INSERT INTO att_ps (URL_ID, PID, OID, URL, state, res_header, vul_des, vul_sol, vul_ref, OType, Vul_name,Severity) VALUES (%s,%s,  %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                )
                values = (Server_data[3], Server_data[2], '1', Server_data[0], 'T', Server_data[1], sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][3], sql2_[0][4], sql2_[0][5])
                db.execute(insert_query, values)
                mysql.connection.commit()
            else:
                print("ไม่พบ Server")
    except Exception as e:
        print(f"HTTP error: {e}")
        return None

async def HSTS(PTarget):
    try:
        db = mysql.connection.cursor()
        query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name ,Severity  FROM owasp WHERE OID=8")
        db.execute(query2,)             
        sql2_ = db.fetchall()
        for HSTS_data in PTarget:
            print(f"res_header[1]",HSTS_data[1])
            print(f"URL[0]",HSTS_data[0])
            print(f"PID[2]",HSTS_data[2])
            print(f"URL_ID[3]",HSTS_data[3])
            # HSTS_word = ["Strict-Transport-Security", "includeSubDomains", "preload", "max-age"]
            HSTS_word = ["Strict-Transport-Security", "includeSubDomains"]

            if HSTS_word[0] in HSTS_data[1]:
                print("Strict-Transport-Security")
            elif HSTS_word[1] in HSTS_data[1]:
                print("includeSubDomains")
            # elif HSTS_word[2] in HSTS_data[1]:
            #     print("preload")
            # elif HSTS_word[3] in HSTS_data[1]:
            #     print("max-age")
            else:
                db = mysql.connection.cursor()
                insert_query = (
                        "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity ) VALUES (%s,%s, %s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                        )
                values = (HSTS_data[3],HSTS_data[2],'8',HSTS_data[0],'T',HSTS_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                db.execute(insert_query, values)
                mysql.connection.commit()
                print("ไม่พบ Strict-Transport-Security")
    except Exception as e:
        print(f"HTTP error: {e}")
        return None







async def webFramework(PTarget):
    try:
        db = mysql.connection.cursor()

        query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.web_response')) AS payload FROM owasp WHERE OID=9")
        db.execute(query)
        sql_ = db.fetchall()
        print("word_list",sql_)
        query2 = ("SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name,Severity FROM owasp WHERE OID=9")
        db.execute(query2)
        sql2_ = db.fetchall()


        word_list = json.loads(sql_[0][0])
        # print("word_list",word_list)
        wordlist_path = 'WEB_word.txt'
        with open(wordlist_path, 'w') as file:
            for item in word_list:
                file.write(item + '\n')

        with open(wordlist_path, 'r') as file:
            for payload in file:

                detected_payload = payload
                for HSTS_data in PTarget:
                    if detected_payload in HSTS_data[1]:
                        print(f"Detected web framework: {detected_payload}")

                        db = mysql.connection.cursor()
                        insert_query = (
                                "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity ) VALUES (%s,%s, %s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                                )
                        values = (HSTS_data[3],HSTS_data[2],'9',HSTS_data[0],'T',HSTS_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                        db.execute(insert_query, values)
                        mysql.connection.commit()
                    else:
                        print("ไม่พบwebframe")
    except Exception as e:
        print(f"HTTP error: {e}")
        return None


async def webFrameworkhtml(PTarget):
    try:
        db = mysql.connection.cursor()

        query = ("SELECT JSON_UNQUOTE(JSON_EXTRACT(payloadlist, '$.web-html')) AS payload FROM owasp WHERE OID=9")
        db.execute(query)
        sql_ = db.fetchall()
        print("word_list",sql_)
        query2 = ("SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name,Severity FROM owasp WHERE OID=9")
        db.execute(query2)
        sql2_ = db.fetchall()


        word_list = json.loads(sql_[0][0])
        # print("word_list",word_list)
        wordlist_path = 'WEB_wordHTML.txt'
        with open(wordlist_path, 'w') as file:
            for item in word_list:
                file.write(item + '\n')

        with open(wordlist_path, 'r') as file:
            for payload in file:
                detected_payload = payload.strip()
                for HSTS_data in PTarget:
                    encoded_data = HSTS_data[1]
                    print("detected_payload",detected_payload)
                    try:
                        decoded_data = base64.b64decode(encoded_data).decode('utf-8')
                        if detected_payload in decoded_data:

                            
                            # print(f"Detected web framework: {detected_payload}")

                            db = mysql.connection.cursor()
                            insert_query = (
                                    "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity ) VALUES (%s,%s, %s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s)"
                                    )
                            values = (HSTS_data[3],HSTS_data[2],'9',HSTS_data[0],'T',HSTS_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                            db.execute(insert_query, values)
                            mysql.connection.commit()
                            break  
                    except Exception as decode_error:
                        print(f"Error decoding {encoded_data}: {decode_error}")

                else:
                    print("ไม่พบwebframehtml")

    except Exception as e:
        print(f"HTTP error: {e}")
        return None






async def check_cookie_attributes(Server):
    try:
        db = mysql.connection.cursor()
        query2 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name,Severity FROM owasp WHERE OID=2")
        db.execute(query2,)             
        sql2_ = db.fetchall()
        query3 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType,Vul_name,Severity FROM owasp WHERE OID=3")
        db.execute(query3,)             
        sql3_ = db.fetchall()
        query5 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType ,Vul_name,Severity FROM owasp WHERE OID=5")
        db.execute(query5,)             
        sql5_ = db.fetchall()
        query6 = ("SELECT Vul_des , Vul_sol , Vul_ref , OType ,Vul_name,Severity FROM owasp WHERE OID=6")
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
                        "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s ,%s)"
                        )
                    values = (Server_data[3],Server_data[2],'2',Server_data[0],'T',Server_data[1],sql2_[0][0],sql2_[0][1],sql2_[0][2],sql2_[0][3],sql2_[0][4],sql2_[0][5])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                
                if Server_data[1].find(HttpOnly_Header) != -1:
                        web = Server_data[1].find(HttpOnly_Header)
                else:
                    db = mysql.connection.cursor()
                    insert_query = (
                        "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s ,%s)"
                        )
                    values = (Server_data[3],Server_data[2],'3',Server_data[0],'T',Server_data[1],sql3_[0][0],sql3_[0][1],sql3_[0][2],sql3_[0][3],sql3_[0][4],sql3_[0][5])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                    print(f'ไม่พบ HttpOnly:{Server_data[0]}')

                if Server_data[1].find(Expires_Header) != -1:
                        web = Server_data[1].find(Expires_Header)
                        print(f'{web}')
                else:

                    db = mysql.connection.cursor()
                    insert_query = (
                        "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s ,%s)"
                        )
                    values = (Server_data[3],Server_data[2],'5',Server_data[0],'T',Server_data[1],sql5_[0][0],sql5_[0][1],sql5_[0][2],sql5_[0][3],sql5_[0][4],sql5_[0][5])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                    print(f'ไม่พบ Expires:{Server_data[0]}')


                if Server_data[1].find(SameSite_Header) != -1:
                        web = Server_data[1].find(SameSite_Header)
                        print(f'{web}')
                else:
                    
                    db = mysql.connection.cursor()
                    insert_query = (
                        "INSERT INTO att_ps (URL_ID, PID, OID, URL,state,res_header,vul_des , vul_sol , vul_ref , OType,Vul_name,Severity) VALUES (%s,%s, %s, %s ,%s ,%s ,%s,%s ,%s ,%s ,%s ,%s)"
                        )
                    values = (Server_data[3],Server_data[2],'6',Server_data[0],'T',Server_data[1],sql6_[0][0],sql6_[0][1],sql6_[0][2],sql6_[0][3],sql6_[0][4],sql6_[0][5])
                    db.execute(insert_query, values)
                    mysql.connection.commit()
                    print(f'ไม่พบ SameSite:{Server_data[0]}')
    except Exception as e:
        print(f"HTTP error: {e}")
        return None


@app.route("/crawl", methods=['POST'])
async def crawl_endpoint():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user_ = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        user = user_.get('username', None)
        admin = user_.get('role', None)
        visited_urls = []
        cookies_data = {}
        http_log_data = {}
        res = {}
        req = {}
        i = 1
        visited_post={}

        project_name = request.json['project_name']
     
        # user = request.json['authUser']
        scope_url = request.json['url']
        Host = urlparse(scope_url).netloc
        baseURL = urlparse(scope_url).scheme + '://' + urlparse(scope_url).netloc
        description_name = request.json['description']
        # print(i)
        # print(visited_urls)

        db = mysql.connection.cursor()

        project_name_check = "SELECT PName FROM project WHERE username = %s"
        db.execute(project_name_check, (user,))     
        project_name_checkk = db.fetchall()
        for projectname in project_name_checkk:
            if projectname[0] == project_name:
                 Change = "Change name project name"
                 return {"Change":Change} 
               


        insert_query11 = ('INSERT INTO project(PName,PTarget,PDes,username,EndTime) VALUES(%s, %s, %s, %s, NULL )')
        values11 = (project_name, scope_url, description_name, user)
        db.execute(insert_query11, values11)
        mysql.connection.commit()
        csv_name = f"{project_name}.csv"
        try:            
            cres = await crawl(scope_url,project_name,user,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
        except Exception as e:
            print(f"crawl error: {e}")
        # print("cres",cres)
        db = mysql.connection.cursor()
        select_project_name_id_query = "SELECT PID FROM project WHERE PName = %s AND  username = %s"
        db.execute(select_project_name_id_query, (project_name, user))             
        project_name_id_result = db.fetchall()   

        try:   
            print(project_name_id_result[0][0])
            await run_gobuster(baseURL,project_name,user)
            print("baseURL",baseURL)        
            await checkTempFuzz(i,project_name,user,baseURL,Host,cookies_data,http_log_data,visited_urls)
        except Exception as e:
                    print(f"run_gobuster: {e}")
        db = mysql.connection.cursor()
        queryServer = "SELECT URL,res_header,PID,URL_ID FROM urllist WHERE PID = %s"
        db.execute(queryServer, (project_name_id_result))
        Server = db.fetchall()
        try:   
            await detect_web_server_leakage(Server)
        except Exception as e:
                    print(f"detect_web_server_leakage: {e}")
        try:  
             await check_cookie_attributes(Server)
        except Exception as e:
                    print(f"check_cookie_attributes: {e}")
        querypathtraversal = "SELECT URL,req_header,PID,URL_ID FROM urllist WHERE PID = %s"
        db.execute(querypathtraversal, (project_name_id_result))
        pathtraversal = db.fetchall()

        try:
            await detect_pathtraversal(pathtraversal)
        except Exception as e:
                    print(f"await detect_pathtraversal(pathtraversal): {e}")


        queryPTarget = "SELECT URL,res_header,PID,URL_ID  FROM urllist WHERE PID = %s AND URL = %s"
        db.execute(queryPTarget, (project_name_id_result,scope_url))
        PTarget = db.fetchall()
        print("PTarget", PTarget[0][1])
        try:
            await HSTS(PTarget)
            await webFramework(PTarget)
        except Exception as e:
            print(f"await webFramework(PTarget): {e}")


        queryPTargethtml = "SELECT URL,res_body,PID,URL_ID  FROM urllist WHERE PID = %s AND URL = %s"
        db.execute(queryPTargethtml, (project_name_id_result,scope_url))
        PTarget = db.fetchall()
        
        try:       
            await webFrameworkhtml(PTarget)
        except Exception as e:
            print(f"await webFrameworkhtml(PTarget): {e}")


        db = mysql.connection.cursor()
        queryURL_data = "SELECT URL , method,req_body FROM urllist WHERE PID = %s"
        db.execute(queryURL_data, (project_name_id_result))
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
                # print("project_name",project_name)
                try:
                    await brutesql(att_url, att_params, baseper,select_url_id_data,baseatt_URL,project_name, user,cookies_data)
                except Exception as e:
                    print(f"brutesql: {e}")
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
                print("project_name",project_name)
                try: 
                    await brutexss(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data)
                except Exception as e:
                    print(f"brutexss: {e}")
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
                print("project_name",project_name) 
                try:   
                    await brutepathtraversal(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data)
                except Exception as e:
                    print(f"brutepathtraversal: {e}")
                                    # if vres and vparams != None:
                #     print(vres)
                #     print(vparams)
            else:
                print('[-] we cannot find path traversal')


            if url_data[1] == 'POST':
                print("url_data[0] POST",url_data[1])
                if url_data[2] != None :
                    att_paramsnum = len(url_data[2].split('&'))
                    att_params={}
                    att_paramsname = []
                    #parse full query to dictionary
                    for i in url_data[2].split('&'):
                        #params=value
                        # print(i)
                        att_params.update({i.split('=')[0]: i.split('=')[1]})
                        att_paramsname.append(i.split('=')[0])
                    # print(att_url)
                    try:      
                        await brutecommand(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data,url_data[2])
                    except Exception as e:
                        print(f"brutepathtraversal: {e}")
                    # if vres and vparams != None:
                    #     print(vres)
                    #     print(vparams)
            else:
                print('[-] we cannot find command injection')
  
  
        try:        
            await run_gobustersensitive(baseURL,project_name,user)
            print("baseURLsensitive",baseURL)
            await checkTempFuzzsensitive(i,project_name,user,scope_url,project_name_id_result[0][0])
        except Exception as e:
            print(f"run_gobustersensitive: {e}")
                

        db = mysql.connection.cursor()
        queryServer = "SELECT URL,res_header,PID,URL_ID FROM urllist WHERE PID = %s"
        db.execute(queryServer, (project_name_id_result))


        db = mysql.connection.cursor()
        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id_result[0][0], '11'))
        select_att_ID_sql_DATA = db.fetchall()
        if select_att_ID_sql_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=11"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "High")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")



        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id_result[0][0], '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        if select_att_ID_xsssql_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=10"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "High")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")





        select_att_ID_traversal = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id_result[0][0], '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        if select_att_ID_select_att_traversal_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=4"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Medium")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")


        select_att_ID_traversal = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id_result[0][0], '7'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        if select_att_ID_select_att_traversal_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=7"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Medium")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")


        select_att_ID_secure = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_name_id_result[0][0], '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        if select_att_ID_select_att_secure_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=2"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Low")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")

        select_att_ID_httponly = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_name_id_result[0][0], '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        if select_att_ID_select_att_httponly_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=3"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Low")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")




        select_att_ID_expire = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_name_id_result[0][0], '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        if select_att_ID_select_att_expire_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=5"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Low")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")




        select_att_ID_samsite = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_name_id_result[0][0], '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        if select_att_ID_select_att_samsite_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=6"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Low")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")
    




        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id_result[0][0], '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        if select_att_ID_select_att_server_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=1"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Low")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")


            
    
        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id_result[0][0], '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        if select_att_ID_select_att_HSTS_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=8"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Low")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")


        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id_result[0][0], '9'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        if select_att_ID_select_att_HSTS_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=9"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "Low")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")

        select_att_ID_command = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_command, (project_name_id_result[0][0], '12'))
        select_att_ID_select_att_command_DATA = db.fetchall()
        if select_att_ID_select_att_command_DATA:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name FROM owasp WHERE OID=12"
             db.execute(query2)
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id_result[0][0], "High")
             db.execute(insert_query, values)
             mysql.connection.commit()
        else:
            print("ไม่มีข้อมูล")

        db = mysql.connection.cursor()
        EndTime_query = ('UPDATE project SET EndTime = CURRENT_TIMESTAMP WHERE PID = %s')
        db.execute(EndTime_query, (project_name_id_result,))
        mysql.connection.commit()


        return {"project_name_id_result":project_name_id_result }
    except Exception as e:
        return jsonify({"server error": str(e)})


@app.route("/save", methods=['POST'])
def savee():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Admin = user.get('role', None)
        PID = request.json["project_name"]
        print("PID",PID)


        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, PID))
        username = db.fetchall()

     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403

        db = mysql.connection.cursor()
        EndTime_query = ('UPDATE project SET EndTime = CURRENT_TIMESTAMP WHERE PID = %s')
        db.execute(EndTime_query, (PID,))
        mysql.connection.commit()
        # print(project_data)

        return jsonify({"project_data"})
    except Exception as e:
        return jsonify({"server error": str(e)})

@app.route("/home", methods=['GET'])
def home():
    try:
        user_data = None
        token = request.headers.get('Authorization').split(' ')[1]
        if token is None:
            return jsonify({'error': 'Token is missing'}), 403        
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)




        
        db = mysql.connection.cursor()
        query = "SELECT PDes, PName, PID,PTarget,timeproject,EndTime FROM project WHERE username = %s"
        db.execute(query, (user_data,))
        project_data = db.fetchall()
        db.close()
        # print(project_data)



        return jsonify({"project_data": project_data})
    except Exception as e:
        print(e)
        return jsonify({"server error": str(e)})

@app.route("/DashboardAll", methods=['GET'])
def DashboardAll():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        db = mysql.connection.cursor()
        query = "SELECT project.PName, project.PTarget ,att_ps.OID,att_ps.position,project.PID,att_ps.Vul_name FROM att_ps JOIN project ON att_ps.PID = project.PID JOIN urllist ON att_ps.URL_ID = urllist.URL_ID JOIN user ON project.username = user.username WHERE att_ps.state = %s AND user.username = %s "
        db.execute(query, ('T',user_data,))
        project_data_DashboardAll = db.fetchall()
        query2 = "SELECT timeproject , EndTime FROM project WHERE username = %s"
        db.execute(query2,(user_data,))
        project_Time = db.fetchall()
        # print(project_Time)


        # owasp_query = """
        #     SELECT owasp.PID, owasp.Severity, owasp.Vul_name
        #     FROM owasp
        #     JOIN project ON owasp.PID = project.PID
        #     WHERE project.username = %s
        # """
        # db.execute(owasp_query, (user_data,))
        # owasp_data = db.fetchall()

        owasp_query2 = """
            SELECT project.PName, project.PTarget, att_ps.Vul_name, att_ps.position, project.PID, owasp.Severity
            FROM att_ps
            JOIN project ON att_ps.PID = project.PID
            JOIN urllist ON att_ps.URL_ID = urllist.URL_ID
            JOIN user ON project.username = user.username
            JOIN owasp ON owasp.PID = project.PID AND owasp.Vul_name = att_ps.Vul_name
            WHERE att_ps.state = %s AND user.username = %s
        """
        db.execute(owasp_query2, ('T',user_data,))
        owasp_data2 = db.fetchall()
        # print(owasp_data2)
        

        # vul_name_counts = Counter((row[1], row[5]) for row in owasp_data2)

        # # แสดงผลลัพธ์
        # for (vul_name, severity), count in vul_name_counts.items():
        #     print(f"Vul_name: {vul_name}, Severity: {severity}, Count: {count}")
        for start_time, end_time in project_Time:
            if start_time != end_time:
                time = 0
            else:
                print(start_time, end_time)
                time = 1
                break

        # print(project_data)

        return jsonify({"project_data_DashboardAll": project_data_DashboardAll},{"time":time},{"owasp_data2":owasp_data2})
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
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()

     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403



        targets_url = "SELECT PTarget , PDes FROM project WHERE username = %s AND PID = %s"
        db.execute(targets_url, (user_data, project_name_id))
        url_target = db.fetchall()

        # print(url_target)
        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'SQL Injection'))
        Severity11 = db.fetchall()
        if Severity11:
            Severity11= Severity11
        else:
            Severity11= [0] 

        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Stored Cross Site Scriptng'))
        Severity10 = db.fetchall()
        if Severity10:
            Severity10 = Severity10
        else:
            Severity10 = [0]            

        select_att_ID_traversal = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Directory Traversal File Include'))
        Severity4 = db.fetchall()  
        if Severity4:
            Severity4 = Severity4
        else:
            Severity4 = [0]


        select_att_ID_secure = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_name_id, '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing Secure Attribute in Cookie Header'))
        Severity2 = db.fetchall()  
        if Severity2:
            Severity2 = Severity2
        else:
            Severity2 = [0]


        select_att_ID_httponly = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_name_id, '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing HttpOnly Attribute in Cookie Header'))
        Severity3 = db.fetchall()  
        if Severity3:
            Severity3 = Severity3
        else:
            Severity3 = [0]


        select_att_ID_expire = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_name_id, '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing Expires Attribute in Cookie Header'))
        Severity5 = db.fetchall()  
        if Severity5:
            Severity5 = Severity5
        else:
            Severity4 = [0]



        select_att_ID_samsite = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_name_id, '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing SameSite Attribute in Cookie Header'))
        Severity6 = db.fetchall()  
        if Severity6:
            Severity6 = Severity6
        else:
            Severity6 = [0]
    
        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Web Server Infomation Leakage through Server header'))
        Severity1 = db.fetchall()  
        if Severity1:
            Severity1= Severity1
        else:
            Severity1= [0]
    
        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing HTTP Strict Transport Security Header'))
        Severity8 = db.fetchall()  
        if Severity8:
            Severity8= Severity8
        else:
            Severity8= [0]
   

        select_att_ID_Sentitive = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s"
        db.execute(select_att_ID_Sentitive, (project_name_id, '7'))
        select_att_ID_Sentitive = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Sensitive File Disclosure'))
        Severity7 = db.fetchall()  
        if Severity7:
            Severity7= Severity7
        else:
            Severity7= [0]

        select_att_ID_web="SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s"
        db.execute(select_att_ID_web, (project_name_id, '9'))
        select_att_ID_webb = db.fetchall()
        select_att_ID_web = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_web, (project_name_id, 'Web Application Framework Infomation Leakage'))
        Severity9 = db.fetchall()  
        if Severity9:
            Severity9= Severity9
        else:
            Severity9= [0]

        select_att_ID_command="SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s"
        db.execute(select_att_ID_command, (project_name_id, '12'))
        select_att_ID_commandd = db.fetchall()
        select_att_ID_command = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_command, (project_name_id, 'Command Injection'))
        Severity12 = db.fetchall()  
        if Severity12:
            Severity12= Severity12
        else:
            Severity12= [0]

        owasp_query = "SELECT Vul_name, Severity ,OID FROM owasp WHERE PID = %s"
        db.execute(owasp_query, (project_name_id,))
        owasp_ = db.fetchall()
        valueTime_query = "SELECT timeproject FROM project WHERE PID = %s"
        db.execute(valueTime_query, (project_name_id,))
        valueTimep = db.fetchall()

        valueEND_query = "SELECT EndTime FROM project WHERE PID = %s"
        db.execute(valueEND_query, (project_name_id,))
        valueENDp = db.fetchall()

        if valueTimep and valueENDp and valueTimep[0][0] == valueENDp[0][0]:
            valueENDpp = None
        else:
            valueENDpp = valueENDp

        return jsonify({"url_target": url_target}, {"select_att_sql_DATA": [select_att_ID_sql_DATA,Severity11]}, {"select_att_ID_xsssql_DATA": [select_att_ID_xsssql_DATA,Severity10]}, {"select_att_ID_select_att_traversal_DATA": [select_att_ID_select_att_traversal_DATA,Severity4]}, {"Role": Role},{"select_att_ID_select_att_secure_DATA":[select_att_ID_select_att_secure_DATA,Severity2]},{"select_att_ID_select_att_httponly_DATA":[select_att_ID_select_att_httponly_DATA,Severity3]},{"select_att_ID_select_att_expire_DATA":[select_att_ID_select_att_expire_DATA,Severity5]},{"select_att_ID_select_att_samsite_DATA":[select_att_ID_select_att_samsite_DATA,Severity6]}
                       ,{"select_att_ID_select_att_server_DATA":[select_att_ID_select_att_server_DATA,Severity1]},{"select_att_ID_select_att_HSTS_DATA":[select_att_ID_select_att_HSTS_DATA,Severity8]},{"valueENDpp":valueENDpp},{"valueTimep":valueTimep},{"owasp_":owasp_}, {"select_att_ID_Sentitive": [select_att_ID_Sentitive,Severity7]}, {"select_att_ID_webb": [select_att_ID_webb,Severity9]}, {"select_att_ID_commandd": [select_att_ID_commandd,Severity12]})
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
async def addurls():
    try:
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)


        url = request.json['urls']
        encoded_url = quote(url, safe=':/?=&')
        print(encoded_url)
        method = request.json['method']
        parameter = request.json['parameter']
        project_name_id = request.json['project_name_id']
        Host = urlparse(encoded_url).netloc
        baseURL = urlparse(encoded_url).scheme + '://' + urlparse(encoded_url).netloc
        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        print(username)
        visited_urls = []
        cookies_data = {}
        http_log_data = {}
        visited_post={}
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        
        project_name_check = "SELECT PName FROM project WHERE username = %s AND PID=%s"
        db.execute(project_name_check, (user_data,project_name_id))     
        project_name_checkk = db.fetchall()
        print("project_name_checkk",project_name_checkk[0][0])
        try:

            # query = ('INSERT INTO urllist(URL,method,PID,state,status_code) VALUES(%s,%s,%s,%s,%s)')
            # db.execute(query, (url, method, project_name_id, 'c',parameter),)
            # mysql.connection.commit()
            cres = await crawladd(encoded_url,project_name_checkk[0][0],user_data,Host,baseURL,cookies_data,http_log_data,visited_urls,visited_post)
        except Exception as e:
            print(f"crawl error: {e}")
        db = mysql.connection.cursor()
        queryServer = "SELECT URL,res_header,PID,URL_ID FROM urllist WHERE PID = %s AND URL= %s"
        db.execute(queryServer, (project_name_id,encoded_url))
        Server = db.fetchall()
        try:   
            await detect_web_server_leakage(Server)
            print(f"detect_web_server_leakage(Parget): {encoded_url}")
        except Exception as e:
                    print(f"detect_web_server_leakage: {e}")
        try:  
             await check_cookie_attributes(Server)
             print(f"check_cookie_attributes(Parget): {encoded_url}")
        except Exception as e:
                    print(f"check_cookie_attributes: {e}")
        querypathtraversal = "SELECT URL,req_header,PID,URL_ID FROM urllist WHERE PID = %s AND URL= %s"
        db.execute(querypathtraversal, (project_name_id,encoded_url))
        pathtraversal = db.fetchall()

        try:
            await detect_pathtraversal(pathtraversal)
            print(f"pathtraversal(Parget): {encoded_url}")
        except Exception as e:
                    print(f"await detect_pathtraversal(pathtraversal): {e}")


        queryPTarget = "SELECT URL,res_header,PID,URL_ID  FROM urllist WHERE PID = %s AND URL = %s"
        db.execute(queryPTarget, (project_name_id,encoded_url))
        PTarget = db.fetchall()
        print(project_name_id,encoded_url)
        print("PTarget", PTarget)
        try:
            await HSTS(PTarget)
            await webFramework(PTarget)
            print(f"await webFramework(PTarget): {encoded_url}")
        except Exception as e:
            print(f"await webFramework(PTarget): {e}")


        queryPTargethtml = "SELECT URL,res_body,PID,URL_ID  FROM urllist WHERE PID = %s AND URL = %s"
        db.execute(queryPTargethtml,(project_name_id,encoded_url))
        PTarget = db.fetchall()
        
        try:       
            await webFrameworkhtml(PTarget)
            print(f"webFrameworkhtml: {encoded_url}")
        except Exception as e:
            print(f"await webFrameworkhtml(PTarget): {e}")
        queryURL_data = "SELECT URL , method,req_body FROM urllist WHERE PID = %s AND URL = %s"
        db.execute(queryURL_data, (project_name_id,encoded_url))
        URL_data = db.fetchall()
        print(URL_data)
        for url_data in URL_data:
            baseatt_URL = url_data[0]
            print(f'baseatt_URL',baseatt_URL)
            select_url_id_query = "SELECT URL_ID FROM urllist WHERE PID = %s AND URL = %s "
            db.execute(select_url_id_query, (project_name_id,encoded_url))
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
                # print("project_name",project_name)
                try:
                    await brutesql(att_url, att_params, baseper,select_url_id_data,baseatt_URL,project_name_checkk[0][0], user_data,cookies_data)
                except Exception as e:
                    print(f"brutesql: {e}")
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
                print("project_name",project_name_checkk[0][0])
                try: 
                    await brutexss(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name_checkk[0][0], user_data,cookies_data)
                except Exception as e:
                    print(f"brutexss: {e}")
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
                print("project_name",project_name_checkk[0][0]) 
                try:   
                    await brutepathtraversal(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name_checkk[0][0], user_data,cookies_data)
                except Exception as e:
                    print(f"brutepathtraversal: {e}")
                                    # if vres and vparams != None:
                #     print(vres)
                #     print(vparams)
            else:
                print('[-] we cannot find path traversal')


            if url_data[1] == 'POST':
                print("url_data[0] POST",url_data[1])
                if url_data[2] != None :
                    att_paramsnum = len(url_data[2].split('&'))
                    att_params={}
                    att_paramsname = []
                    #parse full query to dictionary
                    for i in url_data[2].split('&'):
                        #params=value
                        # print(i)
                        att_params.update({i.split('=')[0]: i.split('=')[1]})
                        att_paramsname.append(i.split('=')[0])
                    # print(att_url)
                    try:      
                        await brutecommand(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name_checkk[0][0], user_data,cookies_data,url_data[2])
                    except Exception as e:
                        print(f"brutepathtraversal: {e}")
                    # if vres and vparams != None:
                    #     print(vres)
                    #     print(vparams)
            else:
                print('[-] we cannot find command injection')
        try:        
            await run_gobustersensitive(baseURL,project_name_checkk[0][0], user_data)
            print("baseURLsensitive",baseURL)
            await checkTempFuzzsensitive(i,project_name_checkk[0][0], user_data,encoded_url,project_name_id)
        except Exception as e:
            print(f"run_gobustersensitive: {e}")
        # query = ('INSERT INTO urllist(URL,method,PID,state,status_code) VALUES(%s,%s,%s,%s,%s)')
        # db.execute(query, (url, method, project_name_id, 'c',parameter),)
        # mysql.connection.commit()
        # print(url)
        # print(method)
        # print(parameter)
        # print(project_name_id)
        return jsonify("Add URLS สำเร็จ")
    except Exception as e:
        return jsonify({"server error": str(e)})
    




@app.route("/addIssue", methods=['POST'])
def addIssue():
    try:
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)


        url = request.json['urls']
        payload_ = request.json['EVIDENCE']
        O_id = request.json['OID']
        vul_Des = request.json['Risk']
        vul_Sol = request.json['Recommendation']
        project_name_id = request.json['project_name_id']
        db = mysql.connection.cursor()
        
        print("O_id",O_id)
        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        print(username)
     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        

        query = 'SELECT Vul_name FROM owasp WHERE OID= %s'
        db.execute(query, (O_id,))
        O_name = db.fetchone() 
        print(f"O_name",O_name[0])

        query = 'SELECT Vul_name FROM owasp WHERE PID= %s AND Vul_name =%s '
        db.execute(query, (project_name_id,O_name[0]))
        O_namee = db.fetchall() 
        if O_namee:
            print("มีแล้ว")
        else:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name ,Severity FROM owasp WHERE OID= %s"
             db.execute(query2, (O_id,))
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_name_id,sql2_[0][5])
             db.execute(insert_query, values)



        
        query = ('INSERT INTO urllist(URL, method, PID, state, status_code) VALUES(%s, %s, %s, %s, %s)')
        db.execute(query, (url, "GET", project_name_id, 'c', "200"))
        mysql.connection.commit()
        print(f"Inserted into urllist")

        query = ('SELECT URL_ID FROM urllist WHERE PID = %s AND URL = %s')
        db.execute(query, (project_name_id,url),)
        url_id = db.fetchall()
        print(f"Selected URL_ID")
        query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name ,Severity FROM owasp WHERE OID= %s"
        db.execute(query2, (O_id,))
        sql2_ = db.fetchall()
        query = ('INSERT INTO att_ps(URL_ID,URL, position, PID, vul_des, vul_Sol, OID, payload,state,vul_name, Vul_ref, OType) VALUES(%s, %s, %s, %s, %s, %s, %s, %s,%s,%s,%s,%s)')
        db.execute(query, (url_id[0][0],url, url, project_name_id, vul_Des or sql2_[0][0] , vul_Sol or  sql2_[0][1], O_id, payload_,"T",O_name[0],sql2_[0][2],sql2_[0][3]))
        mysql.connection.commit()
        print(f"Inserted into att_ps")
        return jsonify("Add URLS สำเร็จ")
    except Exception as e:
        return jsonify({"server error": str(e)})



@app.route("/addIssueedit", methods=['POST'])
def addIssueedit():
    try:


        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        print(f'user_data = {user_data}')
        token = request.json['token']
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        project_id = decoded_token.get('project_id', '')
        print(f'user_id = {user_id}')
        url = request.json['urls']
        payload_ = request.json['EVIDENCE']
        O_id = request.json['OID']
        vul_Des = request.json['Risk']
        vul_Sol = request.json['Recommendation']
        # project_name_id = request.json['project_name_id']   
        print("O_id",O_id)
        if user_id is None or project_id is None:
            return jsonify({'error': 'Invalid token'}), 401
# เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User Error'}), 403
        db = mysql.connection.cursor()
        
        print("O_id",O_id)
        db = mysql.connection.cursor()    
        query = 'SELECT Vul_name FROM owasp WHERE OID= %s'
        db.execute(query, (O_id,))
        O_name = db.fetchone() 
        print(f"O_name",O_name[0])

        query = 'SELECT Vul_name FROM owasp WHERE PID= %s AND Vul_name =%s '
        db.execute(query, (project_id,O_name[0]))
        O_namee = db.fetchall() 
        if O_namee:
            print("มีแล้ว")
        else:
             db = mysql.connection.cursor()
             query2 = "SELECT Vul_des, Vul_sol, Vul_ref, OType, Vul_name ,Severity FROM owasp WHERE OID= %s"
             db.execute(query2, (O_id,))
             sql2_ = db.fetchall()

             insert_query = "INSERT INTO owasp (Vul_des, Vul_sol, Vul_ref, Vul_name, OType, PID, Severity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
             values = (sql2_[0][0], sql2_[0][1], sql2_[0][2], sql2_[0][4], sql2_[0][3], project_id,sql2_[0][5])
             db.execute(insert_query, values)



        
        query = ('INSERT INTO urllist(URL, method, PID, state, status_code) VALUES(%s, %s, %s, %s, %s)')
        db.execute(query, (url, "GET", project_id, 'c', "200"))
        mysql.connection.commit()
        print(f"Inserted into urllist")

        query = ('SELECT URL_ID FROM urllist WHERE PID = %s AND URL = %s')
        db.execute(query, (project_id,url),)
        url_id = db.fetchall()
        print(f"Selected URL_ID")

        query = ('INSERT INTO att_ps(URL_ID,URL, position, PID, vul_des, vul_Sol, OID, payload,state,vul_name) VALUES(%s, %s, %s, %s, %s, %s, %s, %s,%s,%s)')
        db.execute(query, (url_id[0][0],url, url, project_id, vul_Des, vul_Sol, O_id, payload_,"T",O_name[0]))
        mysql.connection.commit()
        print(f"Inserted into att_ps")
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
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
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
            return jsonify({'error': 'User Error'}), 403
        db = mysql.connection.cursor()

        query = ('INSERT INTO urllist(URL,method,PID,state,status_code) VALUES(%s,%s,%s,%s,%s)')
        db.execute(query, (url, method, project_id, 'c',parameter),)
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
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        print(username)
     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        db = mysql.connection.cursor()

        
        print(user_data)
        print(description_name)
        print(project_name_id)
        update_query = 'UPDATE project SET PName = %s , PDes=%s WHERE PID = %s AND username = %s '
        values = (project_name, description_name, project_name_id,user_data)
        db.execute(update_query, values)
        mysql.connection.commit()
        return jsonify("Update Success!")
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})
    
@app.route("/updateSeverity", methods=['PUT'])
def updateSeverity():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        project_name_id = request.json['project_name_id']
        vulnerability = request.json['vulnerability']
        newSeverity = request.json['newSeverity']


        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        print(username)
     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        db = mysql.connection.cursor()

        
        print(user_data)
        print(vulnerability)
        print(project_name_id)
        print(newSeverity)
        update_query = 'UPDATE owasp SET Severity = %s WHERE PID = %s AND Vul_name = %s '
        values = (newSeverity, project_name_id,vulnerability)
        db.execute(update_query, values)
        mysql.connection.commit()
        update_query = 'UPDATE att_ps SET Severity = %s WHERE PID = %s AND Vul_name = %s '
        values = (newSeverity, project_name_id,vulnerability)
        db.execute(update_query, values)
        mysql.connection.commit()
        return jsonify("Update Success!")
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})

@app.route("/updateSeverityURL", methods=['PUT'])
def updateSeverityURL():
    try:
        token = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        project_name_id = request.json['project_name_id']
        vulnerability = request.json['vulnerability']
        newSeverity = request.json['newSeverity']


        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        print(username)
     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        db = mysql.connection.cursor()

        
        print(user_data)
        print(vulnerability)
        print(project_name_id)
        print(newSeverity)
        update_query = 'UPDATE att_ps SET Severity = %s WHERE PID = %s AND ATT_ID = %s '
        values = (newSeverity, project_name_id,vulnerability)
        db.execute(update_query, values)
        mysql.connection.commit()
        return jsonify("Update Success!")
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})





@app.route("/updateeditSeverity", methods=['PUT'])
def updateeditSeverity():
    try:
        token_ = request.headers.get('Authorization').split(' ')[1]
        user = jwt.decode(token_, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        vulnerability = request.json['vulnerability']
        newSeverity = request.json['newSeverity']
        token = request.json['token']
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        project_id = decoded_token.get('project_id', '')
        print("user_id", user_id, project_id)
        print("user_data", user_data)
        db = mysql.connection.cursor()      
        print(user_data)
        print(vulnerability)
        print(newSeverity)
        update_query = 'UPDATE owasp SET Severity = %s WHERE PID = %s AND Vul_name = %s '
        values = (newSeverity, project_id,vulnerability)
        db.execute(update_query, values)
        mysql.connection.commit()
        update_query = 'UPDATE att_ps SET Severity = %s WHERE PID = %s AND Vul_name = %s '
        values = (newSeverity, project_id,vulnerability)
        db.execute(update_query, values)
        mysql.connection.commit()
        return jsonify("Update Success!")
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
        # print(Role)
        project_name_id = request.args.get('project_name_id')
        db = mysql.connection.cursor()

        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        # print(username)
     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403



    


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

        targets_url = "SELECT PTarget , PDes,PName,timeproject,EndTime FROM project WHERE username = %s AND PID = %s"
        db.execute(targets_url, (user_data, project_name_id))
        url_target = db.fetchall()

        # print(url_target)
        select_att_ID_sql = "SELECT URL , payload ,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        if select_att_ID_sql_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_sql_DATA[0][9],project_name_id,))
            owasp11_ = db.fetchall()
        else:
            owasp11_ = [0]

        select_att_ID_sql = "SELECT URL , payload,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        if select_att_ID_xsssql_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_xsssql_DATA[0][9],project_name_id,))
            owasp10_ = db.fetchall()
        else:
            owasp10_ = [0]   



        select_att_ID_traversal = "SELECT URL , payload,position,Vul_des , Vul_sol , OType, ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        if select_att_ID_select_att_traversal_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_traversal_DATA[0][9],project_name_id,))
            owasp4_ = db.fetchall()
        else:
            owasp4_ = [0]


        select_att_ID_secure = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name  FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_name_id, '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        if select_att_ID_select_att_secure_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_secure_DATA[0][9],project_name_id,))
            owasp2_ = db.fetchall()
        else:
            owasp2_ = [0]

        select_att_ID_httponly = "SELECT URL , res_header,Vul_des , Vul_sol, OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_name_id, '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        if select_att_ID_select_att_httponly_DATA:           
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_httponly_DATA[0][9],project_name_id,))
            owasp3_ = db.fetchall()
        else:
            owasp3_ = [0]


        select_att_ID_expire = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_name_id, '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        if select_att_ID_select_att_expire_DATA:       
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_expire_DATA[0][9],project_name_id,))
            owasp5_ = db.fetchall()
        else:
            owasp5_ = [0]

        select_att_ID_samsite = "SELECT URL , res_header,Vul_des , Vul_sol  ,OType, ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_name_id, '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        if select_att_ID_select_att_samsite_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_samsite_DATA[0][9],project_name_id,))
            owasp6_ = db.fetchall()
        else:
            owasp6_ = [0]


        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        if select_att_ID_select_att_server_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_server_DATA[0][9],project_name_id,))
            owasp1_ = db.fetchall()
        else:
            owasp1_ = [0]

        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        if select_att_ID_select_att_HSTS_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_HSTS_DATA[0][9],project_name_id,))
            owasp8_ = db.fetchall()
        else:
            owasp8_ = [0]

        select_att_ID_Sensitive = "SELECT URL , payload,position,Vul_des , Vul_sol , OType, ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Sensitive, (project_name_id, '7'))
        select_att_ID_sensitive = db.fetchall()
        if select_att_ID_sensitive:      
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_sensitive[0][9],project_name_id,))
            owasp7_ = db.fetchall()
        else:
            owasp7_ = [0]
            
        select_att_ID_web = "SELECT URL , payload,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name  FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_web, (project_name_id, '9'))
        select_att_ID_webb = db.fetchall()
        if select_att_ID_webb:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_webb[0][9],project_name_id,))
            owasp9_ = db.fetchall()
        else:
            owasp9_ = [0]


        select_att_ID_command = "SELECT URL , payload,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_command, (project_name_id, '12'))
        select_att_ID_command_DATA = db.fetchall()
        if select_att_ID_command_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_command_DATA[0][9],project_name_id,))
            owasp12_ = db.fetchall()
        else:
            owasp12_ = [0]


        valueTime_query = "SELECT timeproject FROM project WHERE PID = %s"
        db.execute(valueTime_query, (project_name_id,))
        valueTimep = db.fetchall()

        valueEND_query = "SELECT EndTime FROM project WHERE PID = %s"
        db.execute(valueEND_query, (project_name_id,))
        valueENDp = db.fetchall()


        owasp_query = "SELECT Vul_name, Severity ,OID FROM owasp WHERE PID = %s"
        db.execute(owasp_query, (project_name_id,))
        owasp_ = db.fetchall()


        if valueTimep and valueENDp and valueTimep[0][0] == valueENDp[0][0]:
            valueENDpp = None
        else:
            valueENDpp = valueENDp


        return jsonify({"crawl_data": crawl_data}, {"url_target": url_target}, {"select_att_sql_DATA":[select_att_ID_sql_DATA,owasp11_]}, {"select_att_ID_xsssql_DATA": [select_att_ID_xsssql_DATA,owasp10_]}, {"select_att_ID_select_att_traversal_DATA": [select_att_ID_select_att_traversal_DATA,owasp4_]}, 
                       {"Role": Role},{"select_att_ID_select_att_secure_DATA":[select_att_ID_select_att_secure_DATA,owasp2_]},{"select_att_ID_select_att_httponly_DATA":[select_att_ID_select_att_httponly_DATA,owasp3_]},{"select_att_ID_select_att_expire_DATA":[select_att_ID_select_att_expire_DATA,owasp5_]},{"select_att_ID_select_att_samsite_DATA":[select_att_ID_select_att_samsite_DATA,owasp6_]}
                       ,{"select_att_ID_select_att_server_DATA":[select_att_ID_select_att_server_DATA,owasp1_]},{"select_att_ID_select_att_HSTS_DATA":[select_att_ID_select_att_HSTS_DATA,owasp8_]},{"valueENDpp":valueENDpp},{"select_att_ID_sensitive":[select_att_ID_sensitive,owasp7_]},{"select_att_ID_webb":[select_att_ID_webb,owasp9_]},{"select_att_ID_command_DATA":[select_att_ID_command_DATA,owasp12_]},{"owasp_":owasp_})
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})


@app.route('/edit-issue', methods=['GET'])
def edit_issue():
    try:
        token = request.args.get('token')
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Role = user.get('role', None)
        # print(token)
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        project_name_id = decoded_token.get('project_id', '')
        print("user_id", user_id, project_name_id)
        print("user_data", user_data)
        print("Role", Role)
        if user_id is None or project_name_id is None:
            return jsonify({'error': 'Invalid token'}), 401
    # เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User Error'}), 403
        # print(crawl_data)

        db = mysql.connection.cursor()
        query = """
                SELECT tbl1.URL, tbl1.method, tbl1.status_code, tbl1.URL_ID
        FROM urllist tbl1
        JOIN project tbl2 ON tbl1.PID = tbl2.PID
        WHERE tbl2.username = %s AND tbl2.PID = %s AND tbl1.state = %s AND tbl1.status_code != %s
                """
        db.execute(query, (user_data, project_name_id, 'c', '404'))
        crawl_data = db.fetchall()



        targets_url = "SELECT PTarget, PDes FROM project WHERE PID = %s"
        db.execute(targets_url, (project_name_id,))
        url_target = db.fetchall()
        print("url_target", url_target)

        select_att_ID_sql = "SELECT URL , payload ,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        if select_att_ID_sql_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_sql_DATA[0][9],project_name_id,))
            owasp11_ = db.fetchall()
        else:
            owasp11_ = [0]

        select_att_ID_sql = "SELECT URL , payload,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        if select_att_ID_xsssql_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_xsssql_DATA[0][9],project_name_id,))
            owasp10_ = db.fetchall()
        else:
            owasp10_ = [0]   



        select_att_ID_traversal = "SELECT URL , payload,position,Vul_des , Vul_sol , OType, ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        if select_att_ID_select_att_traversal_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_traversal_DATA[0][9],project_name_id,))
            owasp4_ = db.fetchall()
        else:
            owasp4_ = [0]


        select_att_ID_secure = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name  FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_name_id, '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        if select_att_ID_select_att_secure_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_secure_DATA[0][9],project_name_id,))
            owasp2_ = db.fetchall()
        else:
            owasp2_ = [0]

        select_att_ID_httponly = "SELECT URL , res_header,Vul_des , Vul_sol, OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_name_id, '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        if select_att_ID_select_att_httponly_DATA:           
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_httponly_DATA[0][9],project_name_id,))
            owasp3_ = db.fetchall()
        else:
            owasp3_ = [0]


        select_att_ID_expire = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_name_id, '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        if select_att_ID_select_att_expire_DATA:       
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_expire_DATA[0][9],project_name_id,))
            owasp5_ = db.fetchall()
        else:
            owasp5_ = [0]

        select_att_ID_samsite = "SELECT URL , res_header,Vul_des , Vul_sol  ,OType, ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_name_id, '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        if select_att_ID_select_att_samsite_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_samsite_DATA[0][9],project_name_id,))
            owasp6_ = db.fetchall()
        else:
            owasp6_ = [0]


        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        if select_att_ID_select_att_server_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_server_DATA[0][9],project_name_id,))
            owasp1_ = db.fetchall()
        else:
            owasp1_ = [0]

        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        if select_att_ID_select_att_HSTS_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_select_att_HSTS_DATA[0][9],project_name_id,))
            owasp8_ = db.fetchall()
        else:
            owasp8_ = [0]

        select_att_ID_Sensitive = "SELECT URL , payload,position,Vul_des , Vul_sol , OType, ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Sensitive, (project_name_id, '7'))
        select_att_ID_sensitive = db.fetchall()
        if select_att_ID_sensitive:      
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_sensitive[0][9],project_name_id,))
            owasp7_ = db.fetchall()
        else:
            owasp7_ = [0]
            
        select_att_ID_web = "SELECT URL , payload,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref,Severity,vul_name  FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_web, (project_name_id, '9'))
        select_att_ID_webb = db.fetchall()
        if select_att_ID_webb:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_webb[0][9],project_name_id,))
            owasp9_ = db.fetchall()
        else:
            owasp9_ = [0]


        select_att_ID_command = "SELECT URL , payload,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref,Severity,vul_name FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_command, (project_name_id, '12'))
        select_att_ID_command_DATA = db.fetchall()
        if select_att_ID_command_DATA:
            owasp_query = "SELECT Severity FROM owasp WHERE Vul_name=%s AND PID = %s"
            db.execute(owasp_query, (select_att_ID_command_DATA[0][9],project_name_id,))
            owasp12_ = db.fetchall()
        else:
            owasp12_ = [0]


        valueTime_query = "SELECT timeproject FROM project WHERE PID = %s"
        db.execute(valueTime_query, (project_name_id,))
        valueTimep = db.fetchall()

        valueEND_query = "SELECT EndTime FROM project WHERE PID = %s"
        db.execute(valueEND_query, (project_name_id,))
        valueENDp = db.fetchall()


        owasp_query = "SELECT Vul_name, Severity ,OID FROM owasp WHERE PID = %s"
        db.execute(owasp_query, (project_name_id,))
        owasp_ = db.fetchall()
        if valueTimep and valueENDp and valueTimep[0][0] == valueENDp[0][0]:
            valueENDpp = None
        else:
            valueENDpp = valueENDp



        return jsonify({"crawl_data": crawl_data}, {"url_target": url_target}, {"select_att_sql_DATA":[select_att_ID_sql_DATA,owasp11_]}, {"select_att_ID_xsssql_DATA": [select_att_ID_xsssql_DATA,owasp10_]}, {"select_att_ID_select_att_traversal_DATA": [select_att_ID_select_att_traversal_DATA,owasp4_]}, 
                       {"Role": Role},{"select_att_ID_select_att_secure_DATA":[select_att_ID_select_att_secure_DATA,owasp2_]},{"select_att_ID_select_att_httponly_DATA":[select_att_ID_select_att_httponly_DATA,owasp3_]},{"select_att_ID_select_att_expire_DATA":[select_att_ID_select_att_expire_DATA,owasp5_]},{"select_att_ID_select_att_samsite_DATA":[select_att_ID_select_att_samsite_DATA,owasp6_]}
                       ,{"select_att_ID_select_att_server_DATA":[select_att_ID_select_att_server_DATA,owasp1_]},{"select_att_ID_select_att_HSTS_DATA":[select_att_ID_select_att_HSTS_DATA,owasp8_]},{"valueENDpp":valueENDpp},{"select_att_ID_sensitive":[select_att_ID_sensitive,owasp7_]},{"select_att_ID_webb":[select_att_ID_webb,owasp9_]},{"select_att_ID_command_DATA":[select_att_ID_command_DATA,owasp12_]})
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})


@app.route("/onedelete", methods=['DELETE'])
def onedelete():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        user_data = user.get('username', None)
        project_name_id = request.args.get('project_name_id')
        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        print(username)
      
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403

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
        user_data = user.get('username', None)
        urls_id = request.args.get('record')

        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()
        print(username)


        
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        if (Role == 'Advance'):
              
            # delete_ATT_ID_query = "DELETE FROM ATT_ID WHERE PID = %s AND URL_ID = %s"
            # db.execute(delete_ATT_ID_query, (project_name_id, urls_id),)            
            delete_crawl_query = "DELETE FROM urllist WHERE PID = %s AND URL_ID = %s"
            db.execute(delete_crawl_query, (project_name_id, urls_id),)
            mysql.connection.commit()
            db.close()
            print(urls_id)
        else:
            return jsonify({"Delete": "Error-Delete"})
        

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error oneurlsdelete": str(e)})
    




@app.route("/oneVulsdelete", methods=['DELETE'])
def oneVulsdelete():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        Role = user.get('role', None)
        user_data = user.get('username', None)
        project_name_id = request.args.get('project_name_id')
        print(project_name_id)
        att_id = request.args.get('record')


        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()

     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        
        if (Role == 'Advance'):
            db = mysql.connection.cursor()
            print("project_name_id",project_name_id)
            print("att_id",att_id)
            delete_crawl_query = "DELETE FROM att_ps WHERE PID = %s AND ATT_ID = %s"
            db.execute(delete_crawl_query, (project_name_id, att_id),)
            mysql.connection.commit()
            db.close()
        else:
            return jsonify({"Delete": "Error-Delete"})
        

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error oneurlsdelete": str(e)})
    


@app.route("/EditoneVulsdelete", methods=['DELETE'])
def EditoneVulsdelete():
    try:

        att_id = request.args.get('record')


        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Role = user.get('role', None)


        token = request.args.get('project_name_id')
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        # print(token)
        user_id = decoded_token.get('user_id', '')
        project_id = decoded_token.get('project_id', '')
        print("user_id", user_id, project_id)
        print("user_data", user_data)
        if user_id is None or project_id is None:
            return jsonify({'error': 'Invalid token'}), 401
    # เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User Error'}), 403
        # print(crawl_data)

        
        if (Role == 'Advance'):
            db = mysql.connection.cursor()
            print("project_name_id",project_id)
            print("att_id",att_id)
            delete_crawl_query = "DELETE FROM att_ps WHERE PID = %s AND ATT_ID = %s"
            db.execute(delete_crawl_query, (project_id, att_id),)
            mysql.connection.commit()
            db.close()
        else:
            return jsonify({"Delete": "Error-Delete"})
        

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error oneurlsdelete": str(e)})
    



@app.route("/oneSeverity", methods=['DELETE'])
def oneSeverity():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        Role = user.get('role', None)
        project_name_id = request.args.get('project_name_id')
        print(project_name_id)
        OID = request.args.get('record')
        user_data = user.get('username', None)
        
        db = mysql.connection.cursor()
        user_query = "SELECT username FROM project WHERE username = %s AND PID = %s"
        db.execute(user_query, (user_data, project_name_id))
        username = db.fetchall()

     
        if username[0][0] not in user_data:
            return jsonify({'error': 'User Error'}), 403
        

        if (Role == 'Advance'):
            db = mysql.connection.cursor()
            print("project_name_id",project_name_id)
            print("att_id",OID)
            delete_crawl_query = "DELETE FROM owasp WHERE PID = %s AND OID = %s"
            db.execute(delete_crawl_query, (project_name_id, OID),)
            mysql.connection.commit()
            db.close()
        else:
            return jsonify({"Delete": "Error-Delete"})
        

        return jsonify({"delete_data": f"ลบ สำเร็จ"})
    except Exception as e:
        return jsonify({"server error oneurlsdelete": str(e)})

@app.route("/edit_oneSeverity", methods=['DELETE'])
def edit_oneSeverity():
    try:
        token_ = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_, 'jwtSecret', algorithms=['HS256'])['user']
        Role = user.get('role', None)
        OID = request.args.get('record')
        user_data = user.get('username', None)
        

        token = request.args.get('project_name_id')
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        # print(token)
        user_id = decoded_token.get('user_id', '')
        project_id = decoded_token.get('project_id', '')
        print("user_id", user_id, project_id)
        print("user_data", user_data)
        print(OID)
        if (Role == 'Advance'):
            db = mysql.connection.cursor()
            print("project_name_id",project_id)
            print("att_id",OID)
            delete_crawl_query = "DELETE FROM owasp WHERE PID = %s AND OID = %s"
            db.execute(delete_crawl_query, (project_id, OID),)
            mysql.connection.commit()
            db.close()
        else:
            return jsonify({"Delete": "Error-Delete"})
        

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
            print(Owasp)
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

from flask import jsonify

@app.route("/payload5", methods=['POST'])
def delete_payload():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])['user']
        admin = user.get('role', None)
        
        if (admin == 'Admin'):
            payload_ = request.json['payloadone']
            # value_payload = request.json['valuepayload']
            Owasp = request.json['Owasp']
            # print(payload_)
            # print(f'\"{value_payload}\"')
            print(Owasp)
            # print(f'\"$.{payload_}\"')

            with mysql.connection.cursor() as db:
                query = "UPDATE owasp SET payloadlist = JSON_REMOVE(payloadlist, %s) WHERE OID = %s"
                db.execute(query, (f'$.{payload_}', Owasp))

            mysql.connection.commit()
            return jsonify({"success": True})
        else:
            return jsonify({"login": False})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)})
    
    
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
        query2 = "SELECT username FROM user "
        db.execute(query2)
        userall = db.fetchall()
        print("userall",userall)
        print("usershare",usershare)
        userall_values = [user_[0] for user_ in userall]
        if usershare in userall_values:
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
        else:
            return jsonify({'userError': 'This user does not exist.'})
    except Exception as e:
        print(f"Error: {e}")



@app.route('/edit-project', methods=['GET'])
def edit_project():
    try:
        token = request.args.get('token')
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Role = user.get('role', None)
        # print(token)
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        project_id = decoded_token.get('project_id', '')
        # print(user_id, project_id)
        # print(user_data)

        if user_id is None or project_id is None:
            return jsonify({'error': 'Invalid token'}), 401
    # เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User Error'}), 403
        

        db = mysql.connection.cursor()
        query = """
           SELECT tbl1.URL, tbl1.method, tbl1.status_code, tbl1.URL_ID
        FROM urllist tbl1
        JOIN project tbl2 ON tbl1.PID = tbl2.PID
        WHERE   tbl2.PID = %s AND tbl1.state = %s AND tbl1.status_code != %s
                """
        db.execute(query, ( project_id, 'c', '404'))
        crawl_data = db.fetchall()

        targets_url = "SELECT PTarget , PDes,PName,timeproject,EndTime FROM project WHERE  PID = %s"
        db.execute(targets_url, ( project_id,))
        url_target = db.fetchall()

        # print(url_target)
        select_att_ID_sql = "SELECT URL , payload ,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT URL , payload,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        select_att_ID_traversal = "SELECT URL , payload,position,Vul_des , Vul_sol , OType, ATT_ID,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        select_att_ID_secure = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref  FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_id, '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        select_att_ID_httponly = "SELECT URL , res_header,Vul_des , Vul_sol, OType , ATT_ID , payload,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_id, '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        select_att_ID_expire = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_id, '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        select_att_ID_samsite = "SELECT URL , res_header,Vul_des , Vul_sol  ,OType, ATT_ID , payload,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_id, '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_id, '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        select_att_ID_Server = "SELECT URL , res_header,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_id, '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        select_att_ID_Sensitive = "SELECT URL , payload,position,Vul_des , Vul_sol , OType, ATT_ID,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Sensitive, (project_id, '7'))
        select_att_ID_sensitive = db.fetchall()


        select_att_ID_web = "SELECT URL , payload,Vul_des , Vul_sol , OType , ATT_ID , payload,vul_ref  FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_web, (project_id, '9'))
        select_att_ID_webb = db.fetchall()

        select_att_ID_command = "SELECT URL , payload,position ,Vul_des , Vul_sol , OType , ATT_ID,vul_ref FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_command, (project_id, '12'))
        select_att_ID_command_DATA = db.fetchall()

        valueTime_query = "SELECT timeproject FROM project WHERE PID = %s"
        db.execute(valueTime_query, (project_id,))
        valueTimep = db.fetchall()

        valueEND_query = "SELECT EndTime FROM project WHERE PID = %s"
        db.execute(valueEND_query, (project_id,))
        valueENDp = db.fetchall()

        if valueTimep and valueENDp and valueTimep[0][0] == valueENDp[0][0]:
            valueENDpp = None
        else:
            valueENDpp = valueENDp


        return jsonify({"crawl_data": crawl_data}, {"url_target": url_target}, {"select_att_sql_DATA": select_att_ID_sql_DATA}, {"select_att_ID_xsssql_DATA": select_att_ID_xsssql_DATA}, {"select_att_ID_select_att_traversal_DATA": select_att_ID_select_att_traversal_DATA}, 
                       {"Role": Role},{"select_att_ID_select_att_secure_DATA":select_att_ID_select_att_secure_DATA},{"select_att_ID_select_att_httponly_DATA":select_att_ID_select_att_httponly_DATA},{"select_att_ID_select_att_expire_DATA":select_att_ID_select_att_expire_DATA},{"select_att_ID_select_att_samsite_DATA":select_att_ID_select_att_samsite_DATA}
                       ,{"select_att_ID_select_att_server_DATA":select_att_ID_select_att_server_DATA},{"select_att_ID_select_att_HSTS_DATA":select_att_ID_select_att_HSTS_DATA},{"valueENDpp":valueENDpp},{"select_att_ID_sensitive":select_att_ID_sensitive},{"select_att_ID_webb":select_att_ID_webb},{"select_att_ID_command_DATA":select_att_ID_command_DATA})
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})

@app.route('/edit-Dashboard', methods=['GET'])
def edit_Dashboard():
    try:
        token = request.args.get('token')
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret', algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        # print(token)
        Role = user.get('role', None)
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        project_name_id = decoded_token.get('project_id', '')
        print(user_id, project_name_id)
        print(user_data)

        if user_id is None or project_name_id is None:
            return jsonify({'error': 'Invalid token'}), 401
    # เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User Error'}), 403
        
        db = mysql.connection.cursor()
        targets_url = "SELECT PTarget , PDes FROM project WHERE PID = %s"
        db.execute(targets_url, (project_name_id,))
        url_target = db.fetchall()

            # print(url_target)


        # print(url_target)
        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '11'))
        select_att_ID_sql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'SQL Injection'))
        Severity11 = db.fetchall()
        if Severity11:
            Severity11= Severity11
        else:
            Severity11= [0] 

        select_att_ID_sql = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_sql, (project_name_id, '10'))
        select_att_ID_xsssql_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Stored Cross Site Scriptng'))
        Severity10 = db.fetchall()
        if Severity10:
            Severity10 = Severity10
        else:
            Severity10 = [0]            

        select_att_ID_traversal = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_traversal, (project_name_id, '4'))
        select_att_ID_select_att_traversal_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Directory Traversal File Include'))
        Severity4 = db.fetchall()  
        if Severity4:
            Severity4 = Severity4
        else:
            Severity4 = [0]


        select_att_ID_secure = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_secure, (project_name_id, '2'))
        select_att_ID_select_att_secure_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing Secure Attribute in Cookie Header'))
        Severity2 = db.fetchall()  
        if Severity2:
            Severity2 = Severity2
        else:
            Severity2 = [0]


        select_att_ID_httponly = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_httponly, (project_name_id, '3'))
        select_att_ID_select_att_httponly_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing HttpOnly Attribute in Cookie Header'))
        Severity3 = db.fetchall()  
        if Severity3:
            Severity3 = Severity3
        else:
            Severity3 = [0]


        select_att_ID_expire = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_expire, (project_name_id, '5'))
        select_att_ID_select_att_expire_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing Expires Attribute in Cookie Header'))
        Severity5 = db.fetchall()  
        if Severity5:
            Severity5 = Severity5
        else:
            Severity4 = [0]



        select_att_ID_samsite = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_samsite, (project_name_id, '6'))
        select_att_ID_select_att_samsite_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing SameSite Attribute in Cookie Header'))
        Severity6 = db.fetchall()  
        if Severity6:
            Severity6 = Severity6
        else:
            Severity6 = [0]
    
        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '1'))
        select_att_ID_select_att_server_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Web Server Infomation Leakage through Server header'))
        Severity1 = db.fetchall()  
        if Severity1:
            Severity1= Severity1
        else:
            Severity1= [0]
    
        select_att_ID_Server = "SELECT URL , res_header FROM att_ps WHERE PID = %s AND OID = %s "
        db.execute(select_att_ID_Server, (project_name_id, '8'))
        select_att_ID_select_att_HSTS_DATA = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Missing HTTP Strict Transport Security Header'))
        Severity8 = db.fetchall()  
        if Severity8:
            Severity8= Severity8
        else:
            Severity8= [0]
   

        select_att_ID_Sentitive = "SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s"
        db.execute(select_att_ID_Sentitive, (project_name_id, '7'))
        select_att_ID_Sentitive = db.fetchall()
        select_att_ID_sql = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_sql, (project_name_id, 'Sensitive File Disclosure'))
        Severity7 = db.fetchall()  
        if Severity7:
            Severity7= Severity7
        else:
            Severity7= [0]

        select_att_ID_web="SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s"
        db.execute(select_att_ID_web, (project_name_id, '9'))
        select_att_ID_webb = db.fetchall()
        select_att_ID_web = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_web, (project_name_id, 'Web Application Framework Infomation Leakage'))
        Severity9 = db.fetchall()  
        if Severity9:
            Severity9= Severity9
        else:
            Severity9= [0]

        select_att_ID_command="SELECT URL , payload FROM att_ps WHERE PID = %s AND OID = %s"
        db.execute(select_att_ID_command, (project_name_id, '12'))
        select_att_ID_commandd = db.fetchall()
        select_att_ID_command = "SELECT Severity FROM owasp WHERE PID = %s AND  Vul_name = %s "
        db.execute(select_att_ID_command, (project_name_id, 'Web Application Framework Infomation Leakage'))
        Severity12 = db.fetchall()  
        if Severity12:
            Severity12= Severity12
        else:
            Severity12= [0]

        owasp_query = "SELECT Vul_name, Severity ,OID FROM owasp WHERE PID = %s"
        db.execute(owasp_query, (project_name_id,))
        owasp_ = db.fetchall()
        valueTime_query = "SELECT timeproject FROM project WHERE PID = %s"
        db.execute(valueTime_query, (project_name_id,))
        valueTimep = db.fetchall()

        valueEND_query = "SELECT EndTime FROM project WHERE PID = %s"
        db.execute(valueEND_query, (project_name_id,))
        valueENDp = db.fetchall()

        if valueTimep and valueENDp and valueTimep[0][0] == valueENDp[0][0]:
            valueENDpp = None
        else:
            valueENDpp = valueENDp

        return jsonify({"url_target": url_target}, {"select_att_sql_DATA": [select_att_ID_sql_DATA,Severity11]}, {"select_att_ID_xsssql_DATA": [select_att_ID_xsssql_DATA,Severity10]}, {"select_att_ID_select_att_traversal_DATA": [select_att_ID_select_att_traversal_DATA,Severity4]}, {"Role": Role},{"select_att_ID_select_att_secure_DATA":[select_att_ID_select_att_secure_DATA,Severity2]},{"select_att_ID_select_att_httponly_DATA":[select_att_ID_select_att_httponly_DATA,Severity3]},{"select_att_ID_select_att_expire_DATA":[select_att_ID_select_att_expire_DATA,Severity5]},{"select_att_ID_select_att_samsite_DATA":[select_att_ID_select_att_samsite_DATA,Severity6]}
                       ,{"select_att_ID_select_att_server_DATA":[select_att_ID_select_att_server_DATA,Severity1]},{"select_att_ID_select_att_HSTS_DATA":[select_att_ID_select_att_HSTS_DATA,Severity8]},{"valueENDpp":valueENDpp},{"valueTimep":valueTimep},{"owasp_":owasp_}, {"select_att_ID_Sentitive": [select_att_ID_Sentitive,Severity7]}, {"select_att_ID_webb": [select_att_ID_webb,Severity9]}, {"select_att_ID_commandd": [select_att_ID_commandd,Severity12]})
    except Exception as e:
        app.logger.error(str(e))
        return jsonify({"server error": str(e)})
    


@app.route("/edit-oneurlsdelete", methods=['DELETE'])
def edit_issueoneurlsdelete():
    try:
        urls_id = request.args.get('record')
        token = request.args.get('token')
        token_user = request.headers.get('Authorization').split(" ")[1]
        user = jwt.decode(token_user, 'jwtSecret',algorithms=["HS256"])['user']
        user_data = user.get('username', None)
        Role = user.get('role', None)
        print(f'user_data = {user_data}')
        decoded_token = jwt.decode(token, 'jwtSecret', algorithms=['HS256'])
        user_id = decoded_token.get('user_id', '')
        print(f'user_id = {user_id}')
        project_id = decoded_token.get('project_id', '')
        if user_id is None or project_id is None:
            return jsonify({'error': 'Invalid token'}), 401
# เชคสิทธิ์
        if user_id not in user_data:
            return jsonify({'error': 'User Error'}), 403
        if (Role == 'Advance'):
              
            # delete_ATT_ID_query = "DELETE FROM ATT_ID WHERE PID = %s AND URL_ID = %s"
            # db.execute(delete_ATT_ID_query, (project_name_id, urls_id),)
            db = mysql.connection.cursor()     
            delete_crawl_query = "DELETE FROM urllist WHERE PID = %s AND URL_ID = %s"
            db.execute(delete_crawl_query, (project_id, urls_id),)
            mysql.connection.commit()
            db.close()
            print(urls_id)
        else:
            return jsonify({"Delete": "Error-Delete"})
        

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