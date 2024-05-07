/** @format */

// select immediate required HTML elements
const timePointsEl = document.querySelector(".time-points");
const controlBtnContainerEl = document.querySelector(".control-btns-container");
const startBtn = controlBtnContainerEl.querySelector("#start-btn");
const stopBtn = controlBtnContainerEl.querySelector("#stop-btn");
const resetBtn = controlBtnContainerEl.querySelector("#reset-btn");
const pauseBtn = controlBtnContainerEl.querySelector("#pause-btn");
const resumeBtn = controlBtnContainerEl.querySelector("#resume-btn");
let timeLogEls = document.getElementsByClassName("time-log");

// add click event listener to the control bitterness
for (const child of controlBtnContainerEl.children) {
	child.addEventListener("click", handleControlBtn);
}

const timeLogElementsObj = {};
// organise timelog elements to the time value they display
for (let i = 0; i < timeLogEls.length; i++) {
	const element = timeLogEls[i];

	// confirm the current element and add appropriate title
	switch (element.id) {
		case "elapsedMilliseconds": {
			timeLogElementsObj.milliSecLogEl = element;
			break;
		}

		case "elapsedSeconds": {
			timeLogElementsObj.secondsLogEl = element;
			break;
		}

		case "elapsedMinutes": {
			timeLogElementsObj.minutesLogEl = element;
			break;
		}

		case "elapsedHours": {
			timeLogElementsObj.hoursLogEl = element;
			break;
		}

		case "elapsedDays": {
			timeLogElementsObj.daysLogEl = element;
			break;
		}

		default:
			console.log("No element matched for displaying time logs");
			break;
	}
}
timeLogEls = timeLogElementsObj;

function handleControlBtn(event) {
	const Btn = event.currentTarget;

	// check which btn was clicked
	switch (Btn.id) {
		case "start-btn": {
			// used the requestAnim... function to call the Watch's start function so that an initial timeStamp for startTime is passed immediately at clicking the startBtn and a repaint is done smoothly.
			requestAnimationFrame(stopWatchController.start);
			break;
		}

		case "stop-btn": {
			// used the requestAnim... function to call the watch's stop function so that the timeStamp at clicking the stopBtn is passed immediately
			requestAnimationFrame(stopWatchController.stop);
			break;
		}

		case "reset-btn": {
			stopWatchController.reset();
			break;
		}

		case "pause-btn": {
			// used the requestAnim... function to call the watch's pause function so that the timeStamp at clicking the pauseBtn is passed immediately
			requestAnimationFrame(stopWatchController.pause);
			break;
		}

		case "resume-btn": {
			requestAnimationFrame(stopWatchController.resume);
			break;
		}

		default:
			break;
	}
}

// create a new stopwatch class for an object who's job is to only track time and intervals
class StopWatch {
	startTime = 0;
	endTime = 0;
	elapsedTimeDuration = 0;
	startTimeAfterResume = 0;
	endTimeAfterResume = 0;
	watchState = {
		started: false,
		stopped: false,
		running: false,
		paused: false,
		resumed: false,
	};

	constructor() {}

	/* watch control methods */
	start(timeStamp) {
		/* confirm cases before implementation */
		if (!this.watchState.started) {
			this.startTime = timeStamp;
			// update all the state of the watch
			this.watchState.started = this.watchState.running = true;
			this.watchState.stopped =
				this.watchState.paused =
				this.watchState.resumed =
					false;

			return true;
		}
	}

	stop() {
		if (this.watchState.started && !this.watchState.paused) {
			// this.endTime = timeStamp; getElapsedTime() will handle this
			// update all the state of the watch
			this.watchState.started = this.watchState.running = false;
			this.watchState.stopped = true;
			this.watchState.paused = false;

			return true;
		} else if (this.watchState.started && this.watchState.paused) {
			// update all the state of the watch
			this.watchState.stopped = true;
			this.watchState.started = this.watchState.running = false;
			this.watchState.paused = this.watchState.resumed = false;

			return true;
		}
	}

	reset() {
		this.startTime = this.endTime = this.elapsedTimeDuration = 0;

		// reset watch state back to default
		for (const key in this.watchState) {
			if (Object.hasOwn(this.watchState, key)) {
				this.watchState[key] = false;
			}
		}

		return true;
	}

	pause() {
		// watch should be paused if it's running and not already paused.
		if (this.watchState.running) {
			// this.endTime = timeStamp; getElapsedTime() will handle this

			// update the state of the watch
			this.watchState.running = this.watchState.resumed = false;
			this.watchState.paused = true;

			return true;
		}
	}

