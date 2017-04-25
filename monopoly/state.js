function load(state) {
	for (var i = 0; i < 4; i++) {
		var player = players[i];
		if (player) {
			player.figure.parentNode.removeChild(player.figure);
		}
	}
	
	players = [];
	for (var i = 0; i < 4; i++) {
		var player = state.players && state.players[i];
		if (player) {
			players[i] = new Player(player.name, i);
			if (player.money !== undefined) {
				players[i].money = player.money;
			}
			players[i].position = player.position || 0;
			players[i].jailed = player.jailed;
			players[i].paused = player.paused;
			players[i].moveFigure();
			players[i].refreshStats();
		}
	}
	for (var i = 0; i < 4; i++) {
		var player = players[i];
		document.getElementById('name' + i).innerHTML = players.length ? player ? escape(player.name) : '' : '<input size=10>';
	}
	
	changePlaying(state.playing !== undefined ? state.playing : -1);
	
	for (var i = 0, field; field = fields[i]; i++) {
		var stateField = (state.fields && state.fields[i]) || {};
		if (field instanceof Place) {
			field.betted = stateField.betted || 0;
			field.upgrades = stateField.upgrades || 0;
			field.earns = stateField.earns || field.amounts[field.upgrades];
		}
		changeOwner.call(field, players[stateField.ownerIndex]);
	}
	
	questions = [];
	document.querySelector('.cancel').disabled = true;
	document.getElementById('message').textContent = '';
	document.getElementById('dice1').textContent = '';
	var dice2 = document.getElementById('dice2');
	if (dice2) {
		dice2.textContent = '';
	}
	
	say('State loaded.');
}


function save() {
	var state = { playing: playing, players: [], fields: [] };
	
	for (var i = 0; i < 4; i++) {
		var player = players[i];
		if (player) {
			state.players[i] = { name: player.name, money: player.money, position: player.position, jailed: player.jailed, paused: player.paused };
		}
	}
	
	for (var i = 0, field; field = fields[i]; i++) {
		var stateField = {};
		if (field.owner) {
			stateField.ownerIndex = field.owner.index;
		}
		if (field.earns) {
			stateField.earns = field.earns;
		}
		if (field.upgrades) {
			stateField.upgrades = field.upgrades;
		}
		if (field.betted) {
			stateField.betted = field.betted;
		}
		state.fields[i] = stateField;
	}
	
	return state;
}


function loadFromStorage() {
	var saved = localStorage.getItem(location.pathname);
	if (saved) {
		load(JSON.parse(saved));
	}
}


function saveToStorage() {
	localStorage.setItem(location.pathname, JSON.stringify(save()));
}


function clearStorage() {
	localStorage.removeItem(location.pathname);
}
