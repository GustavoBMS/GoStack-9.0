import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  
  async index(req, res){
    const checkIsProvider = await User.findOne({
      where: {
        id: req.userId, provider: true
      },
    });

    if(!checkIsProvider){
      res.status(401).json({ error: 'User is not a provider'})
    };

    const notifications = await Notification.find({
      user: req.userId,
    }).sort({createdAt: 'desc'}).limit(20);

    return res.json(notifications);
  }

  async update(req, res){
    const notifications = await Notification.findByIdAndUpdate(
      req.params.id,
      {read: true},
      //New traz um retorno de que foi atualizado, sem o new esse retorno nao acontece
      {new: true},
    );

    return res.json(notifications);
  }

}

export default new NotificationController();