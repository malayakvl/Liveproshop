import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, html) => {
    const transporterDB = nodemailer.createTransport({
        pool: true,
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        auth: {
            user: process.env.EMAIL_SMTP_USER,
            pass: process.env.EMAIL_SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: html
    };
    transporterDB.sendMail(mailOptions, function (error, info) {
        if (error) { console.log(error); }
        return info;
    });
};
