import nodemailer from 'nodemailer';
import mailConfig from '../../config/mail';
import {resolve} from 'path';
//Libs de template de email
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';

class Mail {
  constructor() {
    const {host, port, secure, auth} = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      //Verifica se tem usuario na autenticacao, se nao tiver manda auth null
      auth: auth.user ? auth: null,
    });

    this.configureTemplates();
  }

  configureTemplates(){
    //Sempre teste os caminhos antes de usar o resolve
    const viewPath = resolve(__dirname, '..', 'views', 'emails');

    //Use adiciona configuracoes no nodemailer, Compile é a maneira que o email e compilado, nodemailer-express-handlebars age em cima do compile
    this.transporter.use('compile', nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs'
      }),
      viewPath,
      extName: '.hbs',
    }));
  }

  sendMail(message){
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }

}

export default new Mail();