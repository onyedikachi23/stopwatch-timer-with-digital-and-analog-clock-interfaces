/** @format */

const timePointsEl = document.querySelector(".time-points");
const controlBtnContainerEl = document.querySelector(".control-btns-container");
const startBtn = controlBtnContainerEl.querySelector("#start-btn");
const stopBtn = controlBtnContainerEl.querySelector("#stop-btn");
const resetBtn = controlBtnContainerEl.querySelector("#reset-btn");
const timeLogsContainerEl = document.querySelector(".time-log-container");
const timeLogEls = timeLogsContainerEl.getElementsByClassName("time-log");

// add click event listener to the control bitterness
for (const child of controlBtnContainerEl.children) {
	child.addEventListener("click", handleControlBtn);
}

// createStopWatch template class
class createStopWatch {
	// set private properties
	startTime = 0;
	endTime = 0;
	timeDuration = 0;
	#timeID = 0;
	watchState = {
		started: false,
		stopped: false,
		running: false,
		paused: false,
	};

	// stopWatch own properties
	constructor() {}

	// watch control methods
	startWatch = function () {
		let feedbackObj;
		if (!this.watchState.running) {
			this.startTime = performance.now();
			// log live time
			this.#timeID = setInterval(() => {
				this.endTime = performance.now();

				this.watchFeedback(
					"duration",
					this.formatElapsedTime(this.calculateTimeDuration())
				);
				console.log("started");
			}, 1);
			this.watchState.started = this.watchState.running = true;

			// log state feedback
			this.watchFeedback("state", "Stopwatch started");
		} else {
			this.watchFeedback("state", "Stopwatch already running");
		}
	};

	stopWatchRunning = function () {
		this.endTime = performance.now();
		switch (true) {
			case this.watchState.running === true: {
				// stop logging live time
				clearInterval(this.#timeID);

				this.watchFeedback(
					"duration",
					this.formatElapsedTime(this.calculateTimeDuration())
				);
				this.watchState.started = this.watchState.running = false;
				this.watchState.stopped = true;

				// log state feedback
				this.watchFeedback("state", "Stopwatch ended");

				break;
			}

			case this.watchState.paused === true: {
				this.watchState.started = this.watchState.running = false;
				this.watchState.stopped = true;
				this.watchState.paused = false;

				// log state feedback
				this.watchFeedback("state", "Stopwatch ended");

				break;
			}

			case this.watchState.stopped === true: {
				this.watchFeedback("state", "Stopwatch already stopped");
				break;
			}

			default: {
				this.watchFeedback("state", "Stopwatch not started");
				break;
			}
		}
	};

	pauseRunning = function () {
		this.endTime = performance.now();
		if (this.watchState.running) {
			// stop logging live time
			clearInterval(this.#timeID);

			this.watchFeedback(
				"duration",
				this.formatElapsedTime(this.calculateTimeDuration())
			);
			this.watchState.running = false;
			this.watchState.paused = true;

			// log state feedback
			this.watchFeedback("state", "Stopwatch ended paused");
		} else if (this.watchState.stopped) {
			this.watchFeedback("state", "Stopwatch already stopped");
		} else {
			this.watchFeedback("state", "Stopwatch not running");
		}
	};

	reset = function () {
		// stop logging live time
		if (this.watchState.running) {
			clearInterval(this.#timeID);
		}

		this.startTime = 0;
		this.endTime = 0;
		this.timeDuration = 0;

		// reset watch state back to default
		for (const key in this.watchState) {
			if (Object.hasOwn(this.watchState, key)) {
				this.watchState[key] = false;
			}
		}

		// remove any state or duration feedbacks and log resetted
		this.watchFeedback("state", "");
		this.watchFeedback("duration", Array(5).fill(""));
		this.watchFeedback("state", "Stopwatch resetted");
	};

	watchFeedback = function (feedbackType, value) {
		switch (feedbackType) {
			case "state": {
				timePointsEl.innerText = value;
				break;
			}

			case "duration": {
				if (typeof value === "string") {
					timeLogsContainerEl.innerText = value;
				} else if (typeof value === "object") {
					console.log("fed");
					// add the formatted elapsed time to their respective log elements
					for (let i = 0; i < timeLogEls.length; i++) {
						console.log(`fed ${i}`);
						const element = timeLogEls[i];
						const timeValue = value[i];

						element.innerText = timeValue;
						console.log(element);
						console.log(timeValue);
					}
				} else {
					console.log("error");
				}
				break;
			}

			default:
				break;
		}
	};

	calculateTimeDuration = function () {
		this.timeDuration = this.endTime - this.startTime;
		return this.timeDuration;
	};

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
		const timeValues = [
			elapsedDays,
			elapsedHours,
			elapsedMinutes,
			elapsedSeconds,
			elapsedMilliseconds,
		];
		return timeValues;
	};
}

stopWatch = new createStopWatch();

// handle btn control function
function handleControlBtn(event) {
	const Btn = event.currentTarget;

	// check which btn was clicked
	switch (Btn.id) {
		case "start-btn": {
			stopWatch.startWatch();
			break;
		}

		case "stop-btn": {
			stopWatch.stopWatchRunning();
			break;
		}

		case "reset-btn": {
			stopWatch.reset();
			break;
		}

		default:
			break;
	}
}

// other secondary functions

// this function rounds a number to given decimal places
function roundToDecimalPlaces(number, decimalPlaces) {
	// create a function that'd create a factor of 10 as with the given decimal places
	function createFactorOfTen(noOfZeros) {
		let factor = "1" + "0".repeat(noOfZeros);
		// use BigInt to handle very large numbers, then convert to primitive number type
		factor = parseInt(BigInt(factor));
		return factor;
	}

	let roundedNumber =
		Math.round(
			(number + Number.EPSILON) * createFactorOfTen(decimalPlaces)
		) / createFactorOfTen(decimalPlaces);
	// Number.EPSILON used because of cases like 1.005 to 2 decimal places
	return roundedNumber;
}
