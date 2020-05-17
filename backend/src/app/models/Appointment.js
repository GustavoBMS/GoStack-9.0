import Sequelize, {Model} from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  //Associar com o model user, quando um model tem mais de um relacionamento deve ter o alias
  static associate(models){
    this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
    this.belongsTo(models.User, {foreignKey: 'provider_id', as: 'provider'});
  }

}

export default Appointment;