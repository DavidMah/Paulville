$(document).ready(function() {
	$(document).everyTime(100, 'adjust', adjustPanes, 0);
	initializeControls();
	initializeGame();

});



function initializeControls() {
	$('#help').click(helpWindow);
	$('#help_window').hide();
	$('.node').click(constructNode);
	$('.turret').hide();
	$('.construct_button').click(function(){selectType(this)});
	$('#send_wave').click(generateWave);
}
function helpWindow() {
	if(checkPause()) {
		return;
	}
	onReturn = function() {
		$('#help_window').hide();
		//$('#help').click(helpWindow);
	};
	pauseGame('You have opened the help window', onReturn);
	//$('#help').click(function() {returnToGame(onReturn);});
	$('#help_window').show();
}

function initializeGame() {
	setResource('dereks', 100);
	setResource('sacs', 100);
	setResource('bravos', 100);
	$(document).everyTime(50, 'update', gameUpdate, 0);
	$(document).attr('paused', false);
	$(document).attr('selected', null);

	var nodeData = [];
	//name, damage, dereks, sacs, bravos
	nodeData['basic_paul'] = ['Basic Paul', 10, 30, 30, 30];
	nodeData['boring_paul'] = ['Boring Paul', 15, 100, 30, 0];
	nodeData['squatty_paul'] = ['Squatty Paul', 19, 50, 100, 50];
	nodeData['thinky_paul'] = ['Thinky Paul', 26, 50, 50, 200];
	nodeData['sad_paul'] = ['Sad Paul', 35, 100, 100, 100];
	nodeData['covert_paul'] = ['Covert Paul', 50, 200, 200, 300];
	nodeData['gnome_paul'] = ['Gnome Paul', 65, 300, 300, 300];
	nodeData['kissy_paul'] = ['Kissy Paul', 80, 500, 500, 500];

	$(document).attr('node_data', nodeData);
	$(document).attr('enemy_count', 0);
	$(document).attr('enemies', []);
	$(document).attr('lives', 20);
	$(document).attr('level', 1);
	$(document).attr('lifelist', ['dummy']);
	$(document).attr('turrets', []);
	initializeBullets();
}
function initializeBullets() {
	var bullets = [];
	var turrets = $('.turret')
	for(var i = 0; i < 32; i++) {
		var round = [0]
		$(turrets[i]).attr('turret_id', i);
		for(var j = 0; j < 4; j++) {
			var bullet = document.createElement('div');	
			$('#sky').append(bullet);
			$(bullet).addClass('bullet');
			$(bullet).hide();
			round.push(bullet);
		}
		bullets.push(round);
	}
	$(document).attr('bullets', bullets);
}
/**************************************************
*************Code for reorganizing the layout********
***********************************************/
function adjustPanes() {
	if(!$(document).attr('paused') && (window.innerHeight < 800 || window.innerWidth < 1050))
		pauseGame('Window too Small. Please Resize. You might even consider holding CTRL and scrolling the mousewheel down', function(){return true;});
	if($('#footer').css('top') != (window.innerHeight - 300) + 'px') {
		$('#footer').css('top', (window.innerHeight - 300) + 'px');
		$('#sky').css('height', (window.innerHeight - 600) + 'px');
		$('#stage').css('top', (window.innerHeight - 500) + 'px');
	}
	if($('#footer').css('width') != (window.innerWidth) + 'px') {
		$('#footer').css('width', window.innerWidth + 'px');
		$('#sky').css('width', window.innerWidth + 'px');
		$('#stage').css('width', window.innerWidth + 'px');
		$('#middle_bar').css('left', parseInt((window.innerWidth - 720) / 2) + 'px');
		$('#controls').css('left', parseInt((window.innerWidth - 500) / 2) + 'px');
		$('#left_pane').css('width', parseInt((window.innerWidth - 700) / 2) + 90 + 'px');
		$('#right_pane').css('width', parseInt((window.innerWidth - 700) / 2) + 90 + 'px');
		$('#left_pane_content').css('left', parseInt((window.innerWidth - 700) / 2) - 450 + 'px');
	}
}
/*****************************************
**********Code for controlling the game***********
*******************************************/
function gameUpdate() {
	var enemies = $(document).attr('enemies');
	for(var i = 0; i < enemies.length; i++) {
		var result = move(enemies[i]);
		updateHealthBar(enemies[i]);
		if(!result) {
			$(enemies[i]).remove();
			enemies.splice(i, 1);
			i--;
		}
	}
	var turrets = $(document).attr('turrets');
	for(var i = 0; i < turrets.length; i++) {
		attack(turrets[i]);
	}
}
function pauseGame(reason, onReturn) {
	$(document).stopTime('update');
	$(document).attr('paused', true);
	$('#unpause')[0].innerHTML = reason + "... Press to Return to the Game";
	$('#unpause').show();
	$('#unpause').click(function() {returnToGame(onReturn);});
}
function checkPause() {
	if($(document).attr('paused')) {
		return true;
	}
	return false;
}
function returnToGame(onReturn) {
	$('#unpause').hide();
	onReturn();
	$(document).everyTime(50, 'update', gameUpdate, 0);
	$(document).attr('paused', false);
}
function hasResource(resource, n) {
	return $(document).attr(resource) >= n;
}
function setResource(resource, n) {
	$(document).attr(resource, n);
	$('#' + resource)[0].innerHTML = $(document).attr(resource);
}
function addResource(resource, n) {
	$(document).attr(resource, n + $(document).attr(resource));
	$('#' + resource)[0].innerHTML = $(document).attr(resource);
}
function selectType(dataObject) {
	if(checkPause()) {
		return false;
	}
	var nodeData = [];
	if(dataObject == null) {
		nodeData = ['No Selection', '', '', '', ''];
	} else {
		nodeData = $(document).attr('node_data')[$(dataObject).attr('type')];
	}

	var selectTable = $('#left_pane_content table td')
	for(var i = 0; i < 5; i++) {
		selectTable[i].innerHTML = nodeData[i];
	}

	if(dataObject == null) { 
		$('#selected_image').attr('src', 'images/no_paul.png');
		$(document.attr('selected', null));
		return;
	}

	if($(dataObject).is('.construct_button')) {
		$('#destroy_turret').hide();
		$('#turret_id_row').hide();
	} else {
		$('#destroy_turret').show();
		$('#turret_id_row').show();
		selectTable[5].innerHTML = $(dataObject).attr('turret_id');
		$('#destroy_turret').attr('onclick', '').unbind('click');
		$('#destroy_turret').click(function(){destroyTurret(dataObject);});
	}

	$('#selected_image').attr('src', 'images/select_' + $(dataObject).attr('type') + '.png');
	$(document).attr('selected', $(dataObject).attr('type'));
}
function constructNode() {
	if(checkPause()) {
		return;
	}
	var selected = $(document).attr('selected');
	if(!selected) {
		return;
	}
	if($(this.children[0]).css('display') != 'none') {
		return;
	}
	if(!subtractResources($(document).attr('node_data')[selected])) {
		return;
	}
	$(this).click(function(){selectType(turret);});

	var turret = this.children[0];
	$(turret).addClass(selected);
	$(turret).show();
	$(turret).attr('damage', $(document).attr('node_data')[selected][1]);
	$(turret).attr('type', selected);
	$(document).attr('turrets').push(turret);
}
function destroyTurret(turret) {
	if(checkPause()) {
		return false;
	}
	var turrets = $(document).attr('turrets');
	for(var i = 0; i < turrets.length; i++) {
		if(turrets[i] == turret) {
			turrets.splice(i, 1);
			$(turret).hide();
			$(turret).removeClass($(turret).attr('type'));
			selectType(null);
			return true;
		}
	}
	return false;
}
function subtractResources(necessary) {
	var dereks = necessary[2];
	var sacs = necessary[3];
	var bravos = necessary[4];
	if(!(hasResource('dereks', dereks) && hasResource('sacs', sacs) && hasResource('bravos', bravos))) {
		return false;
	}
	addResource('dereks', -dereks);
	addResource('sacs', -sacs);
	addResource('bravos', -bravos);
	return true;
}
function reward(target) {
	var funds = parseInt($(target).attr('worth'));
	addResource('dereks', funds);
	addResource('sacs', funds);
	addResource('bravos', funds);
}
function reduceLife() {
	$(document).attr('lives', $(document).attr('lives') - 1);
	$('#lives')[0].innerHTML = $(document).attr('lives');
	if($(document).attr('lives') == 0) {
		pauseGame('You just lost. You can keep playing though...', function(){});
	}
}

