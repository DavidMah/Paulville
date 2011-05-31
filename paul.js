var updateTimer;
$(document).ready(function() {
	$(document).everyTime(100, 'adjust', adjustPanes, 0);
	initializeGame();
});

function initializeGame() {
	setResource('dereks', 100);
	setResource('sacs', 100);
	setResource('bravos', 100);
	$(document).everyTime(100, 'update', gameUpdate, 0);
	$(document).attr('paused', false);
}
function adjustPanes() {
	if(!$(document).attr('paused') && (window.innerHeight < 800 || window.innerWidth < 800))
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
	}
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
function gameUpdate() {
}
function setResource(resource, n) {
	$(document).attr(resource, n);
	$('#' + resource)[0].innerHTML = $(document).attr(resource);
}
function addResource(resource, n) {
	$(document).attr(resource, n + $(document).attr(resource));
	$('#' + resource)[0].innerHTML = $(document).attr(resource);
}
