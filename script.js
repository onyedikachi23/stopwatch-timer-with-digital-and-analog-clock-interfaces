/** @format */

// select immediate required HTML elements
const feedbackMessageEl = document.querySelector(".feedback-message");
const controlBtnContainerEl = document.querySelector(".control-btns-container");
const startBtn = controlBtnContainerEl.querySelector("#start-btn");
const stopBtn = controlBtnContainerEl.querySelector("#stop-btn");
const resetBtn = controlBtnContainerEl.querySelector("#reset-btn");
const pauseBtn = controlBtnContainerEl.querySelector("#pause-btn");
const resumeBtn = controlBtnContainerEl.querySelector("#resume-btn");
const analogClockEl = document.querySelector(".circular-clock");
const clockHourHandEl = analogClockEl.querySelector("#hour-hand");
const clockMinuteHandEl = analogClockEl.querySelector("#minute-hand");
const clockSecondHandEl = analogClockEl.querySelector("#second-hand");
const backgroundMusicEl = document.querySelector("#background-music");
let timeLogEls = document.getElementsByClassName("time-log");

// reduce the audio volume for the background music
backgroundMusicEl.volume = 0.5;

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

/* analog stopwatch UI */
class AnalogStopwatchUI {
	secondAngle = 0;
	minuteAngle = 0;
	hourAngle = 0;
	constructor() {}

	updateHandlesAngles(formattedTimeValues, elapsedTimeDurationInMS) {
		this.secondAngle = formattedTimeValues.elapsedSeconds * 6;
		this.minuteAngle = formattedTimeValues.elapsedMinutes * 6;
		this.hourAngle =
			this.getElapsedHoursWithOneDecimalPlace(elapsedTimeDurationInMS) *
			30;

		// apply transformations to the clock handles using the calculated values
		clockSecondHandEl.style.transform = `translate(-50%, -80%) rotate(${this.secondAngle}deg)`;
		clockMinuteHandEl.style.transform = `translate(-50%, -100%) rotate(${this.minuteAngle}deg)`;
		clockHourHandEl.style.transform = `translate(-50%, -100%) rotate(${this.hourAngle}deg)`;
	}

	// reset rotation of clock handles to 0 deg
	resetClockHandles() {
		this.secondAngle = 0;
		this.minuteAngle = 0;
		this.hourAngle = 0;

		// apply transformations to the clock handles using the calculated values
		clockSecondHandEl.style.transform = `translate(-50%, -80%) rotate(${this.secondAngle}deg)`;
		clockMinuteHandEl.style.transform = `translate(-50%, -100%) rotate(${this.minuteAngle}deg)`;
		clockHourHandEl.style.transform = `translate(-50%, -100%) rotate(${this.hourAngle}deg)`;
	}

	// this method gets the elapsed hours in one decimal place without rounding or approximating
	getElapsedHoursWithOneDecimalPlace(timeinMS) {
		const oneDayInMS = 24 * 60 * 60 * 1000;
		const oneHourInMS = 60 * 60 * 1000;

		// Take the remainder in elaspedDays and divide by oneHourInMS to get elapsedHours
		let elapsedHours = `${(timeinMS % oneDayInMS) / oneHourInMS}`;

		// set to one decimal place
		const twoOrMoreDecimalPlacesRegex = /\.\d{2,}/;
		if (twoOrMoreDecimalPlacesRegex.test(elapsedHours)) {
			let matchedStr = elapsedHours.match(twoOrMoreDecimalPlacesRegex)[0];
			matchedStr = matchedStr.slice(0, 2);
			elapsedHours = elapsedHours.replace(
				twoOrMoreDecimalPlacesRegex,
				matchedStr
			);
		}

		return elapsedHours;
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
		secondAngle: 0,
		minuteAngle: 0,
		hourAngle: 0,
		backgroundMusicProgress: 0,
	};

	constructor() {}

