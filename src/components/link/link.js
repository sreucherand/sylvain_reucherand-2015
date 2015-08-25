import './link.scss'

import css from 'dom-css'
import select from 'dom-select'

import DOMComponent from '../dom-component/dom-component'

export default class Link extends DOMComponent {

	constructor (element) {
		super (element)

		this.wrapper = document.createElement('span')
		this.wrapper.className = 'link'
		this.wrapper.innerHTML = this.element.innerHTML

		this.underline = document.createElement('span')
		this.underline.className = 'link__underline'

		this.wrapper.appendChild(this.underline)
		this.element.innerHTML = this.wrapper.outerHTML

		this.link = select('a', this.element)
		this.underline = select('.link__underline', this.element)
	}

	init () {
		super.init()

		!this.link && this.element.setAttribute('target', '_blank')
		this.link && this.link.setAttribute('target', '_blank')
	}

	render () {
		super.render()

		css(this.underline, 'background-color', this.color)
	}

}

