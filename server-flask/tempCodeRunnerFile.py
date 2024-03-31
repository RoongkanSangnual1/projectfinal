        db = mysql.connection.cursor()
        queryURL_data = "SELECT URL , method,req_body , URI FROM urllist WHERE PID = %s AND status_code != 404"
        db.execute(queryURL_data, (project_name_id_result))
        URL_data = db.fetchall()
        for url_data in URL_data:
            baseatt_URL = url_data[0]
            uri = url_data[3]
            print(f'baseatt_URL',baseatt_URL)
            print(f'uri',uri)
            select_url_id_query = "SELECT URL_ID FROM urllist WHERE PID = %s AND URL = %s AND status_code != 404"
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
                    await brutesql(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data,uri)
                except Exception as e:
                    print(f"brutesql: {e}")
            # # print(vresults)
            # # all_results.extend(vresults)
            # # for vres, vparams in vresults:
            # #     print(vres)
            # #     print(vparams)           
            # else:
            #     print('we cannot find sql injection')

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
                    await brutexss(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data,uri)
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
                    await brutepathtraversal(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data,uri)
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
                        await brutecommand(att_url,baseper,att_params,att_paramsname,select_url_id_data,baseatt_URL,project_name, user,cookies_data,url_data[2],uri)
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
                