	// method to update stopwatch storage
	updateStateData(stateObj) {
		if (Boolean(stateObj.stopWatchObj)) {
			this.stateData.startTime = stateObj.stopWatchObj.startTime;
			this.stateData.endTime = stateObj.stopWatchObj.endTime;
			this.stateData.elapsedTimeDuration =
				stateObj.stopWatchObj.elapsedTimeDuration;
			this.stateData.startTimeAfterResume =
				stateObj.stopWatchObj.startTimeAfterResume;
			this.stateData.endTimeAfterResume =
				stateObj.stopWatchObj.endTimeAfterResume;
			this.stateData.watchState = stateObj.stopWatchObj.watchState;
		}
		if (Boolean(stateObj.stopWatchAnalogUI)) {
			this.stateData.secondAngle = stateObj.stopWatchAnalogUI.secondAngle;
			this.stateData.minuteAngle = stateObj.stopWatchAnalogUI.minuteAngle;
			this.stateData.hourAngle = stateObj.stopWatchAnalogUI.hourAngle;
		}
		if (Boolean(stateObj.feedbackMessage)) {
			this.stateData.stateFeedbackMessage = stateObj.feedbackMessage;
		}
		if (Boolean(stateObj.backgroundMusicProgress)) {
			this.stateData.backgroundMusicProgress =
				stateObj.backgroundMusicProgress;
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
		this.stopWatchAnalogUI = new AnalogStopwatchUI();
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

			const stateObj = {
				stopWatchObj: this.stopWatch,
				stopWatchAnalogUI: this.stopWatchAnalogUI,
				feedbackMessage: feedbackMessage,
				backgroundMusicProgress: 0,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);

			// play background music from start
			backgroundMusicEl.currentTime = 0;
			backgroundMusicEl.play();
		} else {
			const feedbackMessage = "Stopwatch already started";
			this.stopWatchUI.logStateFeedback(feedbackMessage);

			const stateObj = {
				feedbackMessage: feedbackMessage,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);
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

			const stateObj = {
				stopWatchObj: this.stopWatch,
				stopWatchAnalogUI: this.stopWatchAnalogUI,
				feedbackMessage: feedbackMessage,
				backgroundMusicProgress: backgroundMusicEl.currentTime,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);

			// pause background music
			backgroundMusicEl.pause();
		} else {
			const feedbackMessage = "Stopwatch not started";
			this.stopWatchUI.logStateFeedback(feedbackMessage);

			const stateObj = {
				feedbackMessage: feedbackMessage,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);
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

			// return clock handles to 0 deg rotation
			this.stopWatchAnalogUI.resetClockHandles();

			// disable resumeBtn then pauseBtn
			this.stopWatchUI.toggleResumeBtnVisibility("hide");
			this.stopWatchUI.togglePauseBtnVisibility("hide");

			// log state feedback and update state data
			const feedbackMessage = "Stopwatch resetted";
			this.stopWatchUI.logStateFeedback(feedbackMessage);

			const stateObj = {
				stopWatchObj: this.stopWatch,
				stopWatchAnalogUI: this.stopWatchAnalogUI,
				feedbackMessage: feedbackMessage,
				backgroundMusicProgress: 0,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);

			// pause and reset background music
			backgroundMusicEl.pause();
			backgroundMusicEl.currentTime = 0;
		} else {
			const feedbackMessage = "Something went wrong";
			this.stopWatchUI.logStateFeedback(feedbackMessage);

			const stateObj = {
				feedbackMessage: feedbackMessage,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);
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

			const stateObj = {
				stopWatchObj: this.stopWatch,
				stopWatchAnalogUI: this.stopWatchAnalogUI,
				feedbackMessage: feedbackMessage,
				backgroundMusicProgress: backgroundMusicEl.currentTime,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);

			// pause background music
			backgroundMusicEl.pause();
		} else {
			const feedbackMessage = "Stopwatch not running";
			this.stopWatchUI.logStateFeedback(feedbackMessage);

			const stateObj = {
				stopWatchObj: this.stopWatch,
				stopWatchAnalogUI: this.stopWatchAnalogUI,
				feedbackMessage: feedbackMessage,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);
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

			const stateObj = {
				stopWatchObj: this.stopWatch,
				stopWatchAnalogUI: this.stopWatchAnalogUI,
				feedbackMessage: feedbackMessage,
			};
			this.stopWatchStateStorage.updateStateData(stateObj);

			// resume background music
			backgroundMusicEl.play();
		}
	}

