import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, html, attachment = '') => {
    const transporterDB = nodemailer.createTransport({
        pool: true,
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASS
        }
    });
    if (attachment) {
        transporterDB.sendMail({
            from: 'noreply@liveproshop.com',
            to: to,
            subject: subject,
            html: html,
            attachments: [{
                filename: attachment.name,
                path: attachment.path,
                contentType: 'application/pdf'
            }],
            function(err, info) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(info);
                }
            }
        });
    } else {
        const mailOptions = {
            from: 'noreply@liveproshop.com',
            to: to,
            subject: subject,
            html: html
        };
        transporterDB.sendMail(mailOptions, function (error, info) {
            if (error) { console.log(error); }
            return info;
        });
    }
};
