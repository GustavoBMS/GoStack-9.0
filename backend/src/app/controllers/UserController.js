import User from '../models/User';
//Yup é uma lib de validadacao, nao tem nenhum export default entao tem que usar com um alias
import * as Yup from 'yup';

class UserController{
  async store(req, res){

    //Validacao dos campos
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    })

    //Verifica se o req.body é valido de acordo com a validacao
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails' });
    }

    //Variavel de verificacao de email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    //Verifica se o email existe
    if(userExists){
      return res.status(400).json({ error: 'User already exists' });
    }

    //objetos utilizaram os dados do model User, provider e para ver se e funcionario ou nao
    const {id, name, email, provider} = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async update(req,res){
    //Validacao dos campos
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => 
        oldPassword ? field.required() : field,
      ),
      confirmPassword: Yup.string().when('password', (password, field) => 
        password ? field.required().oneOf([Yup.ref('password')]) : field,
      )
    });

    //Verifica se o req.body é valido de acordo com a validacao
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails' });
    }

    //O ID do usuario esta na requisicao, ele sera utilizado para modificar o usuario
    const {email, oldPassword} = req.body;

    //Vai buscar pela primary key
    const user = await User.findByPk(req.userId);

    if (email != user.email) {
    //Variavel de verificacao de email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    //Verifica se o email existe
    if(userExists){
      return res.status(400).json({ error: 'User already exists' });
    }

    }

    //Vai fazer a alteracao apenas se o usuario quiser tentar mudar a senha
    if(oldPassword && !(await user.checkPassword(oldPassword))){
      return res.status(401).json({ error: 'Password does not match' })
    }

    const {id, name, provider} = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

export default new UserController();