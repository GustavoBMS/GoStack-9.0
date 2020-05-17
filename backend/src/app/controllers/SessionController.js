//Rever esse video para poder entender melhor os conceitos
import jwt from 'jsonwebtoken'
import * as Yup from 'yup'
import User from '../models/User'
//Aqui esta importando utilizando apenas o caminho
import authConfig from '../../config/auth'

class SessionController{
  async store(req,res){

    //Validacao dos campos
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    })

    //Verifica se o req.body é valido de acordo com a validacao
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails' });
    }

    //Como vou fazer uma requisicao, devo colocar como body
    const {email, password} = req.body;

    //Busca o usuario
    const user = await User.findOne({ where: { email } });

    //Verifica se usuario/email existe
    if(!user){
      return res.status(401).json({error: 'User not found'});
    }

    //Verifica se a senha esta correta
    if(!(await user.checkPassword(password))){
      return res.status(401).json({error:'Password does not match'});
    }

    //Se chegou aqui é porque os dados bateram
    const {id,name} = user;

    return res.json({
      //Retorna os dados do usuario
      user: {
        id,
        name,
        email,
      },
      //Secret é uma string encriptada, expires e a validade do token
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });

  }
}

export default new SessionController();