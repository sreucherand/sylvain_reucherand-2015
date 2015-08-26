import './navigation.scss'

import rebound from 'rebound'
import css from 'dom-css'
import on from 'dom-event'
import select from 'dom-select'
import {vec3} from 'gl-matrix'

import CanvasComponent from '../canvas-component/canvas-component'
import DOMComponent from '../dom-component/dom-component'

export default class Navigation extends DOMComponent {

    constructor (element) {
        super(element)

		const springSystem = new rebound.SpringSystem()

        this.image = new DOMComponent(select('.navigation__image img', this.element))
        this.subtitle = new DOMComponent(select('.navigation__subtitle', this.element))
        this.title = new DOMComponent(select('.navigation__title', this.element))
        this.label = new DOMComponent(select('.btn__label', this.title.element))

        this.stage = new CanvasComponent()

		this.bouncySpring = springSystem.createSpring(10, 3)
		this.parabolicSpring = springSystem.createSpring(40, 10)

        this.translation = vec3.create()

        this.handleMouseClick = this.handleMouseClick.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)

        this.addChild(this.label)
        this.addChild(this.stage)
        this.addChild(this.subtitle)
        this.addChild(this.title)
    }

    init () {
    	super.init()

        this.parabolicSpring.addListener({
            onSpringUpdate: (spring) => this.parabolicSpringUpdate(spring)
        })

        this.bouncySpring.addListener({
            onSpringUpdate: (spring) => this.bouncySpringUpdate(spring)
        })

        this.stage.opacity = 0

    	on(this.element, 'click', this.handleMouseClick)
    	on(this.element, 'mouseenter', this.handleMouseEnter)
    	on(this.element, 'mouseleave', this.handleMouseLeave)
    }

    handleMouseClick () {
        this.bouncySpring.setEndValue(0)
        this.parabolicSpring.setEndValue(0)

        this.trigger('press', true)
    }

    handleMouseEnter () {
    	this.bouncySpring.setEndValue(1)
    	this.parabolicSpring.setEndValue(1)
    }

    handleMouseLeave () {
    	this.bouncySpring.setEndValue(0)
    	this.parabolicSpring.setEndValue(0)
    }

    bouncySpringUpdate (spring) {
    	let progress = spring.getCurrentValue()

    	this.label.translation[1] = progress * -30
    	this.subtitle.translation[1] = progress * -30

    	this.trigger('transform', spring)

    	this.stage.render()
    	this.render()
    }

    parabolicSpringUpdate (spring) {
    	let progress = spring.getCurrentValue()

        this.stage.opacity = progress
        this.stage.scale[0] = 1 + progress * 0.1
        this.stage.scale[1] = 1 + progress * 0.1

        this.stage.render()
    	this.render()
    }

    render () {
    	super.render()

        this.subtitle.render()
        this.label.render()

    	this.stage.draw(this.image.element)
    }

}
