const app = window.app;

const context = new AudioContext();
const gainNode = context.createGain();
gainNode.gain.value = 0.5;
gainNode.connect(context.destination);

const audioData = { woodblock: null };

const instruments = {
    "Crash Cymbal": "Crash-Cymbal-1.wav",
    "Hi Hat": "Closed-Hi-Hat-1.wav",
    "Snare": "Hip-Hop-Snare-1.wav",
    "Bass Drum": "Bass-Drum-2.wav"
};

async function initializeAudio(){
    const loaded = [];
    Object.keys(instruments).forEach(async key => {
        const response = await fetch(`sound/${instruments[key]}`);
        const arrayBuffer = await response.arrayBuffer();
        audioData[key] = await context.decodeAudioData(arrayBuffer);        
        loaded.push(key);
        app.ports.onInstrumentLoaded.send(loaded);
    });
}

initializeAudio();

function noteOn(name, when){
    const source = context.createBufferSource();
    source.buffer = audioData[name];
    source.connect(gainNode);
    source.start(when);
    //console.log(`note on: timestamp=${context.currentTime.toFixed(2)}, name=${name}, when=${when.toFixed(2)}, delta=${(when - context.currentTime).toFixed(2)}`);
}

app.ports.noteOn.subscribe(function(name) {
    noteOn(name, 0);
});

app.ports.schedule.subscribe(function(tracks) {
    if(0 < tracks.length){
        tracks.forEach(track => {
            track.schedules.forEach(schedule => {
                noteOn(track.name, schedule);
            });
        });
    }
});

setInterval(function(){
    app.ports.tick.send(context.currentTime);
}, 40);