	resume(timeStamp) {
		console.log(this.elapsedTimeDuration);

		if (this.watchState.paused) {
			this.startTimeAfterResume = timeStamp;

			// update the state of the watch
			this.watchState.running = this.watchState.resumed = true;
			this.watchState.paused = false;

			return true;
		}
	}

	/* Time calculation methods */
	getElapsedTime(timeStampOnCall) {
		// if called after stopwatch was resumed, calculation would be entirely different
		if (!this.watchState.resumed) {
			console.log(timeStampOnCall);
			this.endTime = timeStampOnCall;
			this.elapsedTimeDuration = this.endTime - this.startTime;
			console.log(this.elapsedTimeDuration);
			if (this.elapsedTimeDuration < 0) {
				console.log(
					"Elapsed time less than zero, function called too early"
				);
			}

			return this.elapsedTimeDuration;
		} else {
			this.endTimeAfterResume = timeStampOnCall;

			// calculate elapsed time since resume and add to the main endTime
			const elapsedTimeSinceResume =
				this.endTimeAfterResume - this.startTimeAfterResume;
			this.endTime += elapsedTimeSinceResume;

			// Reset startTimeAfterResume to the current time so that next pause and resume will calculate correctly
			this.startTimeAfterResume = this.endTimeAfterResume;

			// calculate elapsed time since the watch saturated
			this.elapsedTimeDuration = this.endTime - this.startTime;
			console.log(this.startTime);

			if (this.elapsedTimeDuration < 0) {
				console.log(
					"Elapsed time less than zero, function called too early after resume"
				);
			}

			return this.elapsedTimeDuration;
		}
	}
}

// create the UI controller class for the stopWatch that updates the Domain
class StopWatchUI {
	constructor() {}

	/* methods to write to DOM */
	logStateFeedback(message) {
		timePointsEl.textContent = message;
	}

	logElapsedTime(elapsedTimeObj) {
		// confirm which type of formatted timeValue the Element is to display.
		timeLogEls.milliSecLogEl.textContent =
			elapsedTimeObj.elapsedMilliseconds;
		timeLogEls.secondsLogEl.textContent = elapsedTimeObj.elapsedSeconds;
		timeLogEls.minutesLogEl.textContent = elapsedTimeObj.elapsedMinutes;
		timeLogEls.hoursLogEl.textContent = elapsedTimeObj.elapsedHours;
		timeLogEls.daysLogEl.textContent = elapsedTimeObj.elapsedDays;
	}

	togglePauseBtnVisibility(visibility) {
		switch (visibility) {
			case "show": {
				pauseBtn.classList.remove("hide");
				break;
			}
			case "hide": {
				pauseBtn.classList.add("hide");
				break;
			}

			default: {
				console.log(
					"togglePauseBtnVisibility function called with invalid command"
				);
				break;
			}
		}
	}

	toggleResumeBtnVisibility(visibility) {
		switch (visibility) {
			case "show": {
				resumeBtn.classList.remove("hide");
				break;
			}
			case "hide": {
				resumeBtn.classList.add("hide");
				break;
			}

			default: {
				console.log(
					"toggleResumeBtnVisibility function called with invalid command"
				);
				break;
			}
		}
	}
}

// create a stopWatchController class to incorporate all interfaces of the stopWatch together
class StopwatchController {
	animationFrameID = 0;

	constructor() {
		this.stopWatch = new StopWatch();
		this.stopWatchUI = new StopWatchUI();

		// to avoid misconception of the this keyword when used in a callback
		this.startAnimationLoop = this.startAnimationLoop.bind(this);
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
		this.pause = this.pause.bind(this);
		this.resume = this.resume.bind(this);
	}

	start(timeStamp) {
		// start the watch immediately and returns true if the watch really started
		if (this.stopWatch.start(timeStamp)) {
			this.stopWatchUI.logStateFeedback("Stopwatch started");
			// requestAnimationFrame will start a loop which synchronizes with the screen refresh rate. I'm using it in place of setInterval to avoid giving the CPU unnecessary load which might not be displayed by the browser
			this.animationFrameID = requestAnimationFrame(
				this.startAnimationLoop
			);

			// enable pauseBtn
			this.stopWatchUI.togglePauseBtnVisibility("show");
		} else {
			this.stopWatchUI.logStateFeedback("Stopwatch already started");
		}
	}

	stop(timeStamp) {
		if (this.stopWatch.stop()) {
			// stop recording time and the loop
			cancelAnimationFrame(this.animationFrameID);
			this.resetAnimationFrameID();

			// log feedback
			this.stopWatchUI.logStateFeedback("Stopwatch stopped");
			this.stopWatchUI.logElapsedTime(
				this.formatElapsedTime(this.stopWatch.getElapsedTime(timeStamp))
			);

			// disable pauseBtn and resumeBtn
			this.stopWatchUI.togglePauseBtnVisibility("hide");
			this.stopWatchUI.toggleResumeBtnVisibility("hide");
		} else {
			this.stopWatchUI.logStateFeedback("Stopwatch not started");
		}
	}

