'use strict';

// Schrijf een service die toelaat om de gegevens van deelnemers op te vragen. Als de gebruiker naar een door jou gekozen url surft, stuurt de service een array met JSON-objecten naar de client.  Gebruik een globale array  waarin je hardgecodeerd enkele deelnemer objecten steekt en geef deze terug als de gebruiker naar de door jou gekozen url surft.
// Elke deelnemer heeft een naam, een voornaam, een gender, uren, en minuten.
// Test de service door in de adresbalk van een browser naar de juiste url te surfen.

/* Libraries 'installeren' */
var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var path = require("path");
var url = require("url");
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

function Renner(naam, achternaam, uren, minuten, gender) {
    this.naam = naam;
    this.achternaam = achternaam;
    this.uren = uren;
    this.minuten = minuten;
    this.gender = gender;
}

var deelnemers = [
    {naam: "Piet", achternaam: "Piraat", uren: 4, minuten: 4, gender: "man"}, {naam: "Gobelijn", achternaam: "Professor", uren: 24, minuten: 6, gender: "man"},
    {naam: "Speedy", achternaam: "Gonzalez", uren: 2, minuten: 4, gender: "man"}, 
    {naam: "Josje", achternaam: "van K3", uren: 1, minuten: 54, gender: "vrouw"},
    {naam: "Smurfin", achternaam: "van de smurfen", uren: 0, minuten: 54, gender: "vrouw"},
]

var nieuweDeelnemer = {};
nieuweDeelnemer.naam = "Potige";
nieuweDeelnemer.achternaam = "Smurf";
nieuweDeelnemer.uren = 3;
nieuweDeelnemer.minuten = 12;
nieuweDeelnemer.gender = "man";

// Allow Cross Origin Calls
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/index.html', function(vraag, antwoord) {
    antwoord.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/list/', function(request, response) {
    response.send(JSON.stringify(deelnemers));
});

app.post('/addRunner', function (request, response) {
    console.log("We gaan een renner toevoegen");
     deelnemers.push(
         new Renner(request.body.naam, request.body.achternaam, request.body.geslacht, request.body.uren, request.body.minuten, request.body.gender)
     )
     response.end('{"message" : "Added Successfully", "status" : 200}. Naam toegevoegde deelnemer:' + deelnemers[deelnemers.length-1].naam);
});

// Listen on port
var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("App listening at http://%s:%s", host, port);
});

