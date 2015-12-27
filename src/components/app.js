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
import nprogress from 'nprogress'
import on from 'dom-event'
import Promise from 'bluebird'

class App {

    constructor () {
        this.about = new About(select('[data-component="About"]'))
        this.loader = new Loader(select('[data-component="Loader"]'))
        this.slider = new Slider(select('[data-component="Slider"]'))

        this.load().then(() => this.init())
    }

    load () {
        let manifest = []
        let promises = []

        manifest = manifest.concat(this.about.manifest)
        manifest = manifest.concat(this.slider.manifest)

        for (let entry of manifest) {
            promises.push(new Promise((resolve, reject) => {
                let image = new Image()
                image.onload = resolve
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

on(document, 'DOMContentLoaded', () => {
    new App()

    FastClick.attach(document.body)
})

nprogress.configure({showSpinner: false})
nprogress.start()
