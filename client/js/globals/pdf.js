import ThirdPartyLoader from './third-party-loader'

export default class Pdf {

    constructor(options) {
        this.config = this.mergeOptions(options)
        this.element = this.getElement(this.config.element)
    }

    mergeOptions(options) {
		const defaultOptions = {
            element: '',
            margin: 10,
            html2canvas: {
                scale: 2,
                useCORS: true
            }
        }

        return this.mergeObjects(defaultOptions, options)
    }

    mergeObjects(defaultObject, object) {
        const mergedObject = { ...defaultObject, ...object }
        
        for (const key in object) {
            if (this.isObject(object[key])) {
                mergedObject[key] = { ...defaultObject[key], ...object[key] }
            }
        }
        
        return mergedObject
    }

    isObject(value) {
        return typeof value === 'object' && value !== null && !(value instanceof Node) && !Array.isArray(value)
    }

    getElement(selector, target = document) {
        return selector && typeof selector === 'string' ? target.querySelector(selector) : selector
    }

    async create() {
        await this.loadThirdParty()
        await this.getImages()

        return await html2pdf().set(this.config).from(this.element).outputPdf('blob')
    }

    async url() {
        await this.loadThirdParty()
        await this.getImages()
        
        const pdf = await html2pdf().set(this.config).from(this.element).toPdf().output('blob')

        return URL.createObjectURL(pdf)
    }

    async download() {
        await this.loadThirdParty()
        await this.getImages()

        return await html2pdf().set(this.config).from(this.element).save()
    }

    async loadThirdParty() {
        await new ThirdPartyLoader().load([
            'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
        ])
    }

    async getImages() {
        const images = document.querySelectorAll('img[src^="http"]')
    
        for (let image of images) {
            const imageUrl = image.src
            const response = await fetch(`/proxy-image?url=${imageUrl}`)
            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)
            
            image.src = blobUrl
        }
    }

}