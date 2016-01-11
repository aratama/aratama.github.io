// https://github.com/nusofthq/Recordmp3js

// Long time audio can't be encoded because of memory over flow.
// `TOTAL_MEMORY` should be enlarged?  
// see emscripten's settings.js


// wavBinary :: ArrayBuffer
// callback :: Uint8Array -> Eff
function encodeWavToMp3(wavBinary){
    return function(reject){
        return function(resolve){
            return function(){
                






                function parseWav(wav) {
                    function readInt(i, bytes) {
                        var ret = 0,
                            shft = 0;

                        while (bytes) {
                            ret += wav[i] << shft;
                            shft += 8;
                            i++;
                            bytes--;
                        }
                        return ret;
                    }

                    var compressionCode = readInt(20, 2);
                    var numberOfChannels = readInt(22, 2);
                    var samples = wav.subarray(44);

                    if (compressionCode != 1) throw 'Invalid compression code, not PCM';
                    //if (numberOfChannels != 1) throw 'Invalid number of channels, not 1';
                    return {
                        sampleRate: readInt(24, 4),
                        bitsPerSample: readInt(34, 2),
                        samples: samples,
                        numberOfChannels: numberOfChannels
                    };
                }

                function Uint8ArrayToFloat32Array(u8a){
                    var f32Buffer = new Float32Array(u8a.length);
                    for (var i = 0; i < u8a.length; i++) {
                        var value = u8a[i<<1] + (u8a[(i<<1)+1]<<8);
                        if (value >= 0x8000) value |= ~0x7FFF;
                        f32Buffer[i] = value / 0x8000;
                    }
                    return f32Buffer;
                }

                var uint8Array = new Uint8Array(wavBinary);

                var data = parseWav(uint8Array);
                
                console.log(data);
                console.log("Converting to Mp3");
                var start = new Date();
                console.log("start: " + start);
                //log.innerHTML += "\n" + "Converting to Mp3";


                var worker = new Worker("../lib/src/recorderWorker.js");
                worker.onmessage = function(e){
                    var blob = e.data;
                    resolve(blob)();

                    console.log("Done converting to Mp3");
                    var finish = new Date();
                    console.log("finish: " + ((finish - start) * 0.001).toFixed(1) + " secs.");
                    
                };                
                worker.postMessage({
                    command: 'init',
                    config: {
                        sampleRate: data.sampleRate,
                        mp3LibPath: 'lame.all.js',
                        vorbisLibPath: 'libvorbis.module.min.js',
                        recordAsMP3: true,
                        recordAsOGG: false
                    }
                });
                worker.postMessage({
                    command: 'record',
                    buffer: [Uint8ArrayToFloat32Array(data.samples)]
                });
                worker.postMessage({
                    command: 'exportMP3'
                });



                /*
                var vbr_mode = {
                    vbr_off: 0,
                    vbr_mt: 1,               // obsolete, same as vbr_mtrh
                    vbr_rh: 2,
                    vbr_abr: 3,
                    vbr_mtrh: 4,
                    vbr_max_indicator: 5,    // Don't use this! It's used for sanity checks.      
                    vbr_default: 4 //=vbr_mtrh    // change this to change the default VBR mode of LAME 
                };

                var encoderWorker = new Worker('../lib/mp3Worker.js');
                encoderWorker.postMessage({ cmd: 'init', config:{
                    mode : data.numberOfChannels == 1 ? 3 : 0, // 3: Mono, 0: Stereo
                    channels: data.numberOfChannels,
                    samplerate: data.sampleRate,
                    //bitrate: data.bitsPerSample
                    bitrate: 128,
                    vbr: vbr_mode.vbr_mtrh
                }});

                encoderWorker.postMessage({ cmd: 'encode', buf: Uint8ArrayToFloat32Array(data.samples) });
                encoderWorker.postMessage({ cmd: 'finish'});
                encoderWorker.onmessage = function(e) {
                    if (e.data.cmd == 'data') {
                        console.log("Done converting to Mp3");
                        var finish = new Date();
                        console.log("finish: " + ((finish - start) * 0.001) + " secs.");
                        //log.innerHTML += "\n" + "Done converting to Mp3";
                        resolve(e.data.buf)();   
                    }
                };

                */
            }
        }
    }
}









