import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

export const sendMail = async (to, subject, html) => {
    sgMail.setApiKey('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')

    const msg = {
        to: to, // Change to your recipient
        from: 'info@liveproshop.com', // Change to your verified sender
        subject: subject,
        html: html,
    }

    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
    // console.log(process.env.SENDGRID_EMAIL_SMTP_PASS);
    // sgMail.setApiKey('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')
    //
    // const msg = {
    //     to: to, // Change to your recipient
    //     from: process.env.EMAIL_FROM, // Change to your verified sender
    //     subject: subject,
    //     html: '<div>Test</div>',
    // }
    //
    // sgMail
    //     .send(msg)
    //     .then((response) => {
    //         console.log(response[0].statusCode)
    //         console.log(response[0].headers)
    //     })
    //     .catch((error) => {
    //         console.error(error)
    //     })


    // sgMail
    //     .send(msg)
    //     .then((response) => {
    //         // console.log(response[0].statusCode)
    //         // console.log(response[0].headers)
    //     })
    //     .catch((error) => {
    //         console.error(error)
    //     })

    // const transporterDB = nodemailer.createTransport({
    //     pool: true,
    //     host: process.env.EMAIL_SMTP_HOST,
    //     port: process.env.EMAIL_SMTP_PORT,
    //     auth: {
    //         user: process.env.EMAIL_SMTP_USER,
    //         pass: process.env.EMAIL_SMTP_PASS
    //     }
    // });
    //
    // const mailOptions = {
    //     from: 'noreply@liveproshop.com',
    //     to: to,
    //     subject: subject,
    //     html: html
    // };
    // transporterDB.sendMail(mailOptions, function (error, info) {
    //     if (error) { console.log(error); }
    //     return info;
    // });
};
