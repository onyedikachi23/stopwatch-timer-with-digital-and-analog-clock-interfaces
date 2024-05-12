/** @format */

// select immediate required HTML elements
const feedbackMessageEl = document.querySelector(".feedback-message");
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
			this.watchState.stopped = true;
			this.watchState.started = this.watchState.running = false;
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
		this.startTime =
			this.endTime =
			this.elapsedTimeDuration =
			this.startTimeAfterResume =
			this.endTimeAfterResume =
				0;

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
			this.endTime = timeStampOnCall;
			this.elapsedTimeDuration = this.endTime - this.startTime;
			if (this.elapsedTimeDuration < 0) {
				console.log(
					"Elapsed time less than zero, function called too early"
				);
			}
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

			if (this.elapsedTimeDuration < 0) {
				console.log(
					"Elapsed time less than zero, function called too early after resume"
				);
			}
		}
		return this.elapsedTimeDuration;
	}
}

// create the UI controller class for the stopWatch that updates the Domain
class StopWatchUI {
	constructor() {}

	/* methods to write to DOM */
	logStateFeedback(message) {
		feedbackMessageEl.textContent = message;
	}

	logElapsedTime(elapsedTimeObj) {
		// confirm which type of formatted timeValue the Element is to display.
		timeLogEls.milliSecLogEl.textContent = this.toThreeDigitsStr(
			elapsedTimeObj.elapsedMilliseconds
		);
		timeLogEls.secondsLogEl.textContent = this.toTwoDigitsStr(
			elapsedTimeObj.elapsedSeconds
		);
		timeLogEls.minutesLogEl.textContent = this.toTwoDigitsStr(
			elapsedTimeObj.elapsedMinutes
		);
		timeLogEls.hoursLogEl.textContent = this.toTwoDigitsStr(
			elapsedTimeObj.elapsedHours
		);
		timeLogEls.daysLogEl.textContent = this.toTwoDigitsStr(
			elapsedTimeObj.elapsedDays
		);
	}

