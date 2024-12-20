const nodemailer = require('nodemailer')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage }).array('attachments')

const sendEmail = async (request, response) => {
    try {
        upload(request, response, async () => {
            const data = request.body
            const options = JSON.parse(data.options)

            options.attachments = request.files.map(file => ({
                filename: file.originalname,
                content: file.buffer
            }))
            
            const info = await transporter.sendMail(options)

            response.sendStatus(200)
        })
    } catch (error) {
        response.sendStatus(500)
    }
}

module.exports = { sendEmail }