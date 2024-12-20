export default class Animation {

    constructor() {
        this.init()
    }

    inViewAnimation() {
        this.resetInViewAnimation()

        const observedElements = document.querySelectorAll('[data-animate]')
        const observer = new IntersectionObserver(this.setInViewAnimation)

        observedElements.forEach(element => observer.observe(element))
    }

    /**
     * set in view animation
     */
    setInViewAnimation(entries) {
        entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
            const delay = (index + 1) * 0.15 * 1000

            setTimeout(() => entry.target.classList.add('animated'), delay)
        })
    }

    /**
     * reset in view animation
     */
    resetInViewAnimation() {
        const animatedElements = document.querySelectorAll('.animated')

        animatedElements.forEach(element => {
            element.classList.remove('animated')
        })
    }

    init() {
        this.inViewAnimation()
    }

}