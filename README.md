# like-reddit

# server session
req.session.userId = user.id;

{userId: 1} -> send that to redis


1
sess:qwoeiuowqjoqjw -> { userId: 1 }

2
express-session will set a cookie on my browser qwoieu9012798quw9euoe1i2uo

3
when user makes a request
qwoieu9012798quw9euoe1i2uo -> sent to the server

4
server decrypts the cookie
qwoieu9012798quw9euoe1i2uo -> sess:qwoeiuowqjoqjw

5
server makes a request to redis
sess:qwoeiuowqjoqjw -> { userId: 1 }

req.session = { userId: 1 }

# server ssr cookie
ssr
    browser -> next.js -> graphql api
client side
    browser -> graphql api

# client ssr
me -> browse http://localhost:3000
-> next.js server
-> request graphql server localhost:4000
-> building the HTML
-> sending back to your browser