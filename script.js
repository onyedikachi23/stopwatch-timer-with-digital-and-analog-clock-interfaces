/** @format */

const timePointsEl = document.querySelector(".time-points");
const timeLogEl = document.querySelector(".time-log");
const controlBtnContainerEl = document.querySelector(".control-btns-container");
const startBtn = controlBtnContainerEl.querySelector("#start-btn");
const stopBtn = controlBtnContainerEl.querySelector("#stop-btn");
const resetBtn = controlBtnContainerEl.querySelector("#reset-btn");

// add click event listener to the control bitterness
for (const child of controlBtnContainerEl.children) {
	child.addEventListener("click", handleControlBtn);
}

// createStopWatch template class
class createStopWatch {
	// set private properties
	#startTime = 0;
	#endTime = 0;
	#timeDuration = 0;
	#timeID = 0;
	#watchState = { started: false, stopped: false, running: false };
	// use a getter to create a read-only access to the private properties
	get startTime() {
		return this.#startTime;
	}
	get endTime() {
		return this.#endTime;
	}
	get timeDuration() {
		return this.#timeDuration;
	}
	get watchState() {
		return this.#watchState;
	}

	// stopWatch own properties
	constructor() {}

	// watch control methods
	startWatch = function () {
		let feedbackObj;
		if (!this.#watchState.running) {
			this.#startTime = performance.now();
			this.#watchState.started = this.#watchState.running = true;

			// log state feedback
			this.watchFeedback("state", "Stopwatch started");
			this.watchFeedback("duration", "");
			// log live time
			this.#timeID = setInterval(
				watchFeedback(
					"duration",
					`Time elapsed: ${this.calculateTimeDuration()}`
				),
				1000
			);
		} else {
			this.watchFeedback("state", "Stopwatch already running");
		}
	};

	stopWatchRunning = function () {
		if (this.#watchState.running) {
			this.#endTime = performance.now();
			this.#watchState.stopped = this.#watchState.running = false;

			// log state and time duration feedback
			this.watchFeedback("state", "StopWatch ended");
			this.watchFeedback(
				"duration",
				`Time duration: ${calculateTimeDuration()}s`
			);
		} else if (this.#watchState.stopped) {
			this.watchFeedback("state", "Stopwatch already stopped");
		} else {
			this.watchFeedback("state", "Stopwatch not running");
		}
	};

	calculateTimeDuration = function () {
		this.#timeDuration = this.#endTime - this.#startTime;
		return roundToDecimalPlaces(this.#timeDuration / 1000, 3);
	};

	reset = function () {
		this.#startTime = 0;
		this.#endTime = 0;
		this.#timeDuration = 0;
		this.#watchState = { started: false, stopped: false, running: false };

		// remove any state or duration feedbacks and log resetted
		this.watchFeedback("state", "");
		this.watchFeedback("duration", "");
		this.watchFeedback("state", "resetted");
	};

	watchFeedback = function (feedbackType, value) {
		switch (feedbackType) {
			case "state": {
				timePointsEl.textContent = value;
				break;
			}

			case "duration": {
				timeLogEl.textContent = value;
			}

			default:
				break;
		}
	};

	logLiveTime = function () {};
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

// this function rounds a number to given decimal places only when necessary
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
