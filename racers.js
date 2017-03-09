'use strict';

// Schrijf een service die toelaat om de gegevens van deelnemers op te vragen. Als de gebruiker naar een door jou gekozen url surft, stuurt de service een array met JSON-objecten naar de client.  Gebruik een globale array  waarin je hardgecodeerd enkele deelnemer objecten steekt en geef deze terug als de gebruiker naar de door jou gekozen url surft.
// Elke deelnemer heeft een naam, een voornaam, een gender, uren, en minuten.
// Test de service door in de adresbalk van een browser naar de juiste url te surfen.

/* Libraries 'installeren' */
var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
var path = require("path");
var bodyParser = require('body-parser');
var fs = require('fs');

// MongoDB Connection URL
var url = 'mongodb://localhost:27017/test';

// app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

function Renner(naam, achternaam, uren, minuten, gender) {
    this.naam = naam;
    this.achternaam = achternaam;
    this.uren = uren;
    this.minuten = minuten;
    this.gender = gender;
}

function toonRenners(callback, mongoQuery) {
    // Use connect method to connect to the server
    mongoClient.connect(url, function (err, db) {
        console.log("Connected successfully to server");
        // Get the renners collection
        var collection = db.collection('renners');
        // Find all documents
        collection.find(mongoQuery).sort({uren: 1, minuten: 1}).toArray(function (err, docs) {
            if (!err) {
                var result = JSON.stringify(docs);
                callback(null, result);
            }
            else {
                console.log('Error while performing query.');
                console.log("Fout");
                callback(err, {});
            }
            db.close();
        });
    });
}

function toonEenRenner(callback, mongoQuery) {
    // Use connect method to connect to the server
    mongoClient.connect(url, function (err, db) {
        console.log("Connected successfully to server");
        // Get the renners collection
        var collection = db.collection('renners');
        // Find all documents
 
        collection.findOne(mongoQuery, function(err, docs) {
            if (!err) {
                var result = JSON.stringify(docs);
                callback(null, result);
            }
            else {
                console.log('Error while performing query.');
                console.log("Fout");
                callback(err, {});
            }
            db.close();
        });
    });
}

// Deze functie gebruiken we niet op dit moment
// function slaRennerOp(callback) {
//     // Use connect method to connect to the server
//     mongoClient.connect(url, function (err, db) {
//         console.log("Connected successfully to server");
//         // Get the renners collection
//         var collection = db.collection('renners');
//         // Find all documents
//         collection.find().toArray(function (err, docs) {
//             if (!err) {
//                 var result = JSON.stringify(docs);
//                 callback(null, result);
//             }
//             else {
//                 console.log('Error while performing query.');
//                 console.log("Fout");
//                 callback(err, {});
//             }
//             db.close();
//         });
//     });
// }
var deelnemers = [];

// var deelnemers = [
//     {naam: "Piet", achternaam: "Piraat", uren: 4, minuten: 4, gender: "man"}, {naam: "Gobelijn", achternaam: "Professor", uren: 24, minuten: 6, gender: "man"},
//     {naam: "Speedy", achternaam: "Gonzalez", uren: 2, minuten: 4, gender: "man"}, 
//     {naam: "Josje", achternaam: "van K3", uren: 1, minuten: 54, gender: "vrouw"},
//     {naam: "Smurfin", achternaam: "van de smurfen", uren: 0, minuten: 54, gender: "vrouw"},
// ]

// var nieuw = {};
// nieuw.naam = "Potige";
// nieuw.achternaam = "Smurf";
// nieuw.uren = 3;
// nieuw.minuten = 12;
// nieuw.gender = "man";

// Allow Cross Origin Calls
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/index.html', function(request, response) {
    response.setHeader('content-type', 'text/html');
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/pages/:page', function(request, response) {
    response.setHeader('content-type', 'text/html');
    response.sendFile(path.join(__dirname + "/pages/" + request.params.page));
 });

app.get('/list', function(request, response) {
   toonRenners(function(foutjes, resultaat) {
        response.setHeader('Content-Type', 'application/json');
        response.send(resultaat);
    });
});

app.get('/list/gender/:q', function(request, response) {
  console.log('Er werd gesurft naar /list/gender/' + request.params.q);
     var mongoQuery = {gender: request.params.q };
     toonRenners(function(foutjes, resultaat) {
        response.setHeader('Content-Type', 'application/json');
        response.send(resultaat);
    }, mongoQuery);
});

app.get('/list/:voornaam/:naam', function(request, response) {
     // response.send(request.params.user)
     // Peform a simple find and return all the documents
    var mongoQuery = {naam: request.params.voornaam, achternaam: request.params.naam };

    toonEenRenner(function(foutjes, resultaat) {
        response.setHeader('Content-Type', 'application/json');
        response.send(resultaat);
    }, mongoQuery);
});

app.post('/addRunner', function (request, response) {
    console.log("We gaan een renner toevoegen");
    
    deelnemers.push(
        // new Renner(nieuw.naam, nieuw.achternaam, nieuw.uren, nieuw.minuten, nieuw.gender)
        new Renner(request.body.name, request.body.lastname, request.body.hours, request.body.minutes, request.body.gender)
    )
    var nieuweDeelnemer = new Renner(request.body.name, request.body.lastname, request.body.hours, request.body.minutes, request.body.gender);
    
    // Sla de renner op in MongoDB
    mongoClient.connect(url, function (err, db) {
                db.collection('renners').save(nieuweDeelnemer, (err, result) => {
                if (err) return console.log(err)
                console.log('saved to database')
                res.setHeader('Content-Type', 'application/json');
                response.end('{"message" : "Added Successfully", "status" : 200}. Naam toegevoegde deelnemer:' + deelnemers[deelnemers.length-1].naam);
            })
        })
});

app.delete('/deleteRunner', function (request, response) {
    var mongoQuery = {naam: request.body.name, achternaam: request.body.lastname };
    console.log("We gaan een renner verwijderen. Onze query:");
    console.dir(mongoQuery);

    // Verwijder de renner in MongoDB
    
    mongoClient.connect(url, function (err, db) {
        db.collection('renners').remove(mongoQuery, function(err, result) {
            if(err) { throw err; }
             response.end("<p>Renner verwijderd</p>");
            });
    });   
});

// Listen on port
var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("App listening at http://%s:%s", host, port);
});