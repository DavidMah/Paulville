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
	$('.construct_button').click(selectType);
}
function helpWindow() {
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
	$(document).everyTime(100, 'update', gameUpdate, 0);
	$(document).attr('paused', false);
	$(document).attr('selected', null);

	var nodeData = [];
	//name, damage, dereks, sacs, bravos
	nodeData['basic_paul'] = ['Basic Paul', 10, 30, 30, 30];
	nodeData['sad_paul'] = ['Sad Paul', 15, 0, 70, 70];
	nodeData['undercover_paul'] = ['Undercover Paul', 19, 90, 30, 30];
	$(document).attr('node_data', nodeData);
	$(document).attr('enemies', []);
	$(document).attr('level', 1);
}
/**************************************************
*************Code for reorganizing the layout********
***********************************************/
function adjustPanes() {
	if(!$(document).attr('paused') && (window.innerHeight < 800 || window.innerWidth < 1050))
		pauseGame('Window too Small. Please Resize', function(){return true;});
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
		$(enemies[i]).attr('onUpdate')();
	}
}
function pauseGame(reason, onReturn) {
	$(document).stopTime('update');
	$(document).attr('paused', true);
	$('#unpause')[0].innerHTML = reason + "... Press to Return to the Game";
	$('#unpause').show();
	$('#unpause').click(function() {returnToGame(onReturn);});
}
function returnToGame(onReturn) {
	$('#unpause').hide();
	onReturn();
	$(document).everyTime(100, 'update', gameUpdate, 0);
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
function selectType() {
	$('#selected_image').attr('src', 'images/' + $(this).attr('id') + '.png');
	var nodeData = $(document).attr('node_data')[$(this).attr('type')];
	var selectTable = $('#left_pane_content table td')
	selectTable[0].innerHTML = nodeData[0];
	selectTable[1].innerHTML = nodeData[1];
	selectTable[2].innerHTML = nodeData[2];
	selectTable[3].innerHTML = nodeData[3];
	selectTable[4].innerHTML = nodeData[4];
	$(document).attr('selected', $(this).attr('type'));
}
function constructNode() {
	var selected = $(document).attr('selected');
	if(!selected) {
		return;
	}
	if(!subtractResources($(document).attr('node_data')[selected])) {
		return;
	}
	$(this.children[0]).addClass(selected);
	$(this.children[0]).show();
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

/*********************************************
******************Combat*********************
*******************************************/
function generateWave() {
	var difficulty = $(document).attr('level') * 10
	var enemies = DIFFICULTIES.map(function(x){return x;});
	while(difficulty > 0 && enemies.length > 0) {
		var choice = parseInt(Math.random() * enemies.length);	
		if(enemies[choice][1] > difficulty) {
			enemies.splice(choice, 1);
		} else {
			generateEnemy(enemies[choice][0]);
			difficulty -= enemies[choice][1];
		}
	}
	$(document).attr('level', $(document).attr('level') + 1);
}
function generateEnemy(enemyName) {
	enemy = document.createElement('div');
	$(enemy).css('left', "2000px");
	$(enemy).attr('x', 2000);
	$(enemy).attr('xVelocity', -13);
	$(enemy).addClass(enemyName);
	//$('#sky').appendChild(enemy);
	$(enemy).attr('onUpdate', [function () {
								var x = $(enemy).attr('x');
								var xVelocity = $(enemy).attr('xVelocity');
								x -= xVelocity;
								$(enemy).css('left', x + "px");
								}]);
	$(document).attr('enemies').push(enemy);
}

/**********************************************
*********************Crap**********************
*********************************************/
var DIFFICULTIES = 
(//'sac 25\n' +
//'dyal 19\n' +
'derek 12\n' +
'mah 7\n' +
//'bravo 3' +
'').split("\n").map(
	function(x){
		var temp =  x.split(" ")
		return [temp[0], parseInt(temp[1])];
	});
