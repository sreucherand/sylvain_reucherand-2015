import './close.scss'

import clamp from 'mout/math/clamp'
import rebound from 'rebound'
import css from 'dom-css'
import hidden from 'hidden'
import on from 'dom-event'
import {off} from 'dom-event'
import select from 'dom-select'
import {vec2} from 'gl-matrix'

import DOMComponent from '../dom-component/dom-component'

export default class Close extends DOMComponent {

	constructor (element) {
		super(element)

		const springSystem = new rebound.SpringSystem()

		this.btn = select('.btn', this.element)
		this.label = select('.btn__label', this.element)
		this.underline = select('.btn__underline', this.element)

		this.offset = vec2.create()

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
		this.parabolicSpring.setEndValue(2)
	}

	handleMouseClick (evt) {
		this.trigger('press')
	}

	handleMouseEnter (evt) {
		this.bouncySpring.setEndValue(3)
	}

	handleMouseLeave (evt) {
		this.bouncySpring.setEndValue(2)
	}

	bouncySpringUpdate (spring) {
		let progress = spring.getCurrentValue()

		this.offset[1] = (((progress - 2) * (1 + Math.pow(progress - 2, 2))) / 2) * -15

		this.render()
	}

	parabolicSpringUpdate (spring) {
		let progress = spring.getCurrentValue()

		this.opacity = (Math.cos(Math.PI * (progress + 1)) + 1) / 2

		this.render()
	}

	render () {
		super.render()

		css(this.label, {
			color: this.color.hex(),
			transform: `translate3d(0, ${this.offset[1]}px, 0)`
		})
		css(this.underline, 'background-color', this.color.hex())

		hidden(this.element, this.opacity === 0)
	}

}