/*********************************************
******************Combat*********************
*******************************************/
function generateWave() {
	if(checkPause()) {
		return;
	}
	var difficulty = $(document).attr('level');
	difficulty = parseInt((Math.pow(difficulty * 0.9, 2) + 5 * difficulty) / 2);
	var enemies = DIFFICULTIES.map(function(x){return x;});
	while(difficulty > 0 && enemies.length > 0) {
		var choice = parseInt(Math.random() * enemies.length);	
		if(enemies[choice][1] > difficulty) {
			enemies.splice(choice, 1);
		} else {
			generateEnemy(enemies[choice]);
			difficulty -= enemies[choice][1];
		}
	}
	$('#wave_no')[0].innerHTML = $(document).attr('level');
	$(document).attr('level', $(document).attr('level') + 1);
}
function generateEnemy(enemyData) {
	var enemy = document.createElement('div');
	$(enemy).attr('x', parseInt(Math.random() * 200) + 2000);
	$(enemy).attr('y', parseInt(Math.random() * 100));
	$(enemy).css('left', $(enemy).attr('x') + 'px');
	$(enemy).css('top', $(enemy).attr('y') + 'px');
	$(enemy).attr('xVelocity', parseInt(-enemyData[3]));

	$(enemy).attr('count', $(document).attr('enemy_count'));
	$(enemy).attr('original-health', enemyData[2]);
	$(enemy).attr('health', enemyData[2]);
	$(enemy).attr('worth', enemyData[1]);

	var healthBar = document.createElement('div');
	$(healthBar).addClass('health_container');
	$(enemy).append(healthBar);

	var health = document.createElement('div');
	$(health).addClass('health_bar');
	$(healthBar).append(health);

	$(document).attr('lifelist')[$(document).attr('enemy_count')] = enemy;
	$(enemy).addClass(enemyData[0]);
	$(enemy).addClass('enemy');
	$('#sky').append(enemy);
	$(document).attr('enemies').push(enemy);
	$(document).attr("enemy_count", $(document).attr('enemy_count') + 1);
}
function move(enemy) {
	var x = parseInt($(enemy).attr('x'));
	var xVelocity = parseInt($(enemy).attr('xVelocity'));
	x += xVelocity;
	$(enemy).attr('x', x);
	$(enemy).css('left', x + "px");
	if(enemy.offsetLeft < -100 || parseFloat($(enemy).attr('health')) < 0) {
		$(document).attr('lifelist')[$(enemy).attr('count')] = null;
		if(enemy.offsetLeft < -100) {
			reduceLife();
		} else {
			reward(enemy);
		}
		return false;
	}
	return true;
}
function updateHealthBar(enemy) {
	var health = enemy.children[0].children[0];
	$(health).css('width', 80 * parseInt($(enemy).attr('health')) / parseInt($(enemy).attr('original-health')) + 'px');
}
function attack(turret) {
	if($(document).attr('enemies').length == 0) {
		return false;
	}
	var enemy = $(turret).attr('target');
	if(!enemy || !inRange(turret, enemy) || !$(document).attr('lifelist')[$(enemy).attr('count')]) {
		var enemies = $(document).attr('enemies');
		for(var i = 0; i < enemies.length; i++) {
			if(inRange(turret, enemies[i])) {
				$(turret).attr('target', $(enemies[i]).attr('count'));
			}
		}
	}
	enemy = $(document).attr('lifelist')[$(turret).attr('target')];
	if(!enemy || !inRange(turret, enemy)) {
		return false;
	}
	sendProjectile(turret, enemy);
}
function inRange(turret, other) {
	var yDistance = 100 - parseInt($(other).attr('y'));
	var xDistance = turret.offsetLeft - other.offsetLeft;
	var distance = Math.sqrt(yDistance * yDistance + xDistance * xDistance);
	return distance <= 400;
}
function sendProjectile(turret, other) {
	var round = $(document).attr('bullets')[parseInt($(turret).attr('turret_id'))];
	var bullet = round[round[0]];
	round[0] = (round[0] + 1) % 4;

	var turretOffset = $(turret).offset();
	var otherOffset = $(other).offset();
	$(bullet).show();

	var yDistance = otherOffset['top'] - turretOffset['top'];
	var xDistance = otherOffset['left'] - (turretOffset['left'] - (4 * parseInt($(other).attr('xVelocity'))));
	$(bullet).attr('x', turretOffset['left'] + parseInt((parseInt($(turret).css('width')) / 2)));
	$(bullet).attr('y', turretOffset['top'] + parseInt((parseInt($(turret).css('height')) / 2)));
	$(bullet).css('left', parseInt($(bullet).attr('x')) + 'px');
	$(bullet).css('top', parseInt($(bullet).attr('y')) + 'px');
	var xVelocity = parseInt(xDistance / 4);
	var yVelocity = parseInt(yDistance / 4);
	setTimeout(function() {moveProjectile(bullet, xVelocity, yVelocity, 3, turret, other)}, 10);
}
function moveProjectile(bullet, xVelocity, yVelocity, depth, turret, other) {
	if(depth == 0) {
		$(bullet).hide();
		damage(turret, other);
		return;
	}
	$(bullet).attr('x', parseInt($(bullet).attr('x')) + xVelocity);
	$(bullet).attr('y', parseInt($(bullet).attr('y')) + yVelocity);
	$(bullet).css('left', parseInt($(bullet).attr('x')) + 'px');
	$(bullet).css('top', parseInt($(bullet).attr('y')) + 'px');
	setTimeout(function() {moveProjectile(bullet, xVelocity, yVelocity, depth - 1, turret, other)}, 10);
	
}
function damage(turret, other) {
	var damage = .25 * parseInt($(turret).attr('damage'));
	var enemyHealth = parseFloat($(other).attr('health')) - damage;
	$(other).attr('health', enemyHealth);
}

/**********************************************
*********************Crap**********************
*********************************************/
var DIFFICULTIES = 
('isaac 45 2500 8\n' +
'dyal 30 700 16\n' +
'will 22 450 13\n' +
'derek 14 280 14\n' +
'mah 7 200 15\n' +
'bravo 1 30 18' +
'').split("\n").map(
	function(x){
		var temp =  x.split(" ")
		return [temp[0], parseInt(temp[1]), parseInt(temp[2]), parseInt(temp[3])];
	});
