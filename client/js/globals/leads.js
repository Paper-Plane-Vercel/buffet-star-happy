export default class Leads {

    async create(options) {
        await fetch(options.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options.data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
    }

}