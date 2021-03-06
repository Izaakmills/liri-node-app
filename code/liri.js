// 
// var api = require("./api")
require("dotenv").config();
var appendLog = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require("moment")
// 
let term = process.argv[2]
let searchItem = process.argv[3]

switch (term) {
    case "concert-this":
        bandsintown(searchItem)
        break;
    case "spotify-this-song":
        spotifySong(searchItem)
        break;
    case "movie-this":
        omdbSearch(searchItem)
        break;
    case "do-what-it-says":
        console.log("do what it says")
        break;
}

var spotifyID = process.env.SPOTIFY_ID
var spotifySecret = process.env.SPOTIFY_SECRET

function spotifySong(song) {
    var spotify = new Spotify({
        id: spotifyID,
        secret: spotifySecret
    });
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songs = data.tracks.items

        var spotifyData = [
            "Artist: " + songs[0].artists[0].name,
            "Song: " + songs[0].name,
            "Link: " + songs[0].href,
            "Album: " + songs[0].album.name
        ].join('\n\n')

        console.log(spotifyData)
        appendLog.appendFile("log.txt", spotifyData, function (err) {
            if (err) throw err;
        });
    });
}

function omdbSearch(FMovie) {
    request('http://www.omdbapi.com/?apikey=Trilogy&t=' + FMovie, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body);
        var omdbJson = JSON.parse(body)
        console.log(omdbJson)
        var omdbData = [
            "\n\nTitle: " + omdbJson.Title,
            "Year Released: " + omdbJson.Year,
            "Actors: " + omdbJson.Actors,
            "IMDB Rating: " + omdbJson.imdbRating,
            // "Rotten Tomatoes Rating: " + omdbJson.rottenTomatoes,
            "Produced In: " + omdbJson.Country,
            "Language: " + omdbJson.Language,
            "Plot: " + omdbJson.Plot,
        ].join('\n')
        console.log(omdbData)
        appendLog.appendFile("log.txt", omdbData, function (err) {
            if (err) throw err;
        });
    });
}
// Name of the venue
// Venue location
// Date of the Even
function bandsintown(band) {
    request('https://rest.bandsintown.com/artists/' + band + '/events?app_id=trilogy', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body);
        var bandJson = JSON.parse(body)
        console.log(bandJson)
        var bandData = [
            "\n\nVenue: " + bandJson[0].venue.name,
            "Venue Location: " +  bandJson[0].venue.city+ ", " + bandJson[0].venue.region,
            "Date: " + moment(bandJson[0].datetime).format('MM/DD/YYYY')
        ].join('\n')
        console.log(bandData)
        appendLog.appendFile("log.txt", bandData, function (err) {
            if (err) throw err;
        });
    });
}