import config from '../../config'

import { JetRouter } from './components/jet-1.0.0.min'
import { JetRender } from './components/jet-1.0.0.min'

import Global from './globals/global'
import Transition from './globals/transition'

let router

export default class App {

    constructor() {
        this.pageClasses = new Map()
        
        this.init()
    }
    
    async importPageClasses() {
        const imports = Object.entries(config.pages).filter(([_, value]) => value.class).map(async ([key, value]) => {
            const module = await import(/* webpackMode: "lazy-once" */ `./pages/${value.class}`)
            
            this.pageClasses.set(key, module.default)
        })
        
        await Promise.all(imports)
        this.runPageClass()
    }

    setRoutes() {
        router = new JetRouter()

        Object.entries(config.pages).forEach(([key, value]) => {
            router.get(value.route, route => {
                if (route.from === route.to && route.to.includes('#') || route.to.replace(route.from, '')[0] === '#') {
                    return this.scrollToElement(route.to.split('#')[1])
                }
                
                new Transition(key, route, this.loadPage.bind(this, route))
            })
        })
    }

    async loadPage(route) {
        const response = await fetch(route.to)
        const data = await response.text()

        this.render(route, data)
    }

    render(route, data) {
        const parser = new DOMParser()
        const html = parser.parseFromString(data, 'text/html')
    
        document.title = html.title
    
        new JetRender({
            container: 'body',
            content: data,
            onRender: () => this.renderHandler(route)
        })
    }

    renderHandler(route) {
        this.setState(route)
        this.resetScroll(route)
        this.runPageClass()
        route.to.includes('#') && this.scrollToElement(route.to.split('#')[1])
    }

    scrollToElement(id) {
        document.querySelector(`[id="${id}"]`).scrollIntoView()
    }

    resetScroll(route) {
        !route.popstate && window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    setState(route) {
        if (route.popstate || route.to === location.pathname || route.to.replace(route.from, '')[0] === '#') return
        
        history.pushState({}, document.title, route.to)
    }

    runPageClass() {
        const view = document.body.dataset.page
        const key = Object.keys(config.pages).find(key => config.pages[key].view === view)
        const className = this.pageClasses.get(key)
        
        className && new className()
        Global.onChangeState()
        router.getLinks()
    }

    init() {
        this.importPageClasses()
        this.setRoutes()
        Global.onLoad()
    }

}

new App()

export { router }
