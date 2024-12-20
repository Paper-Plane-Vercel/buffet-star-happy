import { JetTransition } from '../components/jet-1.0.0.min'

export default class Transition {

    constructor(id, route, callback) {
        this.id = id
        this.route = route
        this.from = this.route.from.split('/')[1]
        this.to = this.route.to.split('/')[1]
        this.callback = callback
        
        this.init()
    }

    setTransition() {
        this.transition = new JetTransition({
            elements: {
                html: 'html',
                preloader: '.preloader'
            },
            firstLoad: false,
            enter: (elements, done) => this.enter(elements, done),
            enterEnd: (elements, done) => this.enterEnd(elements, done),
            leave: (elements, done) => this.leave(elements, done),
            leaveEnd: (elements, done) => this.leaveEnd(elements, done),
        })
        
        this.transition.run()
    }

    enter(elements, done) {
        if (this.from === this.to && this.to === 'imoveis') {
            elements.html.classList.add('transition', 'transition--in')

            return elements.html.addEventListener('animationend', done)
        }

        elements.preloader.classList.add('preloader--in')
        
        elements.preloader.addEventListener('animationend', done)
    }

    async enterEnd(elements, done) {
        await this.callback()
        done()
    }

    leave(elements, done) {
        if (this.from === this.to && this.to === 'imoveis') {
            elements.html.classList.add('transition--out')
            elements.html.classList.remove('transition--in')

            return elements.html.addEventListener('animationend', done)
        }

        elements.preloader.classList.add('preloader--out')
        
        elements.preloader.addEventListener('animationend', done)
    }

    leaveEnd(elements, done) {
        if (this.from === this.to && this.to === 'imoveis') {
            elements.html.classList.remove('transition', 'transition--out')

            return done()
        }

        elements.preloader.classList.remove('preloader--in', 'preloader--out')

        done()
    }

    init() {
        this.setTransition()
    }

}