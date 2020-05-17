import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';

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
    const isProvider = await User.findOne({
      where: {id: provider_id, provider: true},
    });

    if(!isProvider){
      return res
      .status(401)
      .json({error: 'You can only create appointments with providers'});
    }

    const appointment = await Appointment.create({
      //req.userId pega o Id a partir do middleware de autenticação
      user_id: req.userId,
      provider_id,
      date,
    });

    res.json(appointment);
  }

}

export default new AppointmentController();