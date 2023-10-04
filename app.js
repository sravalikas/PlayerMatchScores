const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketMatchDetails.db");
let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`error ${error}`);
  }
};

initializeDbAndServer();

//API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `select player_id as playerId, player_name as playerName from player_details;`;
  const dbResponse = await database.all(getPlayersQuery);
  response.send(dbResponse);
});

//API 2
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `select player_id as playerId, player_name as playerName from player_details where player_id=${playerId};`;
  const dbResponse = await database.get(getPlayersQuery);
  response.send(dbResponse);
});

//API 3
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName } = request.body;
  const getPlayersQuery = `update player_details set player_name = '${playerName}' where player_id=${playerId};`;
  await database.run(getPlayersQuery);
  response.send("Player Details Updated");
});

//API 4
app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const getPlayersQuery = `select match_id as matchId, match, year from  match_details where match_id=${matchId};`;
  dbResponse = await database.get(getPlayersQuery);
  response.send(dbResponse);
});

//API 5
app.get("/players/:playerId/matches/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `select match_details.match_id as matchId, match, year from match_details inner join player_match_score on match_details.match_id = player_match_score.match_id where player_id=${playerId};`;
  dbResponse = await database.all(getPlayersQuery);
  response.send(dbResponse);
});

//API 6
app.get("/matches/:matchId/players/", async (request, response) => {
  const { matchId } = request.params;
  const getPlayersQuery = `select player_details.player_id as playerId, player_name as playerName from player_details inner join player_match_score on player_details.player_id = player_match_score.player_id where match_id=${matchId};`;
  dbResponse = await database.all(getPlayersQuery);
  response.send(dbResponse);
});

//API 7
app.get("/players/:playerId/playerScores/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `select player_id as playerId, player_name as playerName, sum(score) as totalScore, sum(fours) as totalFours, sum(sixes) as totalSixes from player_match_score natural join player_details where player_id=${playerId};`;
  dbResponse = await database.get(getPlayersQuery);
  response.send(dbResponse);
});

module.exports = app;
