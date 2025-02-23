let frameTimeDiff = 0;
let lastFrameTime = 0;

let fps = 0;
let frames = 0;
let lastFpsTime = 0;

let fpsCap = 0;
let fpsCapDurationTime = 1000 / fpsCap;
let fpsCapLastFrameTime = 0;
let logicFrames = 0;

const $test = document.getElementById('test');

function updateLogic() {
	$test.innerText = `
		${fps} fps
		1x frame / ${(frameTimeDiff).toPrecision(3)} ms

		${fps > fpsCap ? 'Aplying fps cap:' : 'Not applying cap due to fps > fpsCap'}
		${fpsCap} fps
		1x frame / ${fpsCapDurationTime.toPrecision(3)} ms
		(render every ${logicFrames} frame)
	`;
}

function loop(now) {
	frames++;

	// Last frame time.
	if (lastFrameTime === 0) { lastFrameTime = now; }
	frameTimeDiff = now - lastFrameTime;
	lastFrameTime = now;

	if (fpsCapLastFrameTime === 0) { fpsCapLastFrameTime = now; }
	if (fpsCap > 0 && fps > fpsCap) {
		logicFrames++;
		if ((now - fpsCapLastFrameTime) >= fpsCapDurationTime) {
			fpsCapLastFrameTime = now;
			// frames++
			updateLogic();
			logicFrames = 0;
		}
	} else {
		// frames++
		updateLogic();
	}


	
	// Fps
	if (lastFpsTime === 0) { lastFpsTime = now; }
	if (now - lastFpsTime >= 1000) {
		fps = frames;
		frames = 0;
		lastFpsTime = now;
	}

	
	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);