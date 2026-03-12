import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
    try {
        await sgMail.send({
            to,
            from: process.env.EMAIL_FROM,
            subject,
            text,
            html: `<p>${text.replace(/\n/g, "<br>")}</p>`
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error(error);
    }
};

export default sendEmail;
