//Esse arquivo é responsavel pela conexao com o banco postgres
import Sequelize from 'sequelize';
//Importacao da configuracao do db
import databaseConfig from '../config/database'
//Importacao dos Models
import User from '../app/models/User'
import File from '../app/models/File'
import Appointment from '../app/models/Appointment';

//Array de cada Model
const models = [User,File,Appointment];

class Database {
  constructor(){
    this.init();
  }

  //Metodo responsavel pela conexao com o db
  init(){
    //Variavel responsavel pela conexao, databaseConfig fica as configuracoes do db
    this.connection = new Sequelize(databaseConfig);

    //O map percorrerá cada model, o associate percorrera apenas se existir
    models
    .map(model => model.init(this.connection))
    //Aqui é feito a associacao dos modelos com FK
    .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();