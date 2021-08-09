/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function gameDropdownHandler() {
  document.getElementById("game-dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



function getAllGames(){
	$.getJSON("https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1", function (dataGame) {
	// Check if game data is empty
	if(!jQuery.isEmptyObject(dataGame.dates)) {
		var listOfGames = dataGame.dates[0].games;
		var gamesListSelector = document.getElementById("game-dropdown");
		for(var i = 0; i < listOfGames.length; i++) {
			
			var aTagElement = document.createElement('a');
			var aTagText = document.createTextNode(listOfGames[i].teams.away.team.name 
												   + " @ " 
												   + listOfGames[i].teams.home.team.name);
			aTagElement.setAttribute('href', "javascript:gamePk = getMLBdata(" + listOfGames[i].gamePk +")");
			aTagElement.appendChild(aTagText);
			gamesListSelector.appendChild(aTagElement);
			
		}
	}
	else {
		document.getElementById("heading").innerHTML = "No game available";
	}
	});
}

getAllGames();