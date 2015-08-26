import './loader.scss'

import rebound from 'rebound'
import hidden from 'hidden'
import select from 'dom-select'

import DOMComponent from '../dom-component/dom-component'

import Promise from 'bluebird'

export default class Loader extends DOMComponent {

	constructor (element) {
		super(element)

        const springSystem = new rebound.SpringSystem()

		this.image = new DOMComponent(select('img', this.element))

        this.spring = springSystem.createSpring(40, 10)
        this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring)
        })
	}

	load () {
		return new Promise((resolve, reject) => {
			let image = new Image()
			image.onload = resolve
			image.src = this.image.element.src
		})
	}

	hide () {
		this.spring.setEndValue(1)
	}

	springUpdate (spring) {
		let progress = spring.getCurrentValue()

		this.opacity = 1 - progress

		this.render()
	}

	render () {
		super.render()

		hidden(this.element, !this.opacity)
	}

}
