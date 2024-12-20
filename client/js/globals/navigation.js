export default class Navigation {

    constructor() {
        this.init()
    }

    setActiveLink() {
        const url = window.location.href;
        const homeUrl = `${window.location.origin}/`;
    
        document.querySelectorAll('header a[href], footer a[href]').forEach(link => {
            const isHomeLink = link.href === homeUrl;
            const isActive = isHomeLink ? url === link.href : url.endsWith(link.href);
    
            link.classList.toggle('is-active', isActive);
        });
    }

    init() {
        this.setActiveLink()
    }

}