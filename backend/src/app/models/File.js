//Importacao do sequelize, init vem da classe model
import Sequelize, { Model } from 'sequelize';

//Classe de usuario, Super é a classe pai, meio que seria tipo usar o This
//super.init recebe as colunas editaveis da tabela Files
class File extends Model {
  static init(sequelize) {
    super.init(
      {
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      //Na url, faço com que o arquivo retorne um caminho url utilizando o path
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `http://localhost:3333/files/${this.path}`;
        },
      },
      },
      {
        sequelize,
      }
    );
    //É bom retornar o model estatico dessa maneira, nao e necessario mudar no controller, pois ele ja envia
    return this;
  }
}

export default File;