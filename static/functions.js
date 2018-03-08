'use strict';

function $(query) {
    let result = document.querySelectorAll(query);
    if (result.length > 1) {
        return result;
    } else if (result) {
        return result[0];
    }
    return undefined;
}

function newEl(tag, attr = {}) {
    let el = document.createElement(tag);
    Object.assign(el, attr);
    return el;
}

function newMessage(message) {
	let p = newEl('p');
	let b = newEl('b', {
		textContent: message.sender + ': ',
	})
	p.append(b);
	p.append(message.text);
	return p;
}

function newJoin(message) {
    let p = newEl('p');
    let i = newEl('i', {
        textContent: message.sender + ' just joined the chat room.'
    })
    p.append(i);
    return p;
}

function callSocket(payload) {
    if(verbose) console.log("ws sending: ", payload);
    if (ws.readyState !== ws.OPEN) {
        ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/");
    }
    ws.send(JSON.stringify(payload));
}

function receivedMessageFromServer(message) {
    message = JSON.parse(message.data)
    if(verbose) console.log("ws recieved: ", message);

    switch(message.type) {
        case 'message':
            $('.chatbox').append(newMessage(message));
            $('.chatbox').scrollTop = $('.chatbox').scrollHeight;
            break;

        case 'join':
            $('.chatbox').append(newJoin(message));
            $('.chatbox').scrollTop = $('.chatbox').scrollHeight;
    }
    
}

function getRoom() {
    let path = location.pathname;
    let parts = escape(path).split('/');
    return parts[1];
}