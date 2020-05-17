import express from 'express';
import routes from './routes';
import path from 'path'
//Importacao da conexao com o bd
import './database';

class App {
    constructor() {
        // Variavel para utilizar o express
        this.server = express();

        // Essas funções seram chamadas quando App for instanciado
        this.middlewares();
        this.routes();
    }

    middlewares(){
        // Faz com que o express entenda Json
        this.server.use(express.json());
        //Pega o caminho do arquivo
        this.server.use('/files', express.static(path.resolve(__dirname,'..','temp','uploads')));
    }

    routes(){
        // Faz com que as rotas sejam utilizadas
        this.server.use(routes);
    }
}

export default new App().server;