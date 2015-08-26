import keynames from 'keynames'
import on from 'dom-event'

import Component from '../component/component'

class Keys {

	constructor () {
		this.stack = []

		on(window, 'keydown', (evt) => this.handleKey(evt))
	}

	handleKey (evt) {
		if (this.stack.length > 0) {
			this.stack[this.stack.length - 1].trigger(keynames[evt.keyCode])
		}
	}

	add (component) {
		if (component instanceof Component) {
			this.stack.push(component)
		}
	}

	remove (component) {
		if (component instanceof Component) {
			this.stack = this.stack.filter(_component => _component !== component)
		}
	}

}

window.keys = window.keys || new Keys()

export default window.keys
