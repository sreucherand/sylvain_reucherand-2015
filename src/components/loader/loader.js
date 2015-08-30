import './loader.scss'

import nprogress from 'nprogress'
import rebound from 'rebound'
import hidden from 'hidden'
import select from 'dom-select'

import DOMComponent from '../dom-component/dom-component'

import Promise from 'bluebird'

export default class Loader extends DOMComponent {

	constructor (element) {
		super(element)

        const springSystem = new rebound.SpringSystem()

        this.spring = springSystem.createSpring(40, 10)
        this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring)
        })

        nprogress.configure({showSpinner: false})
        nprogress.start()
	}

	hide () {
		this.spring.setEndValue(1)

		nprogress.done(true)
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
