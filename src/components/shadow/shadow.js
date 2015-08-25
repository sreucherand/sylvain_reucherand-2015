import './shadow.scss'

import css from 'dom-css'
import select from 'dom-select'

import DOMComponent from '../dom-component/dom-component'

export default class Shadow extends DOMComponent {

    constructor (element) {
        super(element)

        this.gradient = select('.slide__shadow', this.element)
    }

    render () {
    	css(this.element, 'opacity', this.opacity)
    	css(this.gradient, 'background-image', `linear-gradient(${this.color.alpha(0).css()}, ${this.color.alpha(0.7).css()})`)
    }

}
