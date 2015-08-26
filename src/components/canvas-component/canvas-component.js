import css from 'dom-css'
import {vec2} from 'gl-matrix'

import Component from '../component/component'
import viewport from '../utils/viewport'

export default class CanvasComponent extends Component {

    constructor (element) {
        super (element)

        this.canvas = element || document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        this.layers = []

        this.opacity = 1
        this.scale = vec2.fromValues(1, 1)
    }

    init () {
        super.init()

        this.resize()
    }

    addLayer (layer) {
        if (layer instanceof CanvasComponent) {
            layer.on('draw', () => {
                this.trigger('draw')
                this.render()
            })

            this.layers.push(layer)
        }
    }

    draw (object) {
        this.context.save()
        this.context.translate(this.canvas.width * (this.scale[0] - 1) * -0.5, this.canvas.height * (this.scale[1] - 1) * -1)
        this.context.scale(this.scale[0], this.scale[1])
        this.context.globalAlpha = this.opacity

        if (viewport.ratio < (9 / 16)) {
            this.context.drawImage(object, 0, -(1920 * viewport.ratio - 1080) / 2, 1920, 1920 * viewport.ratio, 0, 0, this.canvas.width, this.canvas.height)
        } else {
            this.context.drawImage(object, -(1080 / viewport.ratio - 1920) / 2, 0, 1080 / viewport.ratio, 1080, 0, 0, this.canvas.width, this.canvas.height)
        }

        this.context.restore()

        this.trigger('draw')
    }

    drawGradient (color, progress) {
        let height = 800
        let gradient = this.context.createLinearGradient(0, this.canvas.height - height * progress, 0, this.canvas.height + height * (1 - progress))

        gradient.addColorStop(0, color.alpha(0).css())
        gradient.addColorStop(1, color.alpha(0.7).css())

        this.context.fillStyle = gradient
        this.context.fillRect(0, this.canvas.height - height * progress, this.canvas.width, 800)

        this.trigger('draw')
    }

    render () {
        super.render()

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (let layer of this.layers) {
            this.context.drawImage(layer.canvas, 0, 0, this.canvas.width, this.canvas.height)
        }
    }

    resize () {
        this.canvas.height = viewport.height
        this.canvas.width = viewport.width

        css(this.canvas, {
            height: viewport.height,
            width: viewport.width
        })

        for (let layer of this.layers) {
            layer.resize()
        }

        this.render()
    }

}

