# file-creator
Express server that can create HTML files and make them available for download.

When running locally listens on port 3001. This can be configured easily in the index.js.

## REST APIs
### POST /download
Stores the request JSON body into a server side array. Responds with JSON.

The response will have two properties:
```
{
    "_id": "...", // the id to be used in a GET request
    "timer": ... // time in ms before resource created will be unavailable
}
```
#### Example httpie POST Request
`http -v POST :3001/download name="index" content="<html><body>Hello World</body></html>"`

#### Example Response
```
POST /download HTTP/1.1
Accept: application/json, */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Content-Length: 69
Content-Type: application/json
Host: localhost:3001
User-Agent: HTTPie/0.9.6

{
    "content": "<html><body>Hello World</body></html>",
    "name": "index"
}

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 60
Content-Type: text/html; charset=utf-8
Date: Thu, 13 Oct 2016 20:14:07 GMT
ETag: W/"3c-6KBqH/kIulV8CtovQXdO/g"
X-Powered-By: Express

{
    "_id": "377fe712-4f72-4210-8993-ff889dd33da4",
    "timer": 70000
}
```
### GET /download/:id
If provided a valid id, will return a response with the following headers:

```
Content-Disposition: attachment; filename= // provided name here
Content-Type: text/html; charset=utf-8
```

*Most browsers will attempt to download the response, which is why the server was made.*

#### Example httpie GET Request
`HTTP -v GET :3001/download/377fe712-4f72-4210-8993-ff889dd33da4`

#### Example Response
```
GET /download/377fe712-4f72-4210-8993-ff889dd33da4 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:3001
User-Agent: HTTPie/0.9.6



HTTP/1.1 200 OK
Connection: keep-alive
Content-Disposition: attachment; filename="index.html"
Content-Length: 37
Content-Type: text/html; charset=utf-8
Date: Thu, 13 Oct 2016 20:34:08 GMT
ETag: W/"25-yVLByPvX1bQhSAXYFyNQcA"
X-Powered-By: Express

<html><body>Hello World</body></html>
```
#### Sample Client hosted on heroku
![file-creator](https://cloud.githubusercontent.com/assets/3937557/19326767/b1b48d7c-9080-11e6-9c71-165ae65bd2d0.gif)
