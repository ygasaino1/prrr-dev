// ELEMENTS
let player_elem = document.querySelector('#player');
let player_audio = document.querySelector('#player_audio');
let canvas = document.querySelector('canvas');

let data_wave;
let data_freq;

// let min = -130;
// let max = -80;
// let smooth = 0.5;
// let vis_kind = 0;

// let max = -60;
// let min = -61;
// let smooth = 0.9;
// let vis_kind = 0;

// let max = -30;
// let min = -70;
// let smooth = 0.9;

let max = -30;
let min = -90;
let smooth = 0.9;

let offset = 0;

let h_cur = 0;
let h_pre = 0;

let visual_1 = function() {
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

let visual_2 = function() {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();


    let source = audioCtx.createMediaElementSource(player_audio);
    source.connect(analyser);

    analyser.fftSize = 32;
    var bufferLength = analyser.frequencyBinCount; //analyser.frequencyBinCount
    console.log(bufferLength);
    data_wave = new Uint8Array(bufferLength);

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
            analyser.getByteFrequencyData(data_wave);
        } else if (vis_kind == 1) {
            analyser.getByteTimeDomainData(data_wave);
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
            if (data_wave[i] < 50) {
                barHeight = 0;
            } else if (data_wave[i] > 127) {
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
let visual = function() {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();


    let source = audioCtx.createMediaElementSource(player_audio);
    source.connect(analyser);

    analyser.fftSize = 32;
    var bufferLength = analyser.frequencyBinCount; //analyser.frequencyBinCount
    console.log(bufferLength);
    data_freq = new Uint8Array(bufferLength);
    data_wave = new Uint8Array(bufferLength);

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

        analyser.getByteFrequencyData(data_freq);
        analyser.getByteTimeDomainData(data_wave);


        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var y = 0;
        let gap = 5
        var barWidth = ((HEIGHT * (7 / 8)) - (bufferLength * gap)) / (bufferLength);
        var barValue;

        // canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        // canvasCtx.fillRect(0, y, WIDTH, barWidth);
        // y += (barWidth + gap);



        for (var i = 0; i < bufferLength; i++) {
            if (data_freq[i] < 100) {
                barValue = 0;
            } else {
                barValue = (WIDTH / 2) + (gap / 2);
            }
            // barValue = (data_freq[i] / 255) * (WIDTH / 2) + (gap / 2);

            y += (barWidth + gap);
            let x1 = WIDTH - barValue;
            let y1 = (HEIGHT * (7 / 8)) - y;
            let x2 = barValue;
            let y2 = barWidth;

            canvasCtx.fillStyle = 'rgb(255, 255, 255)';
            canvasCtx.fillRect(x1, y1, x2, y2);
        }
        // canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        // canvasCtx.fillRect((WIDTH / 2) - (gap), 0, (gap * 2), HEIGHT);



        h_cur = osc(data_wave[0]);
        if (h_cur < h_pre) {
            h_cur = h_pre + (h_cur - h_pre) * (1 - smooth);
        }
        h_pre = h_cur;

        let cl = (h_cur * h_cur * 1.5 * 255 | 0);
        canvasCtx.fillStyle = `rgb(${cl}, ${cl}, ${cl})`;
        canvasCtx.fillRect(0, HEIGHT, WIDTH, -((HEIGHT / 8)));

        h = h_cur * (HEIGHT * (7 / 8));
        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.fillRect(0, HEIGHT * (7 / 8) - gap, WIDTH / 2, -h);
        // canvasCtx.fillRect(0, HEIGHT - h_cur, WIDTH, h_cur);


    };

    draw();
}

function osc(n) {
    return (Math.abs(n - 128) / 127);
}