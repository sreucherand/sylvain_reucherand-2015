import 'babel-core/polyfill'
import 'normalize.scss/normalize.scss'
import 'flexboxgrid/dist/flexboxgrid.css'

import '../scss/common.scss'
import '../scss/base/_fonts.scss'

import 'TweenLite'
import 'EasePack'

import './button/button.scss'
import './shadow/shadow.scss'
import './stage/stage.scss'

import About from './about/about'
import Slider from './slider/slider'

import select from 'dom-select'
import FastClick from 'FastClick'
import Promise from 'bluebird'

class App {

    constructor () {
        TweenLite.defaultEase = Expo.easeOut

        this.about = new About(select('[data-component="About"]')) 
        this.slider = new Slider(select('[data-component="Slider"]'))

        this.load().then(() => this.init())
    }

    load () {
        let promises = []




        // let manifest = []
        // let promises = []

        // this.components.forEach(component => {
        //     manifest = manifest.concat(component.getManifest())
        // })

        // manifest.forEach(src => {
        //     promises.push(new Promise((resolve, reject) => {
        //         let image = new Image()
        //         image.onload = resolve
        //         image.src = src
        //     }))
        // })

        return Promise.all(promises)
    }

    init () {
        console.log('app:init')

        this.about.init()
        this.slider.init()
    }

}

window.onload = function () {
    new App()

    FastClick.attach(document.body)
}

console.log('%cHold on! You\'re looking for a interactive developer? I\'m looking for a job in Copenhagen. %c--> %chireMe()', 'color: #2c3e50; font-size: 16px; font-weight: bold', 'color: #000000; font-size: 14px; font-weight: bold', 'color: #d35400; font-size: 16px; font-weight: bold')

window.hireMe = function () {
    window.location = 'mailto:hello@sylvainreucherand.fr'
}
