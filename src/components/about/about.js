import './about.scss'

import chroma from 'chroma-js'
import rebound from 'rebound'
import css from 'dom-css'
import on from 'dom-event'
import select from 'dom-select'

import DOMComponent from '../dom-component/dom-component'
import Close from '../close/close'
import Link from '../link/link'
import Open from '../open/open'
import viewport from '../utils/viewport'

export default class About extends DOMComponent {

	constructor (element) {
		super(element)

        const springSystem = new rebound.SpringSystem()

		this.open = new Open(select('.about__open', this.element))
		this.close = new Close(select('[data-component="Close"]', this.element))
		this.image = new DOMComponent(select('img', this.element))
		this.overlay = new DOMComponent(select('.about__overlay', this.element))

		this.backgroundColor = chroma('white').alpha(0)
		this.colors = [chroma('white').alpha(0), chroma('white')]

		for (let paragraph of select.all('.description__paragraph', this.element)) {
			let links = Array.from(select.all('a', paragraph))

			for (let link of links) {
				link = new Link(link)

				this.addChild(link)
			}
		}

		this.spring = springSystem.createSpring(10, 6)

		this.hide = this.hide.bind(this)

		this.addEntry(this.image.element)

		this.addChild(this.close)
		this.addChild(this.open)
	}

	init () {
		super.init()

		this.close.on('press', () => this.hide())
		this.open.on('press', () => this.show())

		this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring)
        })

		this.on('esc', this.hide)
	}

	show () {
		this.focus()
		this.spring.setEndValue(1)

		this.close.show()
	}

	hide () {
		this.sleep()
		this.spring.setEndValue(0)

		this.close.hide()
		this.open.show()
	}

	springUpdate (spring) {
		let progress = spring.getCurrentValue()

		this.backgroundColor = chroma.scale(this.colors).domain([0, 1])(progress)

		this.overlay.opacity = Math.pow(progress, 4)
		this.overlay.scale[0] = 0.5 + progress / 2
		this.overlay.scale[1] = 0.5 + progress / 2
		this.overlay.translation[1] = progress * viewport.height

		this.render()
	}

	render () {
		super.render()

		this.overlay.render()

		css(this.element, 'background-color', this.backgroundColor.css())
	}

	resize () {
		super.resize()

		this.springUpdate(this.spring)
	}

}
