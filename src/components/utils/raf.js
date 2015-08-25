function cancelAnimationFrame (callback) {
	return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (callback) {
		clearTimeout(callback);
	}
}

function requestAnimationFrame () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
		window.setTimeout(callback, 1000 / 60)
	}
}

window.raf = window.raf || {
	queue: [],
	add: function (callback) {
		this.queue.push(callback)
		this.start()
	},
	remove: function (fn) {
		this.queue = this.queue.filter(callback => callback !== fn)
	},
	run: function () {
		for (let callback of this.queue) {
			callback()
		}

		if (this.queue.length > 0) {
			this.request = window.requestAnimationFrame(() => this.run())
		}
	},
	start: function () {
		this.run()
	}
}

export default window.raf
