// import http module
var http = require('http');
// import express module
var express = require('express')
// import file module
var fs = require('fs');
// import path module
var path = require('path');
// import url module
var url = require('url');
const e = require('express');
// create the server
var app = http.createServer();

const FILE_PATH = './data/player.json'
const JSON_FILE = path.join(__dirname, './data/player.json')
const FILE_FOLFER = path.join(__dirname, './data')

function readFile() {
    if (!fs.existsSync(FILE_FOLFER)) {
        fs.mkdirSync(FILE_FOLFER)
    }
    if (!fs.existsSync(JSON_FILE)) {
        let date = new Date().toISOString();
        var obj = {
            "players": [],
            "updated_at": date,
            "created_at": date,
            "version": "1.0"
        }
        fs.writeFileSync(JSON_FILE, JSON.stringify(obj))
    }

    try {
        let obj = fs.readFileSync(JSON_FILE, 'utf8');
        let data = JSON.parse(obj);
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

function jsonSort(array, field, order) {
    if (array.length < 2 || !field || typeof array[0] !== "object") {
        console.log("return the original array!");
        return array;
    }
    // json has no such field
    if (array[0][field] == undefined){
        console.log("error: no such field: "+ field);
    }else{
        // field has the content of number
        if (typeof array[0][field] === "number") {
            array.sort(function (x, y) { return x[field] - y[field] });
        }
        // field has the content of string
        else if (typeof array[0][field] === "string") {
            // when field is None, regard as big number
            array.sort(function (x, y) { 
                if (x[field] == null ) return 1
                else if (y[field] == null) return -1
                else{
                    return x[field].localeCompare(y[field]) 
                }
            });
        } 
        order == false ? order = order : order = true
        if(order) return array
        else return array.reverse()
    }
}

// add the event
app.on('request', async function (req, res) {
    readFile()
    // use url.parse method to parse URL path to be an object
    // the second parameter is true which means parse query to be an object
    var parseObj = url.parse(req.url, true)
	// get url path without parameter
    var pathname = parseObj.path;
    // append the string to req objectï¼Œthen can use req.query to get the string
    req.query = parseObj.query;

	// match the query path
	if (pathname === '/ping') {
		// respond with status code 204
		res.writeHead(204, {'Content-Type': 'text/plain'});
		// respond with empty body
		res.end();

	} else if (pathname === '/player') {
        // json file location
        const data = fs.readFileSync('./data/player.json', 'utf8')
        // parse JSON string to JSON object
        const playerJson = JSON.parse(data)
        const activePlayers = playerJson.players
		const jsonObj = jsonSort(activePlayers, "fname", false)
        jsonObj.map((val, i) => {
            if (val["is_active"] == true) {
                jsonObj.splice(i, 1)
                console.log(jsonObj)
            }
        })
        // respond with status code 200
        res.writeHead(200, {'Content-Type': 'application/json'})
		res.end(JSON.stringify(jsonObj))
        
    } else if (pathname.indexOf('/player/') === 0) {
        const { method } = req
        if(method === "GET") {
            // deprase the pid
            var pid = pathname.split("player/")[1];
            // json file location
            const data = fs.readFileSync('./data/player.json', 'utf8')
            // parse JSON string to JSON object
            const playerJson = JSON.parse(data)
            const playerArray = playerJson.players
            var ifFound = 0
            var jsonObj = {}
            playerArray.map((val, i) => {
                if (val["pid"] == pid) {
                    ifFound = 1
                    jsonObj = val
                }
            })
            if (ifFound === 0) {
                // respond with status code 404
                res.writeHead(404, {'Content-Type': 'application/json'});
                // respond with empty body
                res.end();
            } else {
                // respond with status code 200
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(jsonObj));
            }
        } else if(method === "DELETE") {
            // deprase the pid
            var pid = Number(pathname.split("player/")[1]);
            // json file location
            const data = fs.readFileSync('./data/player.json', 'utf8')
            // parse JSON string to JSON object
            const playerJson = JSON.parse(data)
            const playerArray = playerJson.players
            var ifFound = 0
            playerArray.map((val, i) => {
                if (val["pid"] == pid) {
                    ifFound = 1
                }
            })
            if (ifFound === 0) {
                // respond with status code 404
                res.writeHead(404, {'Content-Type': 'application/json'});
                // respond with empty body
                res.end();
            } else {
                // write the data back to the json file
                function deleteJson(pid){
                    fs.readFile('./data/player.json',function(err,data){
                        if(err){
                            return console.error(err);
                        }
                        var person = data.toString();
                        person = JSON.parse(person);
                        // read the data
                        for(var i = 0; i < person.players.length;i++){
                            if(pid === person.players[i].pid){
                                person.players.splice(i,1);
                            }
                        }
                        person.total = person.players.length;
                        var str = JSON.stringify(person);
                        // write the data back
                        fs.writeFile('./data/player.json',str,function(err){
                            if(err){
                                console.error(err);
                            }
                            console.log("delete operation successful!");
                        })
                })}deleteJson(pid);
                res.writeHead(303, {Location : `http://${req.headers['host']}/player`})
                res.end()
            }
        } else if(method === "POST") {
            // update Player[pid]:  POST /player/[pid]?active=[bool]&lname=
            var active = req.query.active
            var lname = req.query.lname
        }
        
    } else if (pathname.indexOf('/player?') === 0) {
        // add a new player: POST /player?fname=&lname=&handed=[enum]&initial balance usd=[currency]
        responseString = "invalid fields: "
        fs.readFile('./data/player.json',function(err,data){
            if(err){
                return console.error(err);
            }
            var person = data.toString();
            person = JSON.parse(person);
            // read the data
            var newplayer = {
                pid: 0,
                fname: "",
                lname: "",
                handed: "",
                is_active: true,
                balance_usd: ""
            }
            // set the data field
            var newPid = 0
            if (person.players.length > 0) {
                fs.readFile('./data/player.json',function(err,data){
                    if(err){
                        return console.error(err)
                    }
                    var person = data.toString()
                    person = JSON.parse(person)
                    // read the data
                    for(var i = 0; i < person.players.length;i++){
                        if(person.players[i].pid > newPid){
                            newPid = person.players[i].pid + 1
                        }
                    }
                })
            }
            newplayer.pid = newPid
            if (!("fname" in req.query)) {
                // respond with status code 422
                res.writeHead(422, {'Content-Type': 'application/json'})
                // respond with empty body
                res.end()
            } else {
                for (var key in req.query) {
                    newplayer[key] = req.query[key]
                }
            }
            person.players.push(newplayer)
            person.total = person.players.length
            var str = JSON.stringify(person)
            console.log(str)
            // write the data back
            fs.writeFile('./data/player.json',str,function(err){
                if(err){
                    console.error(err)
                }
                console.log("add player operation successful!")
            })
        })

        if (responseString === "invalid fields: ") {
            res.writeHead(303, {Location : `http://${req.headers['host']}/player/${pid}`})
            res.end()
        } else {
            // respond with status code 422
            res.writeHead(422, {'Content-Type': 'application/json'})
            // respond with empty body
            res.end(responseString);
        }
        
    } else if (pathname.indexOf('/deposit') === 0) {
        pid = pathname.split("/")[3].split("?")[0]
        // json file location
        const data = fs.readFileSync('./data/player.json', 'utf8')
        // parse JSON string to JSON object
        const playerJson = JSON.parse(data)
        const playerArray = playerJson.players
        var ifFound = 0
        playerArray.map((val, i) => {
            if (val["pid"] == pid) {
                ifFound = 1
            }
        })
        if (ifFound === 0) {
            // 404 if player does not exist
            // respond with status code 404
            res.writeHead(404, {'Content-Type': 'application/json'})
            // respond with empty body
            res.end()
        } else {
            var amount_usd = req.query['amount_usd']
            var number = amount_usd.split(".")
            if (number.length > 1 && number[1].length > 2) {
                // 400 if invalid amount, too many digits
                res.writeHead(400, {'Content-Type': 'application/json'})
                // respond with empty body
                res.end()
            } else {
                // 200 on success.
                var update_currency = amount_usd
                if (number.length === 1) {
                    // has no disimal situation
                    update_currency += ".00"
                } else {
                    // has the disimal, but less than 2 digits
                    if (number[1].length === 1) {
                        update_currency += "0"
                    }
                }
                // console.log(update_currency)
                function updateJson(pid){
                    fs.readFile('./data/player.json',function(err,data){
                        if(err){
                            return console.error(err);
                        }
                        var person = data.toString();
                        person = JSON.parse(person);
                        // read the data
                        for(var i = 0; i < person.players.length;i++){
                            if(pid == person.players[i].pid){
                                person.players[i].balance_usd = update_currency;
                            }
                        }
                        person.total = person.players.length;
                        var str = JSON.stringify(person);
                        // write the data back
                        fs.writeFile('./data/player.json',str,function(err){
                            if(err){
                                console.error(err);
                            }
                            console.log("update operation successful!");
                        })
                })}updateJson(pid);
                res.writeHead(200, {'Content-Type': 'application/json'})
                // respond with empty body
                res.end()
            }
        }
    } else {
        // respond with status code 404
		res.writeHead(404, {'Content-Type': 'text/plain'});
		// respond with empty body
		res.end();
    }
});

// listen to the port 8088
app.listen(3000, function () {
    console.log('runing at http://127.0.0.1:3000');
});