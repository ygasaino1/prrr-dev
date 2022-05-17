// const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/ytid/:videoId', function(req, res) {
    getAudio(req.params.videoId, res);
});

getAudio = (videoURL, res) => {
    console.log(videoURL);
    var stream = ytdl(videoURL, {
        quality: "lowestaudio",
        filter: "audioonly",
    }).pipe(res);
};