	startAnimationLoop(timeStamp) {
		// this.stopWatch.endTime = timeStamp; getElapsedTime() will handle this
		const elapsedTimeDurationInMS =
			this.stopWatch.getElapsedTime(timeStamp);
		const formattedTimeValues = this.formatElapsedTime(
			elapsedTimeDurationInMS
		);
		// log live time
		this.stopWatchUI.logElapsedTime(formattedTimeValues);

		// update analog clock handles
		this.stopWatchAnalogUI.updateHandlesAngles(
			formattedTimeValues,
			elapsedTimeDurationInMS
		);

		// update state data
		const stateObj = {
			stopWatchObj: this.stopWatch,
			stopWatchAnalogUI: this.stopWatchAnalogUI,
			backgroundMusicProgress: backgroundMusicEl.currentTime,
		};
		this.stopWatchStateStorage.updateStateData(stateObj);

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
				// if property exists in stopWatch, assign it to the value
				if (Object.hasOwn(this.stopWatch, property)) {
					this.stopWatch[property] =
						this.stopWatchStateStorage.stateData[property];
				}
			}
			// also load needed state data into stopWatchAnalogUI object
			const stopWatchAnalogUIProperties = Object.keys(
				this.stopWatchAnalogUI
			);
			for (let i = 0; i < stopWatchAnalogUIProperties.length; i++) {
				const property = stopWatchAnalogUIProperties[i];
				// if property exists in stopWatchAnalogUI, assign it to the value
				if (Object.hasOwn(this.stopWatchAnalogUI, property)) {
					this.stopWatchAnalogUI[property] =
						this.stopWatchStateStorage.stateData[property];
				}
			}
			// then set background music playback progress from state data
			backgroundMusicEl.currentTime =
                        this.stopWatchStateStorage.stateData.backgroundMusicProgress;

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

						// play background music
						backgroundMusicEl.play();

						break;
					}

					case isPaused: {
						// make sure resumed is false so that getElapsedTime function doesn't cause problems
						this.stopWatch.watchState.resumed = false;

						const elapsedTimeDurationInMS =
							this.stopWatch.getElapsedTime(endTime); //used endTime as timestamp parameter for getElapsedTime because it always needs a timestamp value to set to stopwatch.endTime
						const formattedTimeValues = this.formatElapsedTime(
							elapsedTimeDurationInMS
						);
						// log previous time duration
						this.stopWatchUI.logElapsedTime(formattedTimeValues);

						// update analog clock handles
						this.stopWatchAnalogUI.updateHandlesAngles(
							formattedTimeValues,
							elapsedTimeDurationInMS
						);

						// feedback message
						this.stopWatchUI.logStateFeedback(feedbackMessage);
						// enable pauseBtn first then resumeBtn
						this.stopWatchUI.togglePauseBtnVisibility("show");
						this.stopWatchUI.toggleResumeBtnVisibility("show");

						// pause background music
						backgroundMusicEl.pause();

						break;
					}

					default:
						break;
				}
			} else if (isStopped) {
				// make sure resumed is false so that getElapsedTime function doesn't cause problems
				this.stopWatch.watchState.resumed = false;

				const elapsedTimeDurationInMS =
					this.stopWatch.getElapsedTime(endTime); //used endTime as timestamp parameter for getElapsedTime because it always needs a timestamp value to set to stopwatch.endTime
				const formattedTimeValues = this.formatElapsedTime(
					elapsedTimeDurationInMS
				);
				// log previous time duration
				this.stopWatchUI.logElapsedTime(formattedTimeValues);

				// update analog clock handles
				this.stopWatchAnalogUI.updateHandlesAngles(
					formattedTimeValues,
					elapsedTimeDurationInMS
				);

				// feedback message
				this.stopWatchUI.logStateFeedback(feedbackMessage);
				// disable resumeBtn then pauseBtn
				this.stopWatchUI.toggleResumeBtnVisibility("hide");
				this.stopWatchUI.togglePauseBtnVisibility("hide");

				// pause background music
				backgroundMusicEl.pause();
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
