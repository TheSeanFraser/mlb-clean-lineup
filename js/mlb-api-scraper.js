/*jslint browser: true, devel: true*/
/*eslint-env browser*/
/*global $, jQuery, alert*/

// Create arrays for HTML page IDs
		// Names
// GLOBAL VARIABLES
var HOME_NAME_IDS = ["home_bo1_real_name", "home_bo2_real_name", "home_bo3_real_name", "home_bo4_real_name",
					"home_bo5_real_name", "home_bo6_real_name", "home_bo7_real_name", "home_bo8_real_name",
					"home_bo9_real_name", "home_p_real_name"],

	AWAY_NAME_IDS = ["away_bo1_real_name", "away_bo2_real_name", "away_bo3_real_name", "away_bo4_real_name",
					"away_bo5_real_name", "away_bo6_real_name", "away_bo7_real_name", "away_bo8_real_name",
					"away_bo9_real_name", "away_p_real_name"],

	HOME_NICKNAME_IDS = ["home_bo1_nickname", "home_bo2_nickname", "home_bo3_nickname", "home_bo4_nickname",
					"home_bo5_nickname", "home_bo6_nickname", "home_bo7_nickname", "home_bo8_nickname",
					"home_bo9_nickname", "home_p_nickname"],

	AWAY_NICKNAME_IDS = ["away_bo1_nickname", "away_bo2_nickname", "away_bo3_nickname", "away_bo4_nickname",
					"away_bo5_nickname", "away_bo6_nickname", "away_bo7_nickname", "away_bo8_nickname",
					"away_bo9_nickname", "away_p_nickname"],
	// Positions
	HOME_POS_IDS = ["home_bo1_position", "home_bo2_position", "home_bo3_position", "home_bo4_position",
					"home_bo5_position", "home_bo6_position", "home_bo7_position", "home_bo8_position",
					"home_bo9_position", "home_p_position"],

	AWAY_POS_IDS = ["away_bo1_position", "away_bo2_position", "away_bo3_position", "away_bo4_position",
					"away_bo5_position", "away_bo6_position", "away_bo7_position", "away_bo8_position",
					"away_bo9_position", "away_p_position"],

	// Slashlines
	HOME_SLASH_IDS = ["home_bo1_slashline", "home_bo2_slashline", "home_bo3_slashline", "home_bo4_slashline",
					"home_bo5_slashline", "home_bo6_slashline", "home_bo7_slashline", "home_bo8_slashline",
					"home_bo9_slashline", "home_p_slashline"],

	AWAY_SLASH_IDS = ["away_bo1_slashline", "away_bo2_slashline", "away_bo3_slashline", "away_bo4_slashline",
					"away_bo5_slashline", "away_bo6_slashline", "away_bo7_slashline", "away_bo8_slashline",
					"away_bo9_slashline", "away_p_slashline"],

	// Storage arrays
	homeBattingOrder,
	awayBattingOrder,
	homeIDs,
	awayIDs,
	// Game ID from MLB
	gamePk = null;


function getMLBdata(gamePk = null){
	$.ajaxSetup({
    	async: false
	});
	var curGamePk = gamePk;
	
	if(curGamePk == null) {
		// Find today's gamePk if one is not provided
		$.getJSON("https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1", function (dataGame) {
			// Check if game data is empty
			if(!jQuery.isEmptyObject(dataGame.dates)) {
				curGamePk = dataGame.dates[0].games[0].gamePk;
				applyGameStatus(dataGame);

				// Grab the JSON data from the MLB API and utilize it.
				$.getJSON("https://statsapi.mlb.com//api/v1/game/" + curGamePk + "/boxscore", function (data) {
					// Using the data from this request, we then perform the rest of the actions
					// Sets the current ten players for each team
					setLineUp(data);
					// Sets the batting order with "ID" strings
					setBattingOrderIDs(data);	
					// Applies the data to the HTML page
					applyTeamNames(data);
					applyBattingOrder(data);
					applyPitchers(data);
				});
			}
			else {
				document.getElementById("heading").innerHTML = "No game available";
			}
		});
		
	} else {
		// Find today's gamePk
		$.getJSON("https://statsapi.mlb.com/api/v1/schedule?gamePk=" + curGamePk, function (dataGame) {
			curGamePk = dataGame.dates[0].games[0].gamePk;
			applyGameStatus(dataGame);
		});

		// Grab the JSON data from the MLB API and utilize it.
		$.getJSON("https://statsapi.mlb.com//api/v1/game/" + curGamePk + "/boxscore", function (data) {
			// Using the data from this request, we then perform the rest of the actions
			// Sets the current ten players for each team
			setLineUp(data);
			// Sets the batting order with "ID" strings
			setBattingOrderIDs(data);	
			// Applies the data to the HTML page
			applyTeamNames(data);
			applyBattingOrder(data);
			applyPitchers(data);
		});
	}
	// Returns the current gamePk for passing by value
	return curGamePk;
}

