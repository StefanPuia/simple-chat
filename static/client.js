'use strict';

let ws;
let verbose = false;
let username;

window.addEventListener('load', function() {
	ws = new WebSocket("ws://" + window.location.hostname + ":" + (window.location.port || 80) + "/" + getRoom());
    ws.addEventListener('message', receivedMessageFromServer);
    ws.addEventListener('open', function() {
    	callSocket({room: getRoom(), type:'join', sender: username});
    })

	username = window.prompt('Enter a username');
	username = username?username:'Anon';


	$('#input').focus();

	$('#input').addEventListener('keypress', function(e) {
		let text = $('#input').value.trim();
		if(e.which == 13 && text != '') {
			let data = {
				type: 'message',
				room: getRoom(),
				sender: username,
				text: text
			}
			callSocket(data);
			$('#input').value = '';
		}
	})
})