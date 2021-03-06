import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import pt from 'date-fns/locale/pt';//Importa
import {parseISO, isBefore, startOfHour, format, subHours} from 'date-fns';
import * as Yup from 'yup';
import Queue from '../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {

  async index(req, res){
    const {page = 1} = req.query;

    //Como o file precica do path ele deve ser mostrado tambem
    const appointments = await Appointment.findAll({
      where: {user_id: req.userId, canceled_at: null},
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      //Include é responsavel pela associacao com as FKs
      include: [{
        model: User, 
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        }],
      }],
    });

    return res.json(appointments);
  }

  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails'})
    };
    
    const {provider_id, date} = req.body;

    //Verifica se o provider_id e um provider
    const checkIsProvider = await User.findOne({
      where: {id: provider_id, provider: true},
    });

    if(!checkIsProvider){
      return res
      .status(401)
      .json({error: 'You can only create appointments with providers'})//.console.log("A " + checkIsProvider);
    }

    //Verifica dualidade de IDs
    if(req.userId == provider_id || provider_id == req.userId){
      return res
      .status(401)
      .json({error: 'Provider cannot create appointment to himself'});
    };

    //parseISO transforma a string de data em um objeto Date do JS, hourStart zera min e seg
    const hourStart = startOfHour(parseISO(date));

    //Verifica se a data/hora marcada é antes da data/hora atual, hourStart faz minuto e segundo ficar zerado
    if(isBefore(hourStart, new Date())){
      return res.status(400).json({ error: 'Past dates are not permitted.'});
    }

    //Verifica se tem agendamento para o mesmo horario
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      }
    });

    if(checkAvailability){
      return res.status(400).json({ error: 'Appointment is not available.'});
    }

    //Cria o agendamento
    const appointment = await Appointment.create({
      //req.userId pega o Id a partir do middleware de autenticação
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    //Notificar prestador de serviço
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM' às' H:mm'h'",//O que fica dentro das aspas simples nao sera modificado pelo date-fns
      {locale: pt},
      );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}.`,
      user: provider_id,
    });

    res.json(appointment);
  }

  async delete(req,res){
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ]
    });

    if(appointment.user_id != req.userId){
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment"
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if(isBefore(dateWithSub, new Date())){
      return res.status(401).json({ error: 'You can only cancel appointments 2 hours in advance.'})
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }

}

export default new AppointmentController();