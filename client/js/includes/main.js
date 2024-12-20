import { JetWindow } from '../components/jet-1.0.0.min'

export default class Main {

    constructor() {
        this.init()
    }

    lgpd() {
        if (!document.querySelector('.lgpd__window')) return

        const lgpd = localStorage.getItem('lgpd')

        new JetWindow({
            element: '.lgpd__window',
            close: '.lgpd__close',
            position: 'center bottom',
            closeOutside: false,
            autoOpen: !lgpd,
            scrollbar: true,
            windowTransitionIn: 'fade-in',
            windowTransitionOut: 'fade-out',
            overlayTransitionIn: 'fade-in',
            overlayTransitionOut: 'fade-out',
            onClose: () => localStorage.setItem('lgpd', true)
        })
    }

    init() {
        this.lgpd()
    }

}