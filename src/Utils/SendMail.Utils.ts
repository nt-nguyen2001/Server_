import nodemailer from "nodemailer";

export default async function sendMail(toEmail: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL,
      },
    });
    await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: toEmail,
      subject: "Hello ✔",
      html: `<b>${text}</b>`,
    });
  } catch (err) {
    console.log("🚀 ~ file: SendMail.Utils.ts ~ line 23 ~ SendMail ~ err", err);
  }
}
