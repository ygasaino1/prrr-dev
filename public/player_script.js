let search = window.location.search.split('open=');
// ?open=https://www.youtube.com/embed/QEPYBkO2mX0
if (search.length == 2 && search[1] != '') {
    let url_ = new URL(search[1]);
    // if (!url_.searchParams.has('autoplay')) { url_.searchParams.set('autoplay', 1) }
    if (!url_.searchParams.has('controls')) { url_.searchParams.set('controls', 0) }
    if (!url_.searchParams.has('enablejsapi')) { url_.searchParams.set('enablejsapi', 1) } //
    player_elem.setAttribute('src', url_.href);
}

if (player_elem.getAttribute('src') != "no-source") {
    let tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        visual();
    }

    function onPlayerReady(event) {
        play();
    }
    let ended = false;

    function onPlayerStateChange(event) {
        if (event.data == 0) {
            ended = true; // ended = yellow
            console.log('video:end;');
        } else if (event.data == 1 && ended == true) {
            ended = false; // playing = green
            play();
            console.log('video:replay;');
        } else if (event.data == 1) {
            player_audio.play();
            console.log('video:resume;');
        } else if (event.data == 2) {
            player_audio.pause();
            console.log('video:pause;');
        }
    }

    function play() {
        let video_id = player.getVideoData()['video_id'];
        // let audio_url = `https://prrr-001.glitch.me/ytid/${video_id}`;
        let audio_url = `https://prrr-dev.glitch.me/ytid/${video_id}`;
        player_audio.setAttribute('src', audio_url);
        player_elem.style.visibility = 'hidden';
        console.log(video_id);
        //1.
        player.mute();
        player_audio.muted = true;
        //2.
        player.playVideo();
        player_audio.play();
        //3.
        setTimeout(() => {

            player_audio.currentTime = 0;
            player.seekTo(0);
            player_elem.style.visibility = 'visible';
            player_audio.muted = false;
            player.unMute();
        }, 5000);
    }
}