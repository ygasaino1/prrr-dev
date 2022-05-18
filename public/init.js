// ELEMENTS
let player_elem = document.querySelector('#player');
let player_audio = document.querySelector('#player_audio');
let canvas = document.querySelector('canvas');

let visual_ = function() {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();

    let source = audioCtx.createMediaElementSource(player_audio);
    source.connect(analyser);
    // source.connect(audioCtx.destination);
    // analyser.connect(distortion);
    // distortion.connect(audioCtx.destination);

    analyser.fftSize = 64;
    var bufferLength = analyser.frequencyBinCount; //
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

let dataArray;
// let min = -130;
// let max = -80;
// let smooth = 0.5;
// let vis_kind = 0;

// let max = -60;
// let min = -61;
// let smooth = 0.9;
// let vis_kind = 0;

let max = -30;
let min = -70;
let smooth = 0.9;
let vis_kind = 0;

let offset = 0;

let visual = function() {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();


    let source = audioCtx.createMediaElementSource(player_audio);
    source.connect(analyser);

    analyser.fftSize = 32;
    var bufferLength = analyser.frequencyBinCount; //analyser.frequencyBinCount
    console.log(bufferLength);
    dataArray = new Uint8Array(bufferLength);

    let canvasCtx = canvas.getContext('2d');
    canvas.width = 255;
    canvas.height = window.innerHeight;
    let HEIGHT = canvas.height;
    let WIDTH = canvas.width;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
        if ((max + offset) < analyser.minDecibels) {
            analyser.minDecibels = max + offset - 1;
        }
        analyser.maxDecibels = max + offset; //-30
        analyser.minDecibels = min + offset; //-100
        analyser.smoothingTimeConstant = smooth; //0.8
        drawVisual = requestAnimationFrame(draw);
        if (vis_kind == 0) {
            analyser.getByteFrequencyData(dataArray);
        } else if (vis_kind == 1) {
            analyser.getByteTimeDomainData(dataArray);
        }


        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var y = 0;
        let gap = 5
        var barWidth = (HEIGHT - (bufferLength * gap)) / (bufferLength + 1);
        var barHeight;

        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.fillRect(0, y, WIDTH, barWidth);
        y += (barWidth + gap);

        for (var i = 0; i < bufferLength; i++) {
            if (dataArray[i] < 50) {
                barHeight = 0;
            } else if (dataArray[i] > 127) {
                barHeight = 255;
            } else {
                barHeight = 127;
            }

            canvasCtx.fillStyle = 'rgb(255, 255, 255)';
            canvasCtx.fillRect(WIDTH - barHeight, y, barHeight, barWidth);
            y += (barWidth + gap);
        }
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect((WIDTH / 2) - (gap), 0, (gap * 2), HEIGHT);
    };

    draw();
}