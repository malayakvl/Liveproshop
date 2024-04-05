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
};

export const sendMailPlatinum = async (to, subject, html) => {
    console.log('Send Platinum Request');
    sgMail.setApiKey('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')
    const msg = {
        to: 'vladzavgor@gmail.com1', // Change to your recipient
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
};