// Stores the lineup of each team (batting order + pitcher)
// Only ID numbers
function setLineUp(data) {
	// Create arrays of the batting order MLB IDs. Add pitcher onto end, since they aren't in batting order
	homeIDs = data.teams.home.battingOrder;
	homeIDs.push(data.teams.home.pitchers[data.teams.home.pitchers.length - 1]);
	awayIDs = data.teams.away.battingOrder;
	awayIDs.push(data.teams.away.pitchers[data.teams.away.pitchers.length - 1]);
}

// Stores batting orders with "ID" string
function setBattingOrderIDs(data) {
		// Store with 'ID' added for convenience
		homeBattingOrder = ["ID" + data.teams.home.battingOrder[0], "ID" + data.teams.home.battingOrder[1],
							"ID" + data.teams.home.battingOrder[2], "ID" + data.teams.home.battingOrder[3],
							"ID" + data.teams.home.battingOrder[4], "ID" + data.teams.home.battingOrder[5],
							"ID" + data.teams.home.battingOrder[6], "ID" + data.teams.home.battingOrder[7],
							"ID" + data.teams.home.battingOrder[8]];

		awayBattingOrder = ["ID" + data.teams.away.battingOrder[0], "ID" + data.teams.away.battingOrder[1],
							"ID" + data.teams.away.battingOrder[2], "ID" + data.teams.away.battingOrder[3],
							"ID" + data.teams.away.battingOrder[4], "ID" + data.teams.away.battingOrder[5],
							"ID" + data.teams.away.battingOrder[6], "ID" + data.teams.away.battingOrder[7],
							"ID" + data.teams.away.battingOrder[8]];
}

// Applies the game status to the top of the HTML page
function applyGameStatus(data){
	var gameData = data.dates[0].games[0];
	// If the game hasn't started yet, add the start time
	if(gameData.status.detailedState == "Scheduled" || gameData.status.detailedState == "Postponed") {
		let gameTime = new Date(Date.parse(gameData.gameDate));
		var gameTimeString = gameData.status.detailedState 
							+ " - " 
							+ gameTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
		document.getElementById("heading").innerHTML = gameTimeString;
		document.getElementById("venue").innerHTML = gameData.venue.name;
			
	} else {	// Otherwise show the score
		var scoreString = gameData.teams.home.team.name + " " 
						+ gameData.teams.home.score + " - " 
						+ gameData.teams.away.score + " "
						+ gameData.teams.away.team.name;
		document.getElementById("heading").innerHTML = scoreString;
		document.getElementById("venue").innerHTML = gameData.venue.name;
	}
}

// Applies the team names and records
function applyTeamNames(data){
	let homeTeamRecord = 	data.teams.home.team.record.leagueRecord.wins + " - " + 
							data.teams.home.team.record.leagueRecord.losses;
	let awayTeamRecord = 	data.teams.away.team.record.leagueRecord.wins + " - " + 
							data.teams.away.team.record.leagueRecord.losses;

	document.getElementById("home_team").innerHTML = data.teams.home.team.name + " \("+ homeTeamRecord + "\)";
	document.getElementById("away_team").innerHTML = data.teams.away.team.name + " \("+ awayTeamRecord + "\)";;
}

