//importScripts('libmp3lame.js');
//importScripts('libmp3lame.min.js');
importScripts('libmp3lame.min.prettified.js');

var mp3codec;

var channels;

self.onmessage = function(e) {
	switch (e.data.cmd) {
	case 'init':
		if (!e.data.config) {
			e.data.config = { };
		}
		mp3codec = Lame.init();

		//var mode       = typeof e.data.config.mode       !== "undefined" ? e.data.config.mode       : Lame.JOINT_STEREO;
		var mode       = Lame.JOINT_STEREO;
		channels   = typeof e.data.config.channels   !== "undefined" ? e.data.config.channels   : 2;
		var samples    = typeof e.data.config.samples    !== "undefined" ? e.data.config.samples    : -1;
		var samplerate = typeof e.data.config.samplerate !== "undefined" ? e.data.config.samplerate : 44100;
		var bitrate    = typeof e.data.config.bitrate    !== "undefined" ? e.data.config.bitrate    : 128;

		Lame.set_mode(mp3codec, mode);
		Lame.set_num_channels(mp3codec, channels);
		Lame.set_num_samples(mp3codec, samples);
		Lame.set_in_samplerate(mp3codec, samplerate);
		Lame.set_out_samplerate(mp3codec, samplerate);
		Lame.set_bitrate(mp3codec, bitrate);
		
		//Lame.set_VBR(mp3codec, e.data.config.vbr || 0);
		//Lame.set_VBR_max_bitrate_kbps();
		//Lame.set_VBR_mean_bitrate_kbps();
		//Lame.set_VBR_min_bitrate_kbps();
		//Lame.set_VBR_q();

		Lame.init_params(mp3codec);
		console.log('Version :', Lame.get_version() + ' / ',
			'Mode: '+Lame.get_mode(mp3codec) + ' / ',
			'Samples: '+Lame.get_num_samples(mp3codec) + ' / ',
			'Channels: '+Lame.get_num_channels(mp3codec) + ' / ',
			'Input Samplate: '+ Lame.get_in_samplerate(mp3codec) + ' / ',
			'Output Samplate: '+ Lame.get_in_samplerate(mp3codec) + ' / ',
			'Bitlate :' +Lame.get_bitrate(mp3codec) + ' / '

			//,'VBR :' + Lame.get_VBR(mp3codec)

			);
		break;
	case 'encode':
		var mp3data;
		if(channels === 1){
			mp3data = Lame.encode_buffer_ieee_float(mp3codec, e.data.buf, e.data.buf);
		}else if(channels === 2){
			var buffer = e.data.buf; 
			var length = buffer.length / 2;
			var lefts = new Float32Array(length);
			var rights = new Float32Array(length);
			for(var i = 0; i < length; i++){
				lefts[i] = buffer[2 * i + 0];
				rights[i] = buffer[2 * i + 1];
			}
			mp3data = Lame.encode_buffer_ieee_float(mp3codec, lefts, rights);
		}else{
			throw new Error();
		}
		self.postMessage({cmd: 'data', buf: mp3data.data});
		break;
	case 'finish':
		var mp3data = Lame.encode_flush(mp3codec);
		self.postMessage({cmd: 'end', buf: mp3data.data});
		Lame.close(mp3codec);
		mp3codec = null;
		break;
	}
};