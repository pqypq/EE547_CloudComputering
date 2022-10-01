// import http module
var http = require('http');
// import file module
var fs = require('fs');
// import path module
var path = require('path');
// import url module
var url = require('url');
// import math module
var math = require("mathjs");
// create the server
var app = http.createServer();

var reqTimes = 0;
var errorTimes = 0;

function scientificNotationToString(param) {
	let strParam = String(param)
	let flag = /e/.test(strParam)
	if (!flag) return param
  
	let sysbol = true
	if (/e-/.test(strParam)) {
	  sysbol = false
	}
	let index = Number(strParam.match(/\d+$/)[0])
	let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')
  
	if (sysbol) {
	  return basis.padEnd(index + 1, 0)
	} else {
	  return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
	}
  }

// anagram function
function anagram(string) {
	if (string.length === 0) {
		// empty string
		return "empty";
	}

    var str = string.toLowerCase();
	const characters = new Map();

	for (let i = 0; i < str.length; i++){
		var char = str[i].charCodeAt()
		if ((char >= 65 && char <= 90) || (char >= 97 && char <= 122)) {
			if (characters[str[i]]) {
				characters[str[i]] ++;
			} else {
				characters[str[i]] = 1;
			}
		} else {
			return "empty";
		}
	}

	// convert to bignum
    for (const k in characters) {
		characters[k] = math.bignumber(characters[k])
	}
  
	return math.multinomial(Object.values(characters)).toFixed();
}

function toIsoString(date) {
	var tzo = -date.getTimezoneOffset(),
		dif = tzo >= 0 ? '+' : '-',
		pad = function(num) {
			return (num < 10 ? '0' : '') + num;
		};
  
	return date.getFullYear() +
		'-' + pad(date.getMonth() + 1) +
		'-' + pad(date.getDate()) +
		'T' + pad(date.getHours()) +
		':' + pad(date.getMinutes()) +
		':' + pad(date.getSeconds()) +
		dif + pad(Math.floor(Math.abs(tzo) / 60)) +
		':' + pad(Math.abs(tzo) % 60);
}

// add the event
app.on('request', function (req, res) {
	// global varibles
	reqTimes = reqTimes + 1;

    // use url.parse method to parse URL path to be an object
    // the second parameter is trueï¼Œ which means parse query to be an object
    var parseObj = url.parse(req.url, true);
	// get url path without parameter
    var pathname = parseObj.pathname;
    // append the string to req objectï¼Œthen can use req.query to get the string
    req.query = parseObj.query;

	// match the query path
	if (pathname === '/ping') {
		// respond with status code 204
		res.writeHead(204, {'Content-Type': 'text/plain'});
		// respond with empty body
		res.end();

	} else if (pathname.indexOf('/anagram') === 0) {
		var nums = anagram(req.query["p"]);
		if (nums === "empty") {
			// respond with status code 400
			res.writeHead(400, {'Content-Type': 'application/json'});
		} else {
			// respond with status code 200
			res.writeHead(200, {'Content-Type': 'application/json'});
		}
		var jsonObj = {"p" : req.query["p"],
			"total" : nums.toString()
		};
		res.end(JSON.stringify(jsonObj));
        
    } else if (pathname === '/secret') {
		fs.readFile('/tmp/secret.key', 'utf8' , (err, data) => {
			if (err) {
				// respond with status code 404
				res.writeHead(404, {'Content-Type': 'text/plain'});
				errorTimes = errorTimes + 1;
				// respond with empty body
				res.end();
			}
			// respond with status code 404
			res.writeHead(200, {'Content-Type': 'text/plain'});
			// respond with empty body
			res.end(data);
		})
	} else if (pathname === '/status') {
		// respond with status code 200
		res.writeHead(200, {'Content-Type': 'application/json'});
		// var date = new Date(Date.UTC());
		var current_time = new Date();
		var jsonObj = {"time" : toIsoString(current_time),
						"req" : reqTimes,
						"err" : errorTimes
					};
		// respond with empty body
		res.end(JSON.stringify(jsonObj));
	} else {
        // respond with status code 404
		res.writeHead(404, {'Content-Type': 'text/plain'});
		errorTimes = errorTimes + 1;
		// respond with empty body
		res.end();
    }
});

// listen to the port 8088
app.listen(8088, function () {
    console.log('runing at http://127.0.0.1:8088');
});