// Applies the batting order to the HTML page
// Loops through Home & Away team and gets nicknames
function applyBattingOrder(data){
	// First check to see if batting order is published
	if (data.teams.home.battingOrder.length != 1){
	// Loop through batting order to populate data
		for (var i = 0; i < 9; i++){
			// Set Home Position Players
			// Names
			document.getElementById(HOME_NAME_IDS[i]).innerHTML =  data.teams.home.players[homeBattingOrder[i]].person.fullName;

			// Set nickname to blank, in case there is no nickname available
			document.getElementById(HOME_NICKNAME_IDS[i]).innerHTML = "";
			// Grab player page for nickname data
			// Not necessary, but it is fun to have		
			var peopleData;
			$.getJSON("https://statsapi.mlb.com/api/v1/people/" + homeIDs[i], function (data2) {
				peopleData = data2;
			});
			if(peopleData.people[0].nickName)
					document.getElementById(HOME_NICKNAME_IDS[i]).innerHTML = "\""+ peopleData.people[0].nickName + "\"";
			// Positions
			// We add in the position that the player is also playing
			document.getElementById(HOME_POS_IDS[i]).innerHTML =  data.teams.home.players[homeBattingOrder[i]].position.abbreviation;

			// # and slashline
			// Creates a string for the slashline: Player number, hits/ABs,  AVG/OBP/SLG,   and home runs
			document.getElementById(HOME_SLASH_IDS[i]).innerHTML = 
				"#" + data.teams.home.players[homeBattingOrder[i]].jerseyNumber + ": "+
				data.teams.home.players[homeBattingOrder[i]].stats.batting.hits+ "-" + 
				data.teams.home.players[homeBattingOrder[i]].stats.batting.atBats + " || " +
				data.teams.home.players[homeBattingOrder[i]].seasonStats.batting.avg + "/" +
				data.teams.home.players[homeBattingOrder[i]].seasonStats.batting.obp + "/" +
				data.teams.home.players[homeBattingOrder[i]].seasonStats.batting.slg + " | " +
				data.teams.home.players[homeBattingOrder[i]].seasonStats.batting.homeRuns + "HR || " +
				peopleData.people[0].currentAge + "y, " +
				(peopleData.people[0].height).replace(/\s+/g, '') + "\", " +
				peopleData.people[0].weight + "";

			// Set Away Team Position Players
			// Names
			document.getElementById(AWAY_NAME_IDS[i]).innerHTML =  data.teams.away.players[awayBattingOrder[i]].person.fullName;

			// Set nickname to blank, in case there is no nickname available
			document.getElementById(AWAY_NICKNAME_IDS[i]).innerHTML = "";
			// Grab player page for nickname data
			// Not necessary, but it is fun to have
			$.getJSON("https://statsapi.mlb.com/api/v1/people/" + awayIDs[i], function (data2) {
				peopleData = data2;
				if(data2.people[0].nickName)
					document.getElementById(AWAY_NICKNAME_IDS[i]).innerHTML = "\""+ data2.people[0].nickName + "\"";
			});

			// Positions
			// We add in the position that the player is also playing
			document.getElementById(AWAY_POS_IDS[i]).innerHTML =  data.teams.away.players[awayBattingOrder[i]].position.abbreviation;

			// # and slashline
			// Creates a string for the slashline: Player number, hits/ABs,  AVG/OBP/SLG,   and home runs
			document.getElementById(AWAY_SLASH_IDS[i]).innerHTML = 
				"#" + data.teams.away.players[awayBattingOrder[i]].jerseyNumber + ": "+
				data.teams.away.players[awayBattingOrder[i]].stats.batting.hits+ "-" + 
				data.teams.away.players[awayBattingOrder[i]].stats.batting.atBats + " || " +
				data.teams.away.players[awayBattingOrder[i]].seasonStats.batting.avg + "/" +
				data.teams.away.players[awayBattingOrder[i]].seasonStats.batting.obp + "/" +
				data.teams.away.players[awayBattingOrder[i]].seasonStats.batting.slg + " | " +
				data.teams.away.players[awayBattingOrder[i]].seasonStats.batting.homeRuns + "HR || " +
				peopleData.people[0].currentAge + "y, " +
				(peopleData.people[0].height).replace(/\s+/g, '') + "\", " +
				peopleData.people[0].weight + "";

		} // End of FOR loop
	}
	// If no batting order, clear the page
	else {
		for (var i = 0; i < 9; i++){
			document.getElementById(HOME_NAME_IDS[i]).innerHTML =  " ";
			document.getElementById(HOME_NICKNAME_IDS[i]).innerHTML =  " ";
			document.getElementById(HOME_SLASH_IDS[i]).innerHTML =  " ";

			document.getElementById(AWAY_NAME_IDS[i]).innerHTML =  " ";
			document.getElementById(AWAY_NICKNAME_IDS[i]).innerHTML =  " ";
			document.getElementById(AWAY_SLASH_IDS[i]).innerHTML =  " ";
		}
	}
}

