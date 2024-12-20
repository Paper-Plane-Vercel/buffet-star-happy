const fs = require('fs')
const path = require('path')

class SitemapDynamic {
    constructor(page, type, id, transaction) {
        this.apiBaseUrl = 'https://apiimoveisv3.casasoftsig.com/api/v3/'
        this.page = `${page}/`
        this.type = type === 'cliente' ? 'clienteid' : 'parceriaid'
        this.id = id
        this.transaction = transaction

        this.init()
    }

    async init() {
        await this.createSitemap()
    }

    async createSitemap() {
        let url

        if (this.transaction === 'v' || this.transaction === 'l') {
            url = `${this.apiBaseUrl}imoveis/pesquisa?filtro.${this.type}=${this.id}&filtro.tipodivulgacao=${this.transaction}&pagina=1&maximo=999999`
        } else if (this.transaction === 'e') {
            url = `${this.apiBaseUrl}imoveis/empreendimento?filtro.${this.type}=${this.id}&pagina=1&maximo=999999`
        }

        const data = await this.loadAPI(url)

        this.createTemplate(data)
    }

    async loadAPI(url) {
        try {
            const response = await fetch(url)
            const json = await response.json()

            return json.data.resultado
        } catch (error) {
            console.error('API request failed:', error)
        }
    }

    createTemplate(data) {
        let templateModel

        if (this.transaction === 'e') {
            templateModel = this.templateEmpreendimentos(data)
        } else {
            templateModel = this.templateImoveis(data)
        }

        let template = `<?xml version="1.0" encoding="UTF-8"?>\n`
        template += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
        template += templateModel
        template += `</urlset>`

        this.createFile(template)
    }

    templateImoveis(data) {
        return data.map(item => {
            const tipoimovel = item.tipoImovelDescricao
            const quarto = item.imovelQuartos === 1 ? `-${item.imovelQuartos}-quarto` : item.imovelQuartos > 1 ? `-${item.imovelQuartos}-quartos` : ''
            const bairro = item.imovelEnderecoBairro ? `-${item.imovelEnderecoBairro}` : ''
            const cidade = item.imovelEnderecoCidade ? `-${item.imovelEnderecoCidade}` : ''
            const vaga = item.imovelVagas > 0 && item.imovelVagas !== 2 ? '-com-garagem' : ''
            const area = item.imovelAreaTotal ? `-${Math.floor(item.imovelAreaTotal)}m2` : ''
            const valorVendaLocacao = item.imovelVenda && item.imovelLocacao ? `-venda-locacao-rs-${Math.floor(item.imovelValorVenda)}-rs-${Math.floor(item.imovelValorAluguel - item.imovelValorMultaDesconto)}` : ''
            const valorVenda = item.imovelVenda && !item.imovelLocacao ? `-venda-rs-${Math.floor(item.imovelValorVenda)}` : ''
            const valorLocacao = !item.imovelVenda && item.imovelLocacao ? `-locacao-rs-${Math.floor(item.imovelValorAluguel - item.imovelValorMultaDesconto)}` : ''
            const valor = `${valorVendaLocacao}${valorVenda}${valorLocacao}`
            const loc = `${tipoimovel}${quarto}${bairro}${cidade}${vaga}${area}${valor}`
            const cleanedLoc = this.cleanString(loc)
            const lastmod = new Date().toISOString()

            return `    <url>
                <loc>${this.page}${cleanedLoc}?id=${item.clienteId}&amp;ref=${item.imovelReferencia}&amp;search=0</loc>
                <lastmod>${lastmod}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.80</priority>
            </url>\n`
        }).join('')
    }

    templateEmpreendimentos(data) {
        return data.map(item => {
            const tipoimovel = item.empTipoImovelDescricao;
            const bairro = item.empBairro ? `-${item.empBairro}` : ''
            const cidade = item.empCidade ? `-${item.empCidade}` : ''
            const loc = `${tipoimovel}${bairro}${cidade}`
            const cleanedLoc = this.cleanString(loc)
            const lastmod = new Date().toISOString()

            return `    <url>
                <loc>${this.page}${cleanedLoc}?cod=${item.empId}&amp;id=0</loc>
                <lastmod>${lastmod}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.80</priority>
            </url>\n`
        }).join('')
    }

    cleanString(string) {
        const from = ' /àáâãäåèéêëìíîïòóôõöùúûüç'
        const to = '--aaaaaaeeeeiiiiooooouuuuc'

        const newStr = string.toLowerCase().split('').map((char, i) => {
            const index = from.indexOf(char)

            return index !== -1 ? to[index] : char
        }).join('')
        
        return newStr
    }

    createFile(template) {
        const name = this.transaction === 'v' ? 'venda' : this.transaction === 'l' ? 'locacao' : 'empreendimento'
        const fileName = path.join(__dirname, `../sitemap-${name}.xml`)

        fs.writeFile(fileName, template, err => {
            if (err) {
                console.error('Error writing sitemap file:', err)
            } else {
                console.log('Sitemap created successfully')
            }
        })
    }
}

module.exports = async (request, response) => {
    const { page, type, id, transaction } = request.query

    if (!domain || !type || !id) {
        return response.status(400).send('Missing parameters')
    }

    try {
        new SitemapDynamic(page, type, id, transaction)

        response.status(200).send('Sitemap generation initiated')
    } catch (error) {
        console.error('Error generating sitemap:', error)
        response.status(500).send('Sitemap generation failed')
    }
}