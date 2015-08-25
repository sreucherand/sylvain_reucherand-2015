import './background.scss'

import rebound from 'rebound'
import select from 'dom-select'

import CanvasComponent from '../canvas-component/canvas-component'
import DOMComponent from '../dom-component/dom-component'
import raf from '../utils/raf'
import viewport from '../utils/viewport'

export default class Background extends DOMComponent {

	constructor (element) {
		super (element)

        const springSystem = new rebound.SpringSystem()

        this.stage = new CanvasComponent()

		this.image = select('img', this.element)

		this.render = this.render.bind(this)

		this.spring = springSystem.createSpring(40, 10)
        
        this.addChild(this.stage)
	}

	init () {
		super.init()

		this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring)
        })

        this.stage.opacity = 0
        this.stage.on('resize', () => this.render())
	}

	show () {
		this.spring.setEndValue(1)
	}

	hide () {
		this.spring.setEndValue(0)
	}

	springUpdate (spring) {
        let progress = spring.getCurrentValue()

        this.stage.opacity = progress
        this.stage.scale[0] = 1 + progress * 0.1
        this.stage.scale[1] = 1 + progress * 0.1

		this.stage.render()
        this.render()
    }

	render () {
		super.render()

		this.stage.draw(this.image)
	}

}

