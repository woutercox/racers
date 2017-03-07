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

var deelnemers = [
    {naam: "Piet", achternaam: "Piraat", uren: 4, minuten: 4, gender: "man"}, {naam: "Gobelijn", achternaam: "Professor", uren: 24, minuten: 6, gender: "man"},
    {naam: "Speedy", achternaam: "Gonzalez", uren: 2, minuten: 4, gender: "man"}, 
    {naam: "Josje", achternaam: "van K3", uren: 1, minuten: 54, gender: "vrouw"},
    {naam: "Smurfin", achternaam: "van de smurfen", uren: 0, minuten: 54, gender: "vrouw"},
]

// Allow Cross Origin Calls
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/list/', function(vraag, antwoord) {
    antwoord.send(deelnemers);
});

// Listen on port
var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("App listening at http://%s:%s", host, port);
});

