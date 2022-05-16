var express = require('express');
var app = express();

var youtubeStream = require('youtube-audio-stream');


app.use(express.static(__dirname + '/public'));

app.get('/stream/:videoId', function(req, res) {
    try {
        youtubeStream(req.params.videoId).pipe(res);
    } catch (exception) {
        res.status(500).send(exception)
    }
});

app.listen(3000);