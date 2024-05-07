/** @format */

// select immediate required HTML elements
const timePointsEl = document.querySelector(".time-points");
const controlBtnContainerEl = document.querySelector(".control-btns-container");
const startBtn = controlBtnContainerEl.querySelector("#start-btn");
const stopBtn = controlBtnContainerEl.querySelector("#stop-btn");
const resetBtn = controlBtnContainerEl.querySelector("#reset-btn");
let timeLogEls = document.getElementsByClassName("time-log");

const timeLogElementsObj = {};

// add click event listener to the control bitterness
for (const child of controlBtnContainerEl.children) {
	child.addEventListener("click", handleControlBtn);
}

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

		default:
			break;
	}
}

// create a new stopwatch class for an object who's job is to only track time and intervals
class StopWatch {
	startTime = 0;
	endTime = 0;
	watchState = {
		started: false,
		stopped: false,
		running: false,
		paused: false,
	};

	constructor() {}

	/* watch control methods */
	start(timeStamp) {
		/* confirm cases before implementation */
		if (!this.watchState.started) {
			this.startTime = timeStamp;
			// update all the state of the watch
			this.watchState.started = this.watchState.running = true;
			this.watchState.stopped = this.watchState.paused = false;

			return true;
		}
	}

	stop(timeStamp) {
		if (this.watchState.started) {
			this.endTime = timeStamp;
			// update all the state of the watch
			this.watchState.started = this.watchState.running = false;
			this.watchState.stopped = true;
			this.watchState.paused = false;

			return true;
		}
	}

	reset() {
		this.startTime = 0;
		this.endTime = 0;

		// reset watch state back to default
		for (const key in this.watchState) {
			if (Object.hasOwn(this.watchState, key)) {
				this.watchState[key] = false;
			}
		}
	}

	/* Time calculation methods */
	getElapsedTime() {
		let elapsedTime = this.endTime - this.startTime;
		if (elapsedTime < 0) {
			console.log(
				"Elapsed time less than zero, function called too early"
			);
		}

		return elapsedTime;
	}
}

// create the UI controller class for the stopWatch that updates the Domain
class StopWatchUI {
	elapsedTimeDuration = 0;
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
	}

	start(timeStamp) {
		// start the watch immediately and returns true if the watch really started
		if (this.stopWatch.start(timeStamp)) {
			this.stopWatchUI.logStateFeedback("Stopwatch started");
			// requestAnimationFrame will start a loop which synchronizes with the screen refresh rate. I'm using it in place of setInterval to avoid giving the CPU unnecessary load which might not be displayed by the browser
			this.animationFrameID = requestAnimationFrame(
				this.startAnimationLoop
			);
		} else {
			this.stopWatchUI.logStateFeedback("Stopwatch already started");
		}
	}

	stop(timeStamp) {
		if (this.stopWatch.stop(timeStamp)) {
			// stop recording time and the loop
			cancelAnimationFrame(this.animationFrameID);
			this.animationFrameID = null;

			// log feedback
			this.stopWatchUI.logStateFeedback("Stopwatch stopped");
			this.stopWatchUI.logElapsedTime(
				this.formatElapsedTime(this.stopWatch.getElapsedTime())
			);
		} else {
			this.stopWatchUI.logStateFeedback("Stopwatch not started");
		}
	}

	startAnimationLoop(timeStamp) {
		this.stopWatch.endTime = timeStamp;
		// log live time
		this.stopWatchUI.logElapsedTime(
			this.formatElapsedTime(this.stopWatch.getElapsedTime())
		);

		// repeat code block again and continue looping
		this.animationFrameID = requestAnimationFrame(this.startAnimationLoop);
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
