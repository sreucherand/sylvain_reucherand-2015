import './slide.scss'

import chroma from 'chroma-js'
import MobileDetect from 'mobile-detect'
import rebound from 'rebound'
import css from 'dom-css'
import hidden from 'hidden'
import on from 'dom-event'
import {off} from 'dom-event'
import key from 'key-event'
import select from 'dom-select'

import CanvasComponent from '../canvas-component/canvas-component'
import DOMComponent from '../dom-component/dom-component'
import Background from '../background/background'
import Header from '../header/header'
import Link from '../link/link'
import Navigation from '../navigation/navigation'
import viewport from '../utils/viewport'

export default class Slide extends DOMComponent {

	constructor (element) {
		super (element)

        const springSystem = new rebound.SpringSystem()

		this.colorReference = chroma(this.element.getAttribute('data-dynamic-color'))
		this.callbacks = []
        this.done = []
        this.queue = []
        this.timer = null
        this.md = new MobileDetect(window.navigator.userAgent)

		this.background = new Background(select('[data-component="Background"]', this.element))
		this.content = new DOMComponent(select('.slide__content', this.element))
		this.contentMain = new DOMComponent(select('.content__main', this.content.element))
		this.header = new Header(select('[data-component="Header"]', this.element))
		this.navigation = new Navigation(select('[data-component="Navigation"]', this.element))

		this.elements = Array.from(select.all('[data-appearance]', this.content.element))
		this.elements = this.elements.map(element => new DOMComponent(element))

		this.details = Array.from(select.all('.details__detail', this.element))

		for (let element of this.elements) {
			this.addChild(element)
		}

		this.links = Array.from(select.all('[data-component="Link"]', this.element))
		this.links = this.links.map(link => new Link(link))

		for (let link of this.links) {
			this.addChild(link)
		}

		for (let detail of this.details) {
			let links = Array.from(select.all('a', detail))

			for (let link of links) {
				link = new Link(link)

				this.links.push(link)
				this.addChild(link)
			}
		}

		this.spring = springSystem.createSpring(40, 10)

        this.stage = new CanvasComponent()

        this.stage.addLayer(this.background.stage)
        this.stage.addLayer(this.navigation.stage)

        this.previous = this.previous.bind(this)
        this.close = this.close.bind(this)
        this.next = this.next.bind(this)
        this.scrollDown = this.scrollDown.bind(this)
        this.scrollUp = this.scrollUp.bind(this)
        this.handleScroll = this.handleScroll.bind(this)

        this.addChild(this.background)
        this.addChild(this.content)
        this.addChild(this.header)
        this.addChild(this.navigation)
        this.addChild(this.stage)
	}

	init () {
		super.init()

		this.header.title.color = this.colorReference
		this.header.title.render()

		for (let link of this.links) {
			link.color = this.colorReference
			link.render()
		}

		this.navigation.on('press', () => this.next())
		this.navigation.on('transform', (spring) => this.handleNavigationTransform(spring))

        this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring),
            onSpringAtRest: (spring) => this.springComplete(spring)
        })

        hidden(this.content.element, true)
	}

	initKeyboardEvents () {
		key.on(window, 'esc', this.close)
		key.on(window, 'left', this.previous)
		key.on(window, 'right', this.next)
		key.on(window, 'down', this.scrollDown)
		key.on(window, 'up', this.scrollUp)
	}

	removeKeyboardEvents () {
		key.off(window, 'esc', this.close)
		key.off(window, 'left', this.previous)
		key.off(window, 'right', this.next)
		key.off(window, 'down', this.scrollDown)
		key.off(window, 'up', this.scrollUp)
	}

	highlight () {
		this.background.show()
		this.header.highlight()
	}

	release () {
		this.background.hide()
		this.header.release()
	}

	open () {
		this.initKeyboardEvents()
		this.background.show()

		for (let element of this.elements) {
			element.opacity = 0
			element.render()
		}

		this.done = []
		this.queue = []

		this.header.open()
		this.spring.setEndValue(1)

		on(this.element, 'scroll', this.handleScroll)

        css(this.element, 'overflow-y', 'hidden')

		this.trigger('open')
	}

	close (force) {
		this.removeKeyboardEvents()
		this.background.hide()
		this.header.close()
		this.spring.setEndValue(0)

		this.trigger('close', force)
	}

	previous () {
		this.close()

		this.callbacks.push(() => this.trigger('previous'))
	}

	next () {
		this.close()

		this.callbacks.push(() => this.trigger('next'))
	}

	scrollDown () {
		this.element.scrollTop += 100
	}

	scrollUp () {
		this.element.scrollTop -= 100
	}

	handleScroll () {
		if (this.elements.length === this.done.length) {
			return
		}

		if (this.md.mobile()) {
			for (let element of this.elements) {
				element.opacity = 1
				element.render()

				this.done.push(element)
			}
		} else {
			for (let element of this.elements) {
				if (element.opacity === 0 && this.queue.concat(this.done).indexOf(element) === -1) {
					element.calc()

					if (viewport.isElementVisible(element)) {
						this.queue.push(element)
					}
				}
			}
		}

		if (this.elements.length === this.done.length) {
			off(this.element, 'scroll', this.handleScroll)
		}

		this.process()
	}

	process () {
		if (!this.timer && this.queue.length > 0) {
			let first = this.queue[0]

			first.enter()

			this.queue = this.queue.filter(element => element !== first)
			this.done.push(first)

			this.timer = setTimeout(() => {
				this.timer = null
				this.process()
			}, 100)
		}
	}

	handleNavigationTransform (spring) {
		this.contentMain.offset[1] = spring.getCurrentValue() * -35
		this.contentMain.render()
	}

	springComplete (spring) {
		if (spring.getCurrentValue() === 0) {
    		for (let callback of this.callbacks) {
    			callback()
    		}

    		this.callbacks = []
    	}

    	// hack for safari
    	if (spring.getCurrentValue() === 1) {
        	hidden(this.element, true)
			this.element.offsetHeight
        	hidden(this.element, false)

        	css(this.element, 'overflow-y', 'auto')
        }
	}

	springUpdate (spring) {
        let progress = spring.getCurrentValue()

        this.element.scrollTop *= progress

        this.content.translation[1] = viewport.height * -progress
        this.content.render()

        hidden(this.content.element, !progress)

		this.handleScroll()

        this.render()
    }

    render () {
    	super.render()

    	this.header.title.translation[0] = this.translation[0] * 0.2
    }

	resize () {
		super.resize()

		this.springUpdate(this.spring)

		this.handleScroll()
	}

}