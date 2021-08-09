/*jslint browser: true, devel: true*/
/*eslint-env browser*/
/*global $, jQuery, alert*/

// When the user clicks on the button,
// toggle between hiding and showing the dropdown content
function gameDropdownHandler() {
  document.getElementById("game-dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
    	var dropdowns = document.getElementsByClassName("dropdown-content");
    	for (var i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) 
				openDropdown.classList.remove('show');
    	}
  	}
}


// Gets all of the current games from the MLB API and populates the dropdown selector
function getAllGames(){
	// Query the MLB API
	$.getJSON("https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1", function (dataGame) {
	// Populate dropdown list if there are games
	if(!jQuery.isEmptyObject(dataGame.dates)) {
		var gamesListSelector = document.getElementById("game-dropdown");
		var listOfGames = dataGame.dates[0].games;
		
		for(var i = 0; i < listOfGames.length; i++) {
			var aTagElement = document.createElement('a');
			var aTagText = document.createTextNode(listOfGames[i].teams.away.team.name 
												   + " @ " 
												   + listOfGames[i].teams.home.team.name);
			aTagElement.setAttribute('href', 
									 "javascript:gamePk = getMLBdata(" 
									 + listOfGames[i].gamePk 
									 +")");
			aTagElement.appendChild(aTagText);
			gamesListSelector.appendChild(aTagElement);
			
		}
	} else {
		document.getElementById("heading").innerHTML = "No games available";
	}
	});
}

getAllGames();