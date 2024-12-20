import { JetWindow } from '../components/jet-1.0.0.min'

export default class Header {

    constructor() {
        this.init()
    }

    menu() {
        new JetWindow({
            element: '.header__menu-window',
            open: '.header__menu-open',
            close: '.header__menu-close',
            position: 'right top',
            windowTransitionIn: 'slide-bottom',
            windowTransitionOut: 'slide-top'
        })
    }

    init() {
        if (!document.querySelector('header')) return

        this.menu()
    }

}