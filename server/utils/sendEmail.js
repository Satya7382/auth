import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: 'Auth App <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email sent:", data);
  } catch (error) {
    console.log("Email Error:", error);
  }
};