import { sendMail } from '../lib/sendMail.js';
import { contactUsFromEmail, requestDemoFromEmail } from '../sender/templates.js';

class ContactUsController {
    async sendMessage(req, res) {
        const { name, email, message } = req.body
        
        let mail = await contactUsFromEmail(name.trim(), email, message.trim(), req.query.locale);

        sendMail(
            'info@liveproshop.com',
            mail.subject,
            mail.body
        );

        return res.status(200).json({ success: true })

    }
    async requestDemo(req, res) {
        const { email, locale } = req.body
        
        let mail = await requestDemoFromEmail(email, locale);

        sendMail(
            'info@liveproshop.com',
            mail.subject,
            mail.body
        );

        return res.status(200).json({ success: true })

    }
}

export default new ContactUsController();
