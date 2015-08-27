import './open.scss'

import clamp from 'mout/math/clamp'
import MobileDetect from 'mobile-detect'
import rebound from 'rebound'
import hidden from 'hidden'
import on from 'dom-event'
import {off} from 'dom-event'
import select from 'dom-select'

import DOMComponent from '../dom-component/dom-component'

export default class Open extends DOMComponent {

	constructor (element) {
		super(element)

		const springSystem = new rebound.SpringSystem()

		this.btn = select('.btn', this.element)

		this.labels = []
        this.md = new MobileDetect(window.navigator.userAgent)

		let rows = this.btn.innerHTML.split('<br>')

		this.btn.innerHTML = ''

		for (let string of rows) {
			let row = document.createElement('div')
			let label = document.createElement('span')
			let underline = document.createElement('span')

			row.className = 'btn__row'

			label.innerText = string
			label.className = 'btn__label'

			underline.className = 'btn__underline'

			row.appendChild(label)
			row.appendChild(underline)

			this.btn.appendChild(row)

			this.labels.push(new DOMComponent(label))
		}

		this.bouncySpring = springSystem.createSpring(10, 3)
		this.parabolicSpring = springSystem.createSpring(40, 10)

        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseClick = this.handleMouseClick.bind(this)
	}

	init () {
		super.init()
		
        this.bouncySpringUpdate(this.bouncySpring)
		this.bouncySpring.addListener({
            onSpringUpdate: (spring) => this.bouncySpringUpdate(spring)
        })

        this.parabolicSpringUpdate(this.parabolicSpring)
        this.parabolicSpring.addListener({
            onSpringUpdate: (spring) => this.parabolicSpringUpdate(spring)
        })

        this.show()
	}

	initMouseEvents () {
		on(this.btn, 'click', this.handleMouseClick)
		on(this.btn, 'mouseenter', this.handleMouseEnter)
		on(this.btn, 'mouseleave', this.handleMouseLeave)
	}

	removeMouseEvents () {
		off(this.btn, 'click', this.handleMouseClick)
		off(this.btn, 'mouseenter', this.handleMouseEnter)
		off(this.btn, 'mouseleave', this.handleMouseLeave)
	}

	show () {
		this.initMouseEvents()

		this.bouncySpring.setCurrentValue(0)
		this.bouncySpring.setEndValue(2)

		this.parabolicSpring.setCurrentValue(0)
		this.parabolicSpring.setEndValue(1)
	}

	hide () {
		this.removeMouseEvents()

		this.bouncySpring.setEndValue(4)
		this.parabolicSpring.setEndValue(3)
	}

	handleMouseClick (evt) {
		this.hide()

		this.trigger('press')
	}

	handleMouseEnter (evt) {
		this.bouncySpring.setEndValue(3)
		this.parabolicSpring.setEndValue(2)

		this.trigger('mouseenter', evt)
	}

	handleMouseLeave (evt) {
		this.bouncySpring.setEndValue(2)
		this.parabolicSpring.setEndValue(1)

		this.trigger('mouseleave', evt)
	}

	bouncySpringUpdate (spring) {
		let progress = spring.getCurrentValue()

		for (let label of this.labels) {
			label.offset[1] = (((progress - 2) * (1 + Math.pow(progress - 2, 2))) / 2) * -10
		}

		this.render()
	}

	parabolicSpringUpdate (spring) {
		let progress = spring.getCurrentValue()

		for (let label of this.labels) {
			if (this.md.mobile()) {
				label.opacity = clamp(progress, 0, 1)
			} else {
				label.opacity = clamp(progress - 1, 0, 1)
			}
		}

		this.opacity = clamp(-0.5 * Math.pow(progress, 2) + 1.5 * progress, 0, 1)

		this.render()
	}

	render () {
		super.render()

		for (let label of this.labels) {
			label.render()
		}

		hidden(this.element, this.opacity === 0)
	}

}
