let elem = document.querySelector('#player');
let search = window.location.search.split('open=');
if (search.length == 2 && search[1] != '') {
    elem.setAttribute('src', search[1]);
}

if (elem.getAttribute('src') != "no-source") {
    let tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;

    function onYouTubeIframeAPIReady() {
        // ?open=https://www.youtube.com/embed/QEPYBkO2mX0
        player = new YT.Player('player', {
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
}