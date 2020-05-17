//Importacao do sequelize, init vem da classe model
import Sequelize, { Model } from 'sequelize';
//bcrypt
import bcrypt from 'bcryptjs';

//Classe de usuario, Super é a classe pai, meio que seria tipo usar o This
//super.init recebe as colunas editaveis da tabela User
class User extends Model {
  static init(sequelize) {
    super.init(
      {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      //Virtual é um campo que nao existe na base de dados
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN
      },
      {
        sequelize,
      }
    );
    //Trechos de codigo executados automaticamente em acoes no model, before save atua na edicao e criacao
    this.addHook('beforeSave', async (user) => {
      if (user.password){
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    //É bom retornar o model estatico dessa maneira, nao e necessario mudar no controller, pois ele ja envia
    return this;
  }

  //Aqui é feita a associacao com o model File
  static associate(models){
    this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar'});
  }

  //Como nao e uma regra de negocio, posso verificar diretamente do modelo
  //password é a senha que esta sendo utilizada para verificar
  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;