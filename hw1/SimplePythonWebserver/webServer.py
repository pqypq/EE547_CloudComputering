from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import math

import os
from datetime import datetime, timezone

host = ('localhost', 8088)

# counters to record the requests and errors
request_counter = 0
error_counter = 0

class Resquest(BaseHTTPRequestHandler):
    
    def do_GET(self):
        global request_counter
        global error_counter

        request_counter += 1
        
        keyWord = self.path.split('?')[0]
        print(keyWord)

        if keyWord ==  "/ping":
            self.ping()
        elif keyWord == "/anagram":
            self.anagram()
        elif keyWord == "/secret":
            self.secret()
        elif keyWord == "/status":
            self.status()
        else:
            error_counter += 1
            self.send_error(404)
        
        return
        
    def ping(self):
        self.send_response(204)
        data = {}
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
        
    def anagram_helper(self, str):
        # empty string case, invalid input
        if len(str) == 0:
            return 0
            
        # invide case
        for i in range(len(str)):
            if ord(str[i]) < 65 or (ord(str[i]) > 90 and ord(str[i]) < 97) or ord(str[i]) >122:
                return 0

        # counting anagrams
        # transfer all letters to lower letters
        str = str.lower()
        characters = {}
        for ch in str:
            if ch in characters:
                characters[ch] += 1
            else:
                characters[ch] = 1

        res = math.factorial(len(str))
        for val in characters.values():
            res = res // math.factorial(val)
        
        return res

    def anagram(self):
        content = self.path.split('?')[1]
        string = content.split('=')[1]
        
        res = self.anagram_helper(string)
        if res > 0:
            # the string is valid
            self.send_response(200)
            # read the key and values
            data = {
                "p" : string,
                "total" : str(res)
            }
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        else:
            # the string is empty or invalid
            self.send_response(400)
            # read the key and values
            data = {}
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        
    def secret(self):
        global error_counter

        if os.path.exists("/tmp/secret.key"):
            self.send_response(200)

            with open('/tmp/secret.key', 'r') as f:
                content = f.read()
            
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(content.encode())
        else:
            # the /secret.key file is not exists
            error_counter += 1
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
        
    def status(self):
        self.send_response(200)

        utc_dt = datetime.utcnow()
        iso_date = utc_dt.strftime("%Y-%m-%dT%H:%M:%SZ")

        data = {
                "time": iso_date, # YYYY-MM-DDTHH:mm:ssZ
                "req": request_counter,
                "err": error_counter
                }
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

if __name__ == '__main__':
    server = HTTPServer(host, Resquest)
    # print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()