// Applies the pitchers to the HTML page, since they have different stats
function applyPitchers(data){
	// Check to see if pitchers are available
	if (data.teams.home.pitchers.length != 0){
		// Set the Home Pitcher
		// Grab the pitcher's ID
		var HOME_pitcher_MLB_ID = "ID" + data.teams.home.pitchers[data.teams.home.pitchers.length - 1];
		// Set name
		document.getElementById(HOME_NAME_IDS[9]).innerHTML =  data.teams.home.players[HOME_pitcher_MLB_ID].person.fullName;

		// Set nickname to blank, in case there is no nickname available
		document.getElementById(HOME_NICKNAME_IDS[9]).innerHTML = "";
		// Grab player page for nickname data
		// Not necessary, but it is fun to have
		var peopleData;
		$.getJSON("https://statsapi.mlb.com/api/v1/people/" + homeIDs[9], function (data2) {
				peopleData = data2;
				if(data2.people[0].nickName)
					document.getElementById(HOME_NICKNAME_IDS[9]).innerHTML = "\"" + data2.people[0].nickName + "\"";
		});

		// Set the slashline: Player Number, IP in game, ERA, IP for season
		document.getElementById(HOME_SLASH_IDS[9]).innerHTML = 
			"#" + data.teams.home.players[HOME_pitcher_MLB_ID].jerseyNumber + ": " +
			data.teams.home.players[HOME_pitcher_MLB_ID].stats.pitching.inningsPitched + " IP  || " +
			data.teams.home.players[HOME_pitcher_MLB_ID].seasonStats.pitching.era + " ERA / " +
			data.teams.home.players[HOME_pitcher_MLB_ID].seasonStats.pitching.inningsPitched + " IP || " +
			peopleData.people[0].currentAge + "y, " +
			(peopleData.people[0].height).replace(/\s+/g, '') + "\", " +
			peopleData.people[0].weight + "";

		// Set Away Pitcher
		// Grab the pitcher's ID
		var AWAY_pitcher_MLB_ID = "ID" + data.teams.away.pitchers[data.teams.away.pitchers.length - 1];
		document.getElementById(AWAY_NAME_IDS[9]).innerHTML =  data.teams.away.players[AWAY_pitcher_MLB_ID].person.fullName;

		// Set nickname to blank, in case there is no nickname available
		document.getElementById(AWAY_NICKNAME_IDS[9]).innerHTML = "";
		// Grab player page for nickname data
		// Not necessary, but it is fun to have
		$.getJSON("https://statsapi.mlb.com/api/v1/people/" + awayIDs[9], function (data2) {
			peopleData = data2;
				if(data2.people[0].nickName)
					document.getElementById(AWAY_NICKNAME_IDS[9]).innerHTML = "\"" + data2.people[0].nickName + "\"";
		});

		// Set the slashline: Player Number, IP in game, ERA, IP for season
		document.getElementById(AWAY_SLASH_IDS[9]).innerHTML = 
			"#" + data.teams.away.players[AWAY_pitcher_MLB_ID].jerseyNumber + ": " +
			data.teams.away.players[AWAY_pitcher_MLB_ID].stats.pitching.inningsPitched + " IP  || " +
			data.teams.away.players[AWAY_pitcher_MLB_ID].seasonStats.pitching.era + " ERA / " +
			data.teams.away.players[AWAY_pitcher_MLB_ID].seasonStats.pitching.inningsPitched + " IP || " +
			peopleData.people[0].currentAge + "y, " +
			(peopleData.people[0].height).replace(/\s+/g, '') + "\", " +
			peopleData.people[0].weight + "";
	}
	// Else, clear the pitcher lines
	else {
		document.getElementById(HOME_NAME_IDS[9]).innerHTML = " ";
		document.getElementById(HOME_NICKNAME_IDS[9]).innerHTML = "";
		document.getElementById(HOME_SLASH_IDS[9]).innerHTML = " ";

		document.getElementById(AWAY_NAME_IDS[9]).innerHTML = " ";
		document.getElementById(AWAY_NICKNAME_IDS[9]).innerHTML = "";
		document.getElementById(AWAY_SLASH_IDS[9]).innerHTML = " ";
	}
}


// Get the data
// Must assign value because Javascript passes by value, not reference
gamePk = getMLBdata();

// Run the function every 30 seconds to update the data
const interval = setInterval(function() {
	gamePk = getMLBdata(gamePk);
 }, 30000);