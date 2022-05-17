// ELEMENTS
let player_elem = document.querySelector('#player');
let player_audio = document.querySelector('#player_audio');
let canvas = document.querySelector('canvas');

let visual = function() {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();

    let source = audioCtx.createMediaElementSource(player_audio);
    source.connect(analyser);
    // source.connect(audioCtx.destination);
    // analyser.connect(distortion);
    // distortion.connect(audioCtx.destination);

    analyser.fftSize = 64;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    let canvasCtx = canvas.getContext('2d');
    canvas.width = 255;
    canvas.height = window.innerHeight;
    let HEIGHT = canvas.height;
    let WIDTH = canvas.width;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var y = 0;
        let gap = 2
        var barWidth = ((HEIGHT - (bufferLength - 1) * gap) / bufferLength);
        var barHeight;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(255, 255, 255)';
            canvasCtx.fillRect(WIDTH - barHeight, y, barHeight, barWidth);
            y += (barWidth + gap);
        }
    };

    draw();
}