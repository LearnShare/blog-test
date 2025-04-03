import NodeMailer from 'nodemailer';
import {
  Resend,
} from 'resend';

let mailer = null;

function createNodeMailer() {
  return NodeMailer.createTransport({
    // https://ethereal.email/
    host: 'smtp.ethereal.email',
    port: 587,

    // Gmail
    /* service: 'gmail',
    port: 465,
    secure: true,
    secureConnection: false,
    tls: {
      rejectUnAuthorized: true,
    }, */

    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },

    // logger: true,
    // debug: true,
  });
}

const resendKey = process.env.RESEND_API_KEY;

function init() {
  if (!mailer) {
    mailer = resendKey
        ? new Resend(resendKey)
        : createNodeMailer();
  }
}

/* mailer.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('mailer works');
  }
}); */

function sendMail(mail: any) {
  if (resendKey) { // use Resend
    return mailer.emails.send(mail);
  } else { // use node mailer
    return mailer.sendMail(mail);
  }
}

async function send(to: string, title: string, content: string) {
  init();

  const mail = {
    from: `Blog <${ process.env.MAIL_USER }>`,
    to,
    subject: title,
    text: content,
    html: content,
  };

  console.log(`[MAIL]:`, `to <${to}>`, `\n${title}\n${content}`);
  const result = await sendMail(mail);
  console.log(result);

  return result;

  // TODO log email records
}

export default {
  send,
};
