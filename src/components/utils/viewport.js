import on from 'dom-event'

import DOMComponent from '../dom-component/dom-component'
import Component from '../component/component'

class Viewport extends Component {

	constructor () {
		super()

		this.devicePixelRatio = 1
		this.ratio = 0

		this.height = 0
		this.width = 0

		this.resize()

		on(window, 'resize', () => this.resize())
	}

	isElementVisible (element) {
		if (element instanceof DOMComponent) {
			let height = Math.min(element.position[1] + element.size[1], this.height) - Math.max(element.position[1], 0)

			return (height > element.size[1] / 2 || height > 100)
		}

		return false
	}

	resize () {
		this.ratio = window.innerHeight / window.innerWidth

		this.height = window.innerHeight
		this.width = window.innerWidth

		this.trigger('resize')
	}

}

window.viewport = window.viewport || new Viewport()

export default window.viewport