	reset() {
		// stopping logging live time
		cancelAnimationFrame(this.animationFrameID);
		this.resetAnimationFrameID();

		// call the reset method of the stopwatch Obj and implement the reset
		if (this.stopWatch.reset()) {
			// clear all timeValues
			this.stopWatchUI.logElapsedTime(
				this.formatElapsedTime(this.stopWatch.getElapsedTime(0))
			);
			this.stopWatchUI.logStateFeedback("Stopwatch resetted");

			// disable pauseBtn and resumeBtn
			this.stopWatchUI.togglePauseBtnVisibility("hide");
			this.stopWatchUI.toggleResumeBtnVisibility("hide");
		} else {
			this.stopWatchUI.logStateFeedback("Stopwatch couldn't reset");
		}
	}

	pause(timeStamp) {
		// stop logging live time
		cancelAnimationFrame(this.animationFrameID);
		this.resetAnimationFrameID();

		// call the pause method of the stopwatch and feedback to the stopWatchUI
		if (this.stopWatch.pause()) {
			// log elapsed time at call of pause
			this.stopWatchUI.logElapsedTime(
				this.formatElapsedTime(this.stopWatch.getElapsedTime(timeStamp))
			);
			this.stopWatchUI.logStateFeedback("Stopwatch paused");

			// enable the resumeBtn
			this.stopWatchUI.toggleResumeBtnVisibility("show");
		}
	}

	resume(timeStamp) {
		if (this.stopWatch.resume(timeStamp)) {
			// start logging live time again
			requestAnimationFrame(this.startAnimationLoop);
		}
	}

	startAnimationLoop(timeStamp) {
		if (!this.stopWatch.watchState.resumed) {
			// this.stopWatch.endTime = timeStamp; getElapsedTime() will handle this
			// log live time
			this.stopWatchUI.logElapsedTime(
				this.formatElapsedTime(this.stopWatch.getElapsedTime(timeStamp))
			);
		} else if (this.animationFrameID) {
			console.log("matched");
			// the set animationFrameID will always be a falsy value after a paused state
			// if the stopwatch was just resumed from a previous paused state, then the calculation of the elapsedTimeDuration would be different
			// continue logging live time
			this.stopWatchUI.logElapsedTime(
				this.formatElapsedTime(this.stopWatch.getElapsedTime(timeStamp))
			);
		}

		// repeat code block again and continue looping
		this.animationFrameID = requestAnimationFrame(this.startAnimationLoop);
	}

	// this method resets animationFrameID back to a falsy value
	resetAnimationFrameID() {
		this.animationFrameID = null;
	}

	/* timeValuesFormatter */
	// this method will format the milliseconds according to hour, minute, second, miilliseconds
	formatElapsedTime = function (timeinMS) {
		// 1s = 1000ms
		// 1m = 60s
		// 1hr = 60m
		// 1d = 24hr
		// values in milliseconds
		const oneDayInMS = 24 * 60 * 60 * 1000;
		const oneHourInMS = 60 * 60 * 1000;
		const oneMinuteInMS = 60 * 1000;
		const oneSecondInMS = 1000;

		/* Calculate elapsed time */
		let elapsedDays = timeinMS / oneDayInMS;
		elapsedDays = Math.floor(elapsedDays);

		// Take the remainder in elaspedDays and divide by oneHourInMS to get elapsedHours
		let elapsedHours = (timeinMS % oneDayInMS) / oneHourInMS;
		elapsedHours = Math.floor(elapsedHours);

		// Do the same for elapsedMinutes
		let elapsedMinutes = (timeinMS % oneHourInMS) / oneMinuteInMS;
		elapsedMinutes = Math.floor(elapsedMinutes);

		// Do the same for elapsedSeconds
		let elapsedSeconds = (timeinMS % oneMinuteInMS) / oneSecondInMS;
		elapsedSeconds = Math.floor(elapsedSeconds);

		// Do the same for elapsed milliseconds
		let elapsedMilliseconds = timeinMS % oneSecondInMS;
		elapsedMilliseconds = Math.floor(elapsedMilliseconds);

		// Add all values to an array
		const timeValues = {
			elapsedDays,
			elapsedHours,
			elapsedMinutes,
			elapsedSeconds,
			elapsedMilliseconds,
		};
		return timeValues;
	};
}

const stopWatchController = new StopwatchController();
