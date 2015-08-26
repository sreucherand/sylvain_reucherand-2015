import chroma from 'chroma-js'
import rebound from 'rebound'
import css from 'dom-css'
import on from 'dom-event'
import select from 'dom-select'
import {vec2} from 'gl-matrix'
import {vec3} from 'gl-matrix'

import Component from '../component/component'

export default class DOMComponent extends Component {

    constructor (element) {
        super ()

        this.element = element

        const springSystem = new rebound.SpringSystem()

        this.color = chroma(this.element.getAttribute('[data-dynamic-text-color]') || window.getComputedStyle(this.element).color)

        this.opacity = 1
        this.offset = vec3.create()
        this.position = vec2.create()
        this.translation = vec3.create()
        this.scale = vec2.fromValues(1, 1)
        this.size = vec2.create()

        this.spring = springSystem.createSpring(40, 10)
    }

    init () {
        super.init()
        
        this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring)
        })

        this.calc()

        viewport.on('resize', () => this.resize())
    }

    calc () {
        this.position[0] = this.element.getBoundingClientRect().left
        this.position[1] = this.element.getBoundingClientRect().top

        this.size[0] = this.element.getBoundingClientRect().width
        this.size[1] = this.element.getBoundingClientRect().height
    }

    enter () {
        this.spring.setCurrentValue(0)
        this.spring.setEndValue(1)
    }

    springUpdate (spring) {
        let progress = spring.getCurrentValue()

        this.opacity = progress
        this.translation[1] = 50 * (1 - progress)

        this.render()
    }

    render () {
        super.render()

        css(this.element, {
            color: this.color,
            opacity: this.opacity,
            transform: `scale(${this.scale[0]}, ${this.scale[1]}) translate3d(${this.translation[0] + this.offset[0]}px, ${this.translation[1] + this.offset[1]}px, ${this.translation[2] + this.offset[2]}px)`
        })
    }

    resize () {
        this.render()

        this.calc()
    }

}
