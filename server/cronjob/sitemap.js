const fs = require('fs')
const path = require('path')

class Sitemap {
    constructor(domain, type, id) {
        this.apiBaseUrl = 'https://apiimoveisv3.casasoftsig.com/api/v3/'
        this.domain = domain
        this.type = type === 'cliente' ? 'clienteid' : 'parceriaid'
        this.id = id

        this.init()
    }

    async init() {
        await this.createSitemap()
    }

    async createSitemap() {
        const urlVenda = `${this.apiBaseUrl}imoveis/pesquisa?filtro.${this.type}=${this.id}&filtro.tipodivulgacao=v&pagina=1&maximo=1`
        const urlLocacao = `${this.apiBaseUrl}imoveis/pesquisa?filtro.${this.type}=${this.id}&filtro.tipodivulgacao=l&pagina=1&maximo=1`
        const urlEmpreendimento = `${this.apiBaseUrl}imoveis/empreendimento?filtro.${this.type}=${this.id}&pagina=1&maximo=1`

        const data = await this.loadAPI({
            venda: urlVenda,
            locacao: urlLocacao,
            empreendimento: urlEmpreendimento
        })

        this.createTemplate(data)
    }

    async loadAPI(data) {
        const promises = Object.entries(data).map(async ([label, url]) => {
            const response = await fetch(url)
            const json = await response.json()

            return { label, data: json }
        })

        const results = await Promise.all(promises)

        return results.reduce((acc, { label, data }) => {
            acc[label] = data

            return acc
        }, {})
    }

    createTemplate(data) {
        data = { static: { data: { resultado: [true] } }, ...data }

        let template = `<?xml version="1.0" encoding="UTF-8"?>\n`
        template += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

        Object.entries(data).forEach(([label, item]) => {
            if (item.data && item.data.resultado && item.data.resultado.length) {
                const loc = `${this.domain}/sitemap-${label}.xml`
                const lastmod = new Date().toISOString()

                template += `    <sitemap>\n`
                template += `        <loc>${loc}</loc>\n`
                template += `        <lastmod>${lastmod}</lastmod>\n`
                template += `    </sitemap>\n`
            }
        })

        template += `</sitemapindex>`

        this.createFile(template)
    }

    createFile(template) {
        const filePath = path.join(__dirname, '../sitemap.xml')

        fs.writeFile(filePath, template, (err) => {
            if (err) {
                console.error('Error writing file:', err)
            } else {
                console.log('Sitemap created successfully')
            }
        })
    }
}

module.exports = async (request, response) => {
    const { domain, type, id } = request.query

    if (!domain || !type || !id) {
        return response.status(400).send('Missing parameters')
    }

    try {
        new Sitemap(domain, type, id)

        response.status(200).send('Sitemap generation initiated')
    } catch (error) {
        console.error('Error generating sitemap:', error)
        response.status(500).send('Sitemap generation failed')
    }
}