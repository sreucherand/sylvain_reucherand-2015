import './header.scss'

import chroma from 'chroma-js'
import rebound from 'rebound'
import css from 'dom-css'
import select from 'dom-select'
import {vec2} from 'gl-matrix'

import DOMComponent from '../dom-component/dom-component'
import viewport from '../utils/viewport'

export default class Header extends DOMComponent {

	constructor (element) {
		super (element)

		const springSystem = new rebound.SpringSystem()

		this.aside = new DOMComponent(select('.header__aside', this.element))
		this.title = new DOMComponent(select('.header__title', this.element))

		this.colors = [this.aside.color.hex(), chroma('white'), this.aside.color.hex()]

		this.spring = springSystem.createSpring(40, 10)

        this.addChild(this.aside)
        this.addChild(this.title)
	}

	init () {
		super.init()

		this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring)
        })
	}

	highlight () {
		this.spring.setEndValue(1)
	}

	release () {
		this.spring.setEndValue(0)
	}

	open () {
		this.spring.setEndValue(2)
	}

	close () {
		this.spring.setEndValue(0)
	}

	springUpdate (spring) {
		let progress = spring.getCurrentValue()

		this.aside.color = chroma.scale(this.colors).domain([0, this.colors.length - 1])(progress)
		this.aside.offset[1] = (-0.075 * Math.pow(progress, 2) - 0.125 * progress) * viewport.height // Parabole from 3 points (0, 0), (1, y) and (2, y)

		this.title.offset[1] = (0.0925 * Math.pow(progress, 2) - 0.4675 * progress) * viewport.height // Parabole from 3 points (0, 0), (1, y) and (2, y)

		this.render()
	}

	render () {
		super.render()

		this.aside.render()
		this.title.render()
	}

	resize () {
		super.resize()

		this.springUpdate(this.spring)
	}

}
