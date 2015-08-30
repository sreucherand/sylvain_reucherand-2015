import 'babel-core/polyfill'
import 'normalize.scss/normalize.scss'
import 'flexboxgrid/dist/flexboxgrid.css'

import '../scss/common.scss'
import '../scss/base/_fonts.scss'

import './button/button.scss'
import './shadow/shadow.scss'
import './stage/stage.scss'

import About from './about/about'
import Loader from './loader/loader'
import Slider from './slider/slider'

import select from 'dom-select'
import FastClick from 'FastClick'
import MobileDetect from 'mobile-detect'
import Promise from 'bluebird'

class App {

    constructor () {
        this.about = new About(select('[data-component="About"]'))
        this.loader = new Loader(select('[data-component="Loader"]'))
        this.slider = new Slider(select('[data-component="Slider"]'))

        console.log('coucou')

        this.load().then(() => this.init())
    }

    load () {
        let manifest = []
        let promises = []

        manifest = manifest.concat(this.about.manifest)
        manifest = manifest.concat(this.slider.manifest)

        console.log(manifest)

        for (let entry of manifest) {
            promises.push(new Promise((resolve, reject) => {
                let image = new Image()
                image.onload = () => {
                    console.log('coiucoucou')
                    resolve()
                }
                image.src = entry
            }))
        }

        return Promise.all(promises)
    }

    init () {
        const md = new MobileDetect(window.navigator.userAgent)

        this.loader.hide()

        this.about.init()
        this.slider.init()

        if (md.mobile()) {
            this.slider.on('open', () => this.about.open.hide())
            this.slider.on('close', () => this.about.open.show())
        }
    }

}

window.onload = (function () {
    new App()

    FastClick.attach(document.body)
})

console.log('%cHold on! You\'re looking for a interactive developer? I\'m looking for a job in Copenhagen. %c--> %chireMe()', 'color: #2a2a2c; font-size: 16px; font-weight: bold', 'color: #000000; font-size: 14px; font-weight: bold', 'color: #d35400; font-size: 16px; font-weight: bold')

window.hireMe = function () {
    window.location = 'mailto:hello@sylvainreucherand.fr'
}
