import NodeMailer from 'nodemailer';

let mailer = null;

function init() {
  if (!mailer) {
    mailer = NodeMailer.createTransport({
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
}

/* mailer.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('mailer works');
  }
}); */

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
  const result = await mailer.sendMail(mail);
  console.log(result);

  return result;

  // TODO log email records
}

export default {
  send,
};
