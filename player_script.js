var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    // ?open=https://www.youtube.com/embed/QEPYBkO2mX0
    let search = window.location.search.split('open=');
    let elem = document.querySelector('#player');
    if (search.length < 2 || search[2] == '' || elem == undefined) { return; }

    player = new YT.Player(elem, {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.playVideo();
}

function onPlayerStateChange(event) {}