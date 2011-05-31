$(document).ready(function() {
	$(document).everyTime(100, 'adjust', adjustPanes, 0);
	initializeControls();
	initializeGame();
});



function initializeControls() {
	$('.node').click(constructNode);
	$('.turret').hide();
	$('.construct_button').click(selectType);
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
	nodeData['basic_paul'] = (['Basic Paul', 10, 30, 30, 30]);
	$(document).attr('node_data', nodeData);
}
/**************************************************
*************Code for reorganizing the layout********
***********************************************/
function adjustPanes() {
	if(!$(document).attr('paused') && (window.innerHeight < 800 || window.innerWidth < 1050))
		pauseGame('Window too Small. Please Resize');
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
}
function pauseGame(reason) {
	$(document).stopTime('update');
	$(document).attr('paused', true);
	$('#unpause')[0].innerHTML = reason + "... Press to Return to the Game";
	$('#unpause').show();
	$('#unpause').click(returnToGame)
}
function returnToGame() {
	$('#unpause').hide();
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
