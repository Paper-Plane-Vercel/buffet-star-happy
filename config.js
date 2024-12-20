const config = {
    "client": {
        "type": "client",
        "id": {
            "client": {
                "main": 14040,
                "buy": 14040,
                "rent": 14040,
            },
            "partnership": {
                "main": 1094,
                "buy": 1094,
                "rent": 1094
            }
        }
    },
    "apis": {
        "properties": "https://apiimoveisv3.casasoftsig.com/api/v3/",
        "leads": 'https://services.casasoftsig.com/marketing/api/',
        "pco": "https://pco.casasoftsig.com/v102/",
        "brasilapi": "https://brasilapi.com.br/api/"
    },
    "pages": {
        "index": {
            "view": "index",
            "route": "/",
            "class": "index"
        },
        "franchise": {
            "view": "franchise",
            "route": "/seja-um-franqueado",
            "class": "franchise"
        },
        "party": {
            "view": "party",
            "route": "/faca-sua-festa",
            "class": "party"
        },
        "notFound": {
            "view": "404",
            "route": "*"
        }
    }
}

module.exports = config