const axios = require('axios')
const { EntityNotFoundError } = require('./error');
// class EntityNotFoundError extends Error { };
// https://developer.twitter.com/en/docs/api-reference-index

class TwitterApi {
    constructor(bearerToken) {
        // complete me
        this.bearerToken = "AAAAAAAAAAAAAAAAAAAAAP5%2BhAEAAAAAoT56%2BQiNKG4DWjMVrl9x%2BqF6OqA%3D911RwPSG2depbdZ150HetmmJ043Hw5cHZ75i3IenvT9uXcwirn";
    }

    getTweet(tweetId, callback) {
        // /twitter-api/tweets/lookup/api-reference/get-tweets-id
        var config = {
            method: 'get',
            url: 'https://api.twitter.com/2/tweets/' + tweetId + "?tweet.fields=created_at,public_metrics,author_id",
            headers: { 
              'Authorization': "Bearer " + this.bearerToken,
              'Cookie': 'guest_id=v1%3A166328194983826322'
            }
        };
        
        axios(config)
        .then(function (response) {
            if ("errors" in response.data) {
                throw new EntityNotFoundError()
            }
            var res = response.data["data"]
            var jsonObj = new Object()
            jsonObj["body"] = res["text"]
            jsonObj["createdAt"] = res["created_at"]
            var pbMatrix = new Object()
            pbMatrix["retweetCount"] = res["public_metrics"]["retweet_count"]
            pbMatrix["replyCount"] = res["public_metrics"]["reply_count"]
            pbMatrix["likeCount"] = res["public_metrics"]["like_count"]
            jsonObj["publicMetrics"] = pbMatrix
            jsonObj["tweetId"] = res["id"]
            jsonObj["userId"] = res["author_id"]
            // "return" data to caller
            callback(null, jsonObj)
        })
        .catch(err => {
            // raise error to caller
            callback(err);
        });
    }

    getTimeline(userId, callback) {
        // /twitter-api/tweets/timelines/api-reference/get-users-id-tweets
        var config = {
            method: 'get',
            url: 'https://api.twitter.com/2/users/' + userId + '/tweets' + '?tweet.fields=created_at,public_metrics,author_id',
            headers: { 
              'Authorization': "Bearer " + this.bearerToken,
              'Cookie': 'guest_id=v1%3A166328194983826322'
            }
        };
        
        axios(config)
        .then(function (response) {
            if ("errors" in response.data) {
                throw new EntityNotFoundError()
            }
            var res = response.data["data"]
            var listObj = []
            for (var index in res) {
                var jsonObj = new Object()
                jsonObj["body"] = res[index]["text"]
                jsonObj["createdAt"] = res[index]["created_at"]
                var pbMatrix = new Object()
                pbMatrix["retweetCount"] = res[index]["public_metrics"]["retweet_count"]
                pbMatrix["replyCount"] = res[index]["public_metrics"]["reply_count"]
                pbMatrix["likeCount"] = res[index]["public_metrics"]["like_count"]
                jsonObj["publicMetrics"] = pbMatrix
                jsonObj["tweetId"] = res[index]["id"]
                jsonObj["userId"] = res[index]["author_id"]
                listObj.push(jsonObj)
            }
            // "return" data to caller
            callback(null, listObj);
        })
        .catch(err => {
            // raise error to caller
            callback(err);
        });
    }

    recentSearch(query, callback) {
        // /twitter-api/tweets/search/api-reference/get-tweets-search-recent
        var config = {
            method: 'get',
            url: 'https://api.twitter.com/2/tweets/search/recent?query=' + query + '&tweet.fields=created_at,public_metrics,author_id',
            headers: { 
              'Authorization': "Bearer " + this.bearerToken,
              'Cookie': 'guest_id=v1%3A166328194983826322'
            }
        };
        
        axios(config)
        .then(function (response) {
            if ("errors" in response.data) {
                throw new EntityNotFoundError()
            }
            var res = response.data["data"]
            var listObj = []
            for (var index in res) {
                var jsonObj = new Object()
                jsonObj["body"] = res[index]["text"]
                jsonObj["createdAt"] = res[index]["created_at"]
                var pbMatrix = new Object()
                pbMatrix["retweetCount"] = res[index]["public_metrics"]["retweet_count"]
                pbMatrix["replyCount"] = res[index]["public_metrics"]["reply_count"]
                pbMatrix["likeCount"] = res[index]["public_metrics"]["like_count"]
                jsonObj["publicMetrics"] = pbMatrix
                jsonObj["tweetId"] = res[index]["id"]
                jsonObj["userId"] = res[index]["author_id"]
                listObj.push(jsonObj)
            }
            // "return" data to caller
            callback(null, listObj);
        })
        .catch(err => {
            // raise error to caller
            callback(err);
        });
    }

    retweetBy(tweetId, callback) {
        // /twitter-api/tweets/retweets/api-reference/get-tweets-id-retweeted_by
        var config = {
            method: 'get',
            url: 'https://api.twitter.com/2/tweets/' + tweetId + '/retweeted_by' + '?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld',
            headers: { 
              'Authorization': "Bearer " + this.bearerToken,
              'Cookie': 'guest_id=v1%3A166328194983826322'
            }
        };
        
        axios(config)
        .then(function (response) {
            if ("errors" in response.data) {
                throw new EntityNotFoundError()
            }
            var res = response.data["data"]
            var listObj = []
            for (var index in res) {
                var jsonObj = new Object()
                jsonObj["createdAt"] = res[index]["created_at"]
                jsonObj["description"] = res[index]["description"]
                jsonObj["location"] = res[index]["location"]
                jsonObj["name"] = res[index]["name"]
                var pbMatrix = new Object()
                pbMatrix["followersCount"] = res[index]["public_metrics"]["following_count"]
                pbMatrix["followingCount"] = res[index]["public_metrics"]["tweet_count"]
                pbMatrix["tweetCount"] = res[index]["public_metrics"]["listed_count"]
                jsonObj["publicMetrics"] = pbMatrix
                jsonObj["userId"] = res[index]["id"]
                jsonObj["userName"] = res[index]["username"]
                jsonObj["verified"] = res[index]["verified"]
                listObj.push(jsonObj)
            }
            // "return" data to caller
            callback(null, listObj);
        })
        .catch(err => {
            // raise error to caller
            callback(err);
        });
    }

    getUser(userId, callback) {
        // /twitter-api/users/lookup/api-reference/get-users-id
        var config = {
            method: 'get',
            url: 'https://api.twitter.com/2/users/' + userId + '?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld',
            headers: { 
              'Authorization': "Bearer " + this.bearerToken,
              'Cookie': 'guest_id=v1%3A166328194983826322'
            }
        };
        
        axios(config)
        .then(function (response) {
            if ("errors" in response.data) {
                throw new EntityNotFoundError()
            }
            var res = response.data["data"]
            var jsonObj = new Object()
            jsonObj["createdAt"] = res["created_at"]
            jsonObj["description"] = res["description"]
            jsonObj["location"] = res["location"]
            jsonObj["name"] = res["name"]
            var pbMatrix = new Object()
            pbMatrix["followersCount"] = res["public_metrics"]["following_count"]
            pbMatrix["followingCount"] = res["public_metrics"]["tweet_count"]
            pbMatrix["tweetCount"] = res["public_metrics"]["listed_count"]
            jsonObj["publicMetrics"] = pbMatrix
            jsonObj["userId"] = res["id"]
            jsonObj["userName"] = res["username"]
            jsonObj["verified"] = res["verified"]
            // "return" data to caller
            callback(null, jsonObj)
        })
        .catch(err => {
            // raise error to caller
            callback(err);
        });
    }

    getUserByUsername(userName, callback) {
        // /twitter-api/users/lookup/api-reference/get-users-by-username-username
        var config = {
            method: 'get',
            url: 'https://api.twitter.com/2/users/by/username/' + userName + '?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld',
            headers: { 
              'Authorization': "Bearer " + this.bearerToken,
              'Cookie': 'guest_id=v1%3A166328194983826322'
            }
        };
        
        axios(config)
        .then(function (response) {
            if ("errors" in response.data) {
                throw new EntityNotFoundError()
            }
            var res = response.data["data"]
            var jsonObj = new Object()
            jsonObj["createdAt"] = res["created_at"]
            jsonObj["description"] = res["description"]
            jsonObj["location"] = res["location"]
            jsonObj["name"] = res["name"]
            var pbMatrix = new Object()
            pbMatrix["followersCount"] = res["public_metrics"]["following_count"]
            pbMatrix["followingCount"] = res["public_metrics"]["tweet_count"]
            pbMatrix["tweetCount"] = res["public_metrics"]["listed_count"]
            jsonObj["publicMetrics"] = pbMatrix
            jsonObj["userId"] = res["id"]
            jsonObj["userName"] = res["username"]
            jsonObj["verified"] = res["verified"]
            // "return" data to caller
            callback(null, jsonObj)
        })
        .catch(err => {
            // raise error to caller
            callback(err);
        });
    }

    getTimelineByUsername(userName, callback) {
        // complete me
        var config = {
            method: 'get',
            url: 'https://api.twitter.com/2/users/by/username/' + userName,
            headers: { 
              'Authorization': "Bearer " + this.bearerToken,
              'Cookie': 'guest_id=v1%3A166328194983826322'
            }
        };
        
        axios(config)
        .then((response) => {
            if ("errors" in response.data) {
                throw new EntityNotFoundError()
            }
            var user_id = response.data["data"]["id"]
            this.getTimeline(user_id, callback)
        })
        .catch(err => {
            // raise error to caller
            callback(err);
        });
    }
}

exports.TwitterApi = TwitterApi;

const twitter = new TwitterApi();
twitter.getTimelineByUsername("ac_miad", (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
    }
});