	togglePauseBtnVisibility(visibility) {
		switch (visibility) {
			case "show": {
				// first create layout for it then show
				controlBtnContainerEl.className =
					"control-btns-container grid-4-items";
				pauseBtn.classList.remove("hide");
				break;
			}
			case "hide": {
				// first remove it, then return layout to default
				pauseBtn.classList.add("hide");
				controlBtnContainerEl.className = "control-btns-container";
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
				// first create layout for it then show
				controlBtnContainerEl.className =
					"control-btns-container grid-5-items";
				resumeBtn.classList.remove("hide");
				break;
			}
			case "hide": {
				// first remove it, then return layout to previous state
				resumeBtn.classList.add("hide");
				controlBtnContainerEl.className =
					"control-btns-container grid-4-items";
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

	// this method formats time values to 3 digits when necessary
	toThreeDigitsStr(number) {
		let numberStr = number.toString();

		switch (numberStr.length) {
			case 1: {
				numberStr = `00${numberStr}`;
				break;
			}

			case 2: {
				numberStr = `0${numberStr}`;
				break;
			}

			default: {
				break;
			}
		}

		return numberStr;
	}

	// this method formats time values to 2 digits when necessary
	toTwoDigitsStr(number) {
		let numberStr = number.toString();

		if (numberStr.length === 1) {
			numberStr = `0${numberStr}`;
		}

		return numberStr;
	}
}

// create a stopwatch state storage class to store updated state of the watch at every animation loop, so that the watch continues from where it stopped at the any page load

class StopWatchStateStorage {
	stateData = {
		startTime: 0,
		endTime: 0,
		elapsedTimeDuration: 0,
		startTimeAfterResume: 0,
		endTimeAfterResume: 0,
		watchState: {
			started: false,
			stopped: false,
			running: false,
			paused: false,
			resumed: false,
		},
		stateFeedbackMessage: "",
	};

	constructor() {}

	// method to update stopwatch storage
	updateStateData(stopWatchObj, feedbackMessage) {
		if (stopWatchObj !== undefined) {
			this.stateData.startTime = stopWatchObj.startTime;
			this.stateData.endTime = stopWatchObj.endTime;
			this.stateData.elapsedTimeDuration =
				stopWatchObj.elapsedTimeDuration;
			this.stateData.startTimeAfterResume =
				stopWatchObj.startTimeAfterResume;
			this.stateData.endTimeAfterResume = stopWatchObj.endTimeAfterResume;
			this.stateData.watchState = stopWatchObj.watchState;
		}
		if (feedbackMessage !== undefined) {
			this.stateData.stateFeedbackMessage = feedbackMessage;
		}

		// then save state
		this.save();
	}

	// method to convert state object to JSON string
	toJSONString(object) {
		return JSON.stringify(object);
	}

	// method to convert JSON string to JavaScript object
	jsonToObject(jsonString) {
		return JSON.parse(jsonString);
	}

	// method to save state object to storage
	save() {
		localStorage.setItem(
			"stopWatchState",
			this.toJSONString(this.stateData)
		);
	}

	// this method loads the state data from local storage into the state object
	load() {
		const jsonString = localStorage.getItem("stopWatchState");
		if (jsonString !== null) {
			this.stateData = this.jsonToObject(jsonString);

			return true;
		} else {
			return false;
		}
	}
}

// create a stopWatchController class to incorporate all interfaces of the stopWatch together
class StopwatchController {
	animationFrameID = 0;

	constructor() {
		this.stopWatch = new StopWatch();
		this.stopWatchUI = new StopWatchUI();
		this.stopWatchStateStorage = new StopWatchStateStorage();

		// to avoid misconception of the this keyword when used in a callback
		this.startAnimationLoop = this.startAnimationLoop.bind(this);
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
		this.pause = this.pause.bind(this);
		this.resume = this.resume.bind(this);
		this.loadAndResumeFromLocalStorage =
			this.loadAndResumeFromLocalStorage.bind(this);
	}

	start(timeStamp) {
		// start the watch immediately and returns true if the watch really started
		if (this.stopWatch.start(timeStamp)) {
			// requestAnimationFrame will start a loop which synchronizes with the screen refresh rate. I'm using it in place of setInterval to avoid giving the CPU unnecessary load which might not be displayed by the browser
			this.animationFrameID = requestAnimationFrame(
				this.startAnimationLoop
			);

			// enable pauseBtn
			this.stopWatchUI.togglePauseBtnVisibility("show");

			// log feedback and save updated state to stopwatch state storage
			const feedbackMessage = "Stopwatch started";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				this.stopWatch,
				feedbackMessage
			);
		} else {
			const feedbackMessage = "Stopwatch already started";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				undefined,
				feedbackMessage
			);
		}
	}

	stop(timeStamp) {
		if (this.stopWatch.stop()) {
			// stop recording time and the loop
			cancelAnimationFrame(this.animationFrameID);
			this.resetAnimationFrameID();

			// calculate duration and log it if stop was called at running
			if (this.stopWatch.watchState.running) {
				this.stopWatchUI.logElapsedTime(
					this.formatElapsedTime(
						this.stopWatch.getElapsedTime(timeStamp)
					)
				);
			}

			// disable resumeBtn then pauseBtn
			this.stopWatchUI.toggleResumeBtnVisibility("hide");
			this.stopWatchUI.togglePauseBtnVisibility("hide");

			// log feedback and save updated state to stopwatch state storage
			const feedbackMessage = "Stopwatch stopped";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				this.stopWatch,
				feedbackMessage
			);
		} else {
			const feedbackMessage = "Stopwatch not started";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				undefined,
				feedbackMessage
			);
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

			// disable resumeBtn then pauseBtn
			this.stopWatchUI.toggleResumeBtnVisibility("hide");
			this.stopWatchUI.togglePauseBtnVisibility("hide");

			// log state feedback and update state data
			const feedbackMessage = "Stopwatch resetted";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				this.stopWatch,
				feedbackMessage
			);
		} else {
			const feedbackMessage = "Something went wrong";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				this.stopWatch,
				feedbackMessage
			);
			console.log("StopWatch wasn't reset");
		}
	}

	pause() {
		// stop logging live time
		cancelAnimationFrame(this.animationFrameID);
		this.resetAnimationFrameID();

		// call the pause method of the stopwatch and feedback to the stopWatchUI
		if (this.stopWatch.pause()) {
			// enable the resumeBtn
			this.stopWatchUI.toggleResumeBtnVisibility("show");
			// log state feedback and update stopwatchStateStorage
			const feedbackMessage = "Stopwatch paused";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				this.stopWatch,
				feedbackMessage
			);
		} else {
			const feedbackMessage = "Stopwatch not running";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				this.stopWatch,
				feedbackMessage
			);
		}
	}

	resume(timeStamp) {
		if (this.stopWatch.resume(timeStamp)) {
			// start logging live time again
			requestAnimationFrame(this.startAnimationLoop);
			// disable the resumeBtn
			this.stopWatchUI.toggleResumeBtnVisibility("hide");

			// log state feedback and save state to State storage
			const feedbackMessage = "Stopwatch resumed";
			this.stopWatchUI.logStateFeedback(feedbackMessage);
			this.stopWatchStateStorage.updateStateData(
				this.stopWatch,
				feedbackMessage
			);
		}
	}

	startAnimationLoop(timeStamp) {
		// this.stopWatch.endTime = timeStamp; getElapsedTime() will handle this
		// log live time
		this.stopWatchUI.logElapsedTime(
			this.formatElapsedTime(this.stopWatch.getElapsedTime(timeStamp))
		);
		// update state data
		this.stopWatchStateStorage.updateStateData(this.stopWatch, undefined);

		// repeat code block again and continue looping
		this.animationFrameID = requestAnimationFrame(this.startAnimationLoop);
	}

	// this method resets animationFrameID back to a falsy value
	resetAnimationFrameID() {
		this.animationFrameID = null;
	}

	//this method loads the stopWatch previous state from the browser local storage and resumes it
	loadAndResumeFromLocalStorage(timeStamp) {
		// first load items from local storage to the stopWatch state storage object
		// this.stopWatchStateStorage.load() also confirms if stopWatchState key is in the Local Storage of the browser
		if (this.stopWatchStateStorage.load()) {
			// then load the state data into the stopWatch object
			const stopWatchObjProperties = Object.keys(this.stopWatch);
			for (let i = 0; i < stopWatchObjProperties.length; i++) {
				const property = stopWatchObjProperties[i];
				// if property exists in stopWatch assign it to the value
				if (Object.hasOwn(this.stopWatch, property)) {
					this.stopWatch[property] =
						this.stopWatchStateStorage.stateData[property];
				}
			}

			// so to resume stopwatch from where it stopped
			const isStarted =
				this.stopWatchStateStorage.stateData.watchState.started;
			const isRunning =
				this.stopWatchStateStorage.stateData.watchState.running;
			const isPaused =
				this.stopWatchStateStorage.stateData.watchState.paused;
			const isResumed =
				this.stopWatchStateStorage.stateData.watchState.resumed;
			const isStopped =
				this.stopWatchStateStorage.stateData.watchState.stopped;
			const elapsedTimeDuration =
				this.stopWatchStateStorage.stateData.elapsedTimeDuration;
			const startTime = this.stopWatchStateStorage.stateData.startTime;
			const endTime = this.stopWatchStateStorage.stateData.endTime;
			const feedbackMessage =
				this.stopWatchStateStorage.stateData.stateFeedbackMessage;

			if (isStarted) {
				// this code block should execute if started = true
				switch (true) {
					case isRunning: {
						// start logging live time from the elapsedTimeDuration
						this.stopWatch.watchState.resumed = true;
						this.stopWatch.startTimeAfterResume = timeStamp;
						this.animationFrameID = requestAnimationFrame(
							this.startAnimationLoop
						);
						// log feedbackMessage and enable pauseBtn
						this.stopWatchUI.logStateFeedback(feedbackMessage);
						this.stopWatchUI.togglePauseBtnVisibility("show");

						break;
					}

					case isPaused: {
						// make sure resumed is false so that getElapsedTime function doesn't cause problems
						this.stopWatch.watchState.resumed = false;
						// log previous time duration and feedback message
						this.stopWatchUI.logElapsedTime(
							this.formatElapsedTime(
								this.stopWatch.getElapsedTime(endTime)
							) //used endTime as timestamp parameter for getElapsedTime because it always needs a timestamp value to set to stopwatch.endTime
						);
						this.stopWatchUI.logStateFeedback(feedbackMessage);
						// enable pauseBtn first then resumeBtn
						this.stopWatchUI.togglePauseBtnVisibility("show");
						this.stopWatchUI.toggleResumeBtnVisibility("show");

						break;
					}
					case value: {
						break;
					}

					default:
						break;
				}
			} else if (isStopped) {
				// make sure resumed is false so that getElapsedTime function doesn't cause problems
				this.stopWatch.watchState.resumed = false;
				// log previous time duration and feedback message
				this.stopWatchUI.logElapsedTime(
					this.formatElapsedTime(
						this.stopWatch.getElapsedTime(endTime)
					) //used endTime as timestamp parameter for getElapsedTime because it always needs a timestamp value to set to stopwatch.endTime
				);
				this.stopWatchUI.logStateFeedback(feedbackMessage);
				// disable resumeBtn then pauseBtn
				this.stopWatchUI.toggleResumeBtnVisibility("hide");
				this.stopWatchUI.togglePauseBtnVisibility("hide");
			}
		}
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
// load the stopwatch state from previous session if it exists in LocalStorage
requestAnimationFrame(stopWatchController.loadAndResumeFromLocalStorage);
