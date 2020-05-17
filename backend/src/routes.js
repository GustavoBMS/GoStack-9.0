import { Router } from 'express';
//Importacao dos controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController';
//Importa o middleware de autenticacao
import authMiddleware from './app/middleware/auth'
//Importa lib para upload
import multer from 'multer'
import multerConfig from './config/multer'

//Instancia do express
const routes = new Router();

//Lib para upload de imagens/arquivos?, multer recebe nos parametros a configuracao de armazenamento
const upload = multer(multerConfig);

//Criação de usuario
routes.post('/users', UserController.store);

//Atualizacao de usuario
routes.put('/users',authMiddleware, UserController.update);

//Login
routes.post('/session', SessionController.store);

//Upload
routes.post('/files', upload.single('file'),FileController.store);

//Providers (Prestador de serviço)
routes.get('/providers', ProviderController.index);

//Appointments, Agendar horario
routes.post('/appointments', AppointmentController.store);

//Hello World
routes.get('/hello', (req, res) => {
  return res.json({ message: "Hello World!"});
});

export default routes;