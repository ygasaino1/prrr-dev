let search = window.location.search.split('open=');
// https://www.youtube.com/embed/QEPYBkO2mX0?playlist=${}&enablejsapi=1&controls=0&loop=1
// https://www.youtube.com/embed/videoseries?list=${}&enablejsapi=1&controls=0&loop=1
if (search.length == 2 && search[1] != '') {
    let url_;
    if (search[1].toLocaleLowerCase().includes('list') && !search[1].includes('list=LL')) {
        url_ = new URL(search[1]);
        let list_id_ = '';
        if (url_.searchParams.has('playlist')) { list_id_ = url_.searchParams.get('playlist') }
        if (url_.searchParams.has('list')) { list_id_ = url_.searchParams.get('list') }
        url_ = `https://www.youtube.com/embed/videoseries?list=${list_id_}&enablejsapi=1&controls=0&loop=1`;
    } else {
        let id_ = YouTubeGetID(search[1]);
        url_ = `https://www.youtube.com/embed/${id_}?playlist=${id_}&enablejsapi=1&controls=0&loop=1`;
    }
    // if (!url_.searchParams.has('autoplay')) { url_.searchParams.set('autoplay', 1) }
    // if (!url_.searchParams.has('loop')) { url_.searchParams.set('loop', 1) }
    // if (!url_.searchParams.has('controls')) { url_.searchParams.set('controls', 0) }
    // if (!url_.searchParams.has('enablejsapi')) { url_.searchParams.set('enablejsapi', 1) }
    // if (!url_.searchParams.has('playlist')) { url_.searchParams.set('playlist', id_) }
    console.log(url_);
    player_elem.setAttribute('src', url_);
}

function YouTubeGetID(v) {
    v = v.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (v[2] !== undefined) ? v[2].split(/[^0-9a-z_\-]/i)[0] : v[0];
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
        player.playVideo();
    }
    let ended = false;

    function onPlayerStateChange(event) {
        if (event.data == 1) {
            console.log('1');
            if (ended) {
                ended = false;
                audio_sync();
            }
        } else if (event.data == 2) {
            console.log('2');
        } else if (event.data == 3) {
            console.log('3');
        } else if (event.data == -1) {
            console.log('-1');
            ended = true;
        } else if (event.data == 5) {
            console.log('5');
        }
    }

    function audio_sync() {
        let video_id = player.getVideoData()['video_id'];
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