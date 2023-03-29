import { sendMail } from '../lib/sendMail.js';
import { supportEmail, supportFromEmail } from '../sender/templates.js';

class SupportController {
    async sendMessage(req, res) {
        const { email, message } = req.body
        
        let mail = await supportFromEmail(email, message.replaceAll('\n', '<br>'), req.query.locale);

        sendMail(
            'info@liveproshop.com',
            mail.subject,
            mail.body
        );
        
        // sendMail(
        //     'info@liveproshop.com',
        //     `Support message from ${email}`,
        //     message.replaceAll('\n', '<br>')
        // );

        mail = await supportEmail(email, req.query.locale);

        sendMail(
            email,
            mail.subject,
            mail.body
        );

        // sendMail(
        //     email,
        //     `Proshop`,
        //     `Your message has been sent to support!`
        // );

        return res.status(200).json({})

    }
}

export default new SupportController();
