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

			this.watchFeedback("state", "Stopwatch started");
		} else {
			this.watchFeedback("state", "Stopwatch already running");
		}
	};

	stopWatchRunning = function () {
		if (this.#watchState.running) {
			this.#endTime = performance.now();
			this.#watchState.stopped = this.#watchState.running = false;

			// log end time and time duration
			this.#timeDuration = this.#endTime - this.#startTime;
			this.watchFeedback("state", "StopWatch ended");
			this.watchFeedback(
				"duration",
				`Time duration: ${this.#timeDuration / 1000}s`
			);
		} else if (this.#watchState.stopped) {
			this.watchFeedback("state", "Stopwatch already stopped");
		} else {
			this.watchFeedback("state", "Stopwatch not running");
		}
	};

	reset = function () {
		this.#startTime = 0;
		this.#endTime = 0;
		this.#timeDuration = 0;
		this.#watchState = { started: false, stopped: false, running: false };
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

		default:
			break;
	}
}
