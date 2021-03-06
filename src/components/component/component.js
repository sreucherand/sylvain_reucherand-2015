import keys from '../utils/keys'

export default class Component {

    constructor () {
        this.children = []
        this.handlers = {}
        this.manifest = []
    }

    init () {
        for (let child of this.children) {
            child.init()
        }
    }

    focus () {
        keys.add(this)
    }

    sleep () {
        keys.remove(this)
    }

    addEntry (url) {
        this.manifest = this.manifest.concat(url)
    }

    addChild (child) {
        if (child instanceof Component) {
            this.children.push(child)
        }
    }

    removeChild (child) {
        this.children = this.children.filter(_child => _child !== child)
    }

    on (name, fn) {
    	if (typeof name === 'string' && typeof fn === 'function') {
            this.handlers[name] = (this.handlers[name] || []).concat(fn)
        }
    }

    off (name, fn) {
    	if (typeof name === 'string') {
    		if (typeof fn === 'function') {
    			this.handlers[name] = (this.handlers[name] || []).filter(handler => handler !== fn)
    		} else if (typeof fn === 'undefined') {
    			this.handlers[name] = []
    		}
    	}
    }

    trigger (name, ...parameters) {
    	if (typeof name === 'string') {
        	this.handlers[name] = this.handlers[name] || []

	        for (let handler of this.handlers[name]) {
	        	handler.apply(this, parameters)
	        }
	    }
    }

    render () {}

    get manifest () {
        let manifest = this._manifest

        for (let child of this.children) {
            manifest = manifest.concat(child.manifest)
        }

        return manifest
    }

    set manifest (manifest) {
        this._manifest = manifest
    }

}
