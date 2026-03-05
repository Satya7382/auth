import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, message) => {
    try {
        await resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: to,
            subject: subject,
            text: message,
        });
    } catch (error) {
        console.log("Email Error:", error);
    }
};

export default sendEmail;