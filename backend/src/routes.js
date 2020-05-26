import { Router } from 'express';
//Importacao dos controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
//Importa o middleware de autenticacao
import authMiddleware from './app/middleware/auth'
//Importa lib para upload
import multer from 'multer'
import multerConfig from './config/multer'

//Instancia do express
const routes = new Router();

//Lib para upload de imagens/arquivos?, multer recebe nos parametros a configuracao de armazenamento
const upload = multer(multerConfig);

//Easter Egg
routes.get('/hello', (req, res) => {
  return res.json({ message: "Hello World!"});
});

//Criação de usuario
routes.post('/users', UserController.store);

//Login
routes.post('/session', SessionController.store);

//Faz com que seja utilizado autenticacao em todas as rotas abaixo desse middleware
routes.use(authMiddleware);

//Atualizacao de usuario
routes.put('/users', UserController.update);

//Upload
routes.post('/files', upload.single('file'),FileController.store);

//Providers (Prestador de serviço)
routes.get('/providers', ProviderController.index);

//Appointments, Agendar horario
routes.post('/appointments', AppointmentController.store);

//Appointments, Retorna Todos os Agendamentos
routes.get('/appointments', AppointmentController.index);

//Appointments, Apaga o agendamento
routes.delete('/appointments/:id', AppointmentController.delete);

//Mostra agendamentos por providers
routes.get('/schedules', ScheduleController.index);

//Mostra notificacoes do usuario
routes.get('/notifications', NotificationController.index);

//Atualiza o visualizado pra true
routes.put('/notifications/:id', NotificationController.update);

export default routes;