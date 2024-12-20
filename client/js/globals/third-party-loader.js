export default class ThirdPartyLoader {

    async load(urls) {
        const promises = urls.map(url => this.createTag(url))
    
        await Promise.all(promises)
    }
    
    async createTag(url) {
        const extension = url.split('.').pop()
        const type = extension === 'js' ? 'script' : 'link'
        const parameter = extension === 'js' ? 'src' : 'href'
        const tag = document.createElement(type)
        const oldTag = document.querySelector(`${type}[${parameter}="${url}"]`)
        
        if (oldTag) return
    
        tag[parameter] = url
    
        if (extension === 'css') {
            tag.rel = 'stylesheet'
        }
    
        document.head.append(tag)
    
        await new Promise(resolve => tag.onload = () => resolve(url))
    }

}