import nodemailer from 'nodemailer'
import path from 'path'
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars'

export const sendVerificationEmail = async (email: string, token: string ) => {

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_GMAIL_USER,
      pass: process.env.MAIL_GMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
      extname: ".handlebars",
      partialsDir: path.join(`${process.cwd()}/src/views`),
      defaultLayout: false,
    },
    viewPath: path.join(`${process.cwd()}/src/views`),
    extName: ".handlebars",
  }


  transporter.use('compile', hbs(handlebarOptions));

  const verificationUrl = `${process.env.FRONT_URL}/verify-email/${token}`
  
  let mailOptions = {
    from: 'Movie Quotes',
    to: email,
    subject: `Confirm your email`,
    template: 'confirmAccount',  
    context: {
      url: verificationUrl
    }
  }
  
  transporter.sendMail(mailOptions, (err, success) => {
    if(err) {
      console.log(err)
    } else {
      console.log('Email sent successfully')
      console.log(success)
    }
  })
}

