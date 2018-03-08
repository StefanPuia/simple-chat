'use strict';

const express = require('express');
const app = express();

const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({
    server: server,
});

// serve GET '/static'
app.use('/static', express.static(path.join(__dirname + '/static')));

// send 404 on '/'
app.get('/', function(req, res) {
	res.status(404).send('<h1>Room not found</h1>');
})

// serve GET '/'
app.get('/:roomid', function(req, res) {
	res.sendFile(path.join(__dirname + '/pages/index.html'));
})

server.on('request', app);

let clients = [];

// establish connection
wss.on('connection', function connection(ws, req) {
	ws.room = req.url.split('/').slice(-1).pop();
    clients.push(ws);

    // error handling WIP
    ws.on('error', (err) => {});

    // listen for messages
    ws.on('message', function incoming(message) {
    	let data = JSON.parse(message);
    	sendAll(data);
    })
})

function sendAll(data) {
    clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN && client.room == data.room) {
            client.send(JSON.stringify(data));
        }
    });
}

let serverPort = 8888;

server.listen(serverPort, function() {
	console.log(`Listening on ${serverPort}.`);
});