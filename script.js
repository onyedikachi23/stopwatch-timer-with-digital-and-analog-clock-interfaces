/** @format */

const timePointsEl = document.querySelector(".time-points");
const timeLogEl = document.querySelector(".time-log");

const stopWatchObj = {
	startTime: 0,
	endTime: 0,
	timeDuration: 0,

	// watch control functions
	startWatch: function () {
		this.startTime = performance.now();
		timePointsEl.textContent = "Stopwatch started";
	},
	stopWatch: function () {
		this.endTime = performance.now();
		timePointsEl.textContent = "Stopwatch stopped";

		// log time duration
		this.timeDuration = this.endTime - this.startTime;
		timeLogEl.textContent = `Time duration: ${this.timeDuration / 1000}s`;
	},
	reset: function () {},
	watchFeedback: function (value, feedbackType) {
		switch (feedbackType) {
			case "timePoints": {
				break;
			}

			default:
				break;
		}
	},
};
