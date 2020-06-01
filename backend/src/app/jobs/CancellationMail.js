import Mail from '../lib/Mail';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';

class CancellationMail {
  get key(){
    return 'CancellationMail';
  }

  //handle é a tarefa a ser executada quando o processo for executado
  async handle({data}){
    const {appointment} = data;

    console.log("A fila executou");

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        //appointment.provider.name vem do include da variavel appointment
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM' às' H:mm'h'",
          {locale: pt},
        ),
      },
    });
  };

}

export default new CancellationMail();

//CancellationMail for importado podera utiliza-lo como CancellationMail.key e nao CancellationMail.key()