import jwt from 'jsonwebtoken';
//Essa biblioteca pega uma funcao callback e transforma ela em uma funcao async await
import { promisify} from 'util';

import authConfig from '../../config/auth' 

//Toda requisicao deve receber o token
export default async (req, res, next) => {
  //Essa variavel pega o token que esta no header
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({ error: 'Token not provided' });
  }

  //Quando coloca uma virgula na desestruturacao, o primeiro valor do array e descartado
  const [, token] = authHeader.split(' ')

  try{
    //Coloca no param do Promisify a funcao que quer usar o async await
    //no primeiro () vai a funcao a ser alterada, no segundo os params da funcao alterada
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    //Esse ID sera utilizado para modificar o usuario
    req.userId = decoded.id;

    return next();
  }catch(err){
    return res.status(401).json({ error: 'Token invalid' })
  }

}