// ELEMENTS
let player_elem = document.querySelector('#player');
let player_audio = document.querySelector('#player_audio');
let vis_div = document.querySelector('#vis');
let canvas = document.querySelector('canvas');

let HEIGHT;
let WIDTH;

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
let thershold = 150;
let smooth = 0.9;

let offset = 0;

let h_cur = 0;
let h_pre = 0;

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

    canvas.width = vis_div.clientWidth;
    canvas.height = vis_div.clientHeight;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
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
        var barWidth = ((HEIGHT * (8 / 9)) - (bufferLength * gap)) / (bufferLength);
        var barValue;

        for (var i = 0; i < bufferLength; i++) {
            if (data_freq[i] < thershold) {
                barValue = 0;
            } else {
                barValue = (WIDTH / 2) + (gap / 2);
            }

            y += (barWidth + gap);
            let x1 = WIDTH - barValue;
            let y1 = (HEIGHT * (8 / 9)) - y;
            let x2 = barValue;
            let y2 = barWidth;

            canvasCtx.fillStyle = 'rgb(255, 255, 255)';
            canvasCtx.fillRect(x1, y1, x2, y2);
        }

        h_cur = osc(data_wave[0]);
        if (h_cur < h_pre) {
            h_cur = h_pre + (h_cur - h_pre) * (1 - smooth);
        }
        h_pre = h_cur;

        // let cl = Math.pow(h_cur, 2) * 5 - 0.1;
        let cl = Math.pow(Math.tan(h_cur - 0.25), 3) * 10;
        cl = (cl * 255 | 0);
        canvasCtx.fillStyle = `rgb(${cl}, ${cl}, ${cl})`;
        canvasCtx.fillRect(0, HEIGHT, WIDTH, -((HEIGHT / 9)));

        h = h_cur * (HEIGHT * (8 / 9));
        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.fillRect(0, HEIGHT * (8 / 9) - gap, WIDTH / 2, -h);
    };

    draw();
}

function osc(n) {
    return (Math.abs(n - 128) / 127);
}

// window.addEventListener('resize', () => {
//     canvas.width = vis_div.clientWidth;
//     canvas.height = vis_div.clientHeight;
//     WIDTH = canvas.width;
//     HEIGHT = canvas